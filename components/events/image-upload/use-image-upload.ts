import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { generateUploadURL } from "@/app/actions/events.actions";
import { createClient } from "@/lib/supabase/client";
import { compressImage } from "@/lib/utils/image-compression";
import { createFilePreview, validateImageFile } from "../utils";

type UseImageUploadProps = {
  maxImages: number;
  slug: string;
  onUpload: (imageUrl: string, caption?: string) => Promise<void>;
};

export function useImageUpload({ maxImages, slug, onUpload }: UseImageUploadProps) {
  const t = useTranslations("events");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);
  const [captions, setCaptions] = useState<{ [key: string]: string }>({});
  const [uploadingFile, setUploadingFile] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isDragReject, setIsDragReject] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createFilePreviews = useCallback(async (files: File[]) => {
    for (const file of files) {
      try {
        const url = await createFilePreview(file);
        setPreviews((prev) => [...prev, { file, url }]);
      } catch (error) {
        console.error("Failed to create preview:", error);
      }
    }
  }, []);

  const validateAndProcessFiles = useCallback(
    async (files: File[]) => {
      const validFiles: File[] = [];

      if (selectedFiles.length + files.length > maxImages) {
        toast.error(t("tooManyFiles", { max: maxImages }));
        return false;
      }

      for (const file of files) {
        const validation = validateImageFile(file);
        if (!validation.valid) {
          toast.error(validation.error || t("invalidFile"));
          continue;
        }
        validFiles.push(file);
      }

      if (validFiles.length > 0) {
        setSelectedFiles((prev) => [...prev, ...validFiles]);
        await createFilePreviews(validFiles);
        return true;
      }
      return false;
    },
    [t, selectedFiles.length, maxImages, createFilePreviews]
  );

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }

    validateAndProcessFiles(Array.from(files));
  };

  const checkIfImageFile = useCallback(
    (items: DataTransferItemList) =>
      Array.from(items).some(
        (item) => item.kind === "file" && item.type.startsWith("image/")
      ),
    []
  );

  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const hasImageFile = checkIfImageFile(e.dataTransfer.items);
      setIsDragActive(true);
      setIsDragReject(!hasImageFile);
    },
    [checkIfImageFile]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragActive(false);
      setIsDragReject(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);
      setIsDragReject(false);
      const files = Array.from(e.dataTransfer.files);
      const imageFiles = files.filter((file) => file.type.startsWith("image/"));
      if (imageFiles.length > 0) {
        validateAndProcessFiles(imageFiles);
      } else {
        toast.error(t("selectImageFile"));
      }
    },
    [validateAndProcessFiles, t]
  );

  const compressImages = async (files: File[]): Promise<File[]> => {
    setCompressionProgress({ current: 0, total: files.length });
    const compressedFiles: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const compressedFile = await compressImage(file);
        compressedFiles.push(compressedFile);
        setCompressionProgress({ current: i + 1, total: files.length });
      } catch (error) {
        console.error(`Failed to compress ${file.name}:`, error);
        compressedFiles.push(file);
      }
    }

    setCompressionProgress(null);
    return compressedFiles;
  };

  const uploadSingleFile = async (
    file: File,
    originalFileName: string,
    supabase: ReturnType<typeof createClient>
  ): Promise<boolean> => {
    try {
      const { filePath } = await generateUploadURL(slug, file.name);
      const { error: uploadError } = await supabase.storage
        .from("event-images")
        .upload(filePath, file, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        throw new Error(t("uploadImageError"));
      }

      const { data: { publicUrl } } = supabase.storage
        .from("event-images")
        .getPublicUrl(filePath);

      const fileCaption = captions[originalFileName] || "";
      await onUpload(publicUrl, fileCaption.trim() || undefined);
      return true;
    } catch (error) {
      console.error(`Failed to upload ${file.name}:`, error);
      return false;
    }
  };

  const resetForm = () => {
    setSelectedFiles([]);
    setPreviews([]);
    setCaptions({});
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      return;
    }

    try {
      setUploadingFile(true);
      const supabase = createClient();
      let successCount = 0;
      let errorCount = 0;

      const compressedFiles = await compressImages(selectedFiles);

      for (let i = 0; i < compressedFiles.length; i++) {
        const file = compressedFiles[i];
        const originalFileName = selectedFiles[i].name;
        const success = await uploadSingleFile(file, originalFileName, supabase);
        if (success) {
          successCount++;
        } else {
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast.success(t("uploadSuccess", { count: successCount }));
      }
      if (errorCount > 0) {
        toast.error(t("uploadErrors", { count: errorCount }));
      }

      resetForm();
    } catch (error) {
      const message = error instanceof Error ? error.message : t("uploadImageError");
      toast.error(message);
    } finally {
      setUploadingFile(false);
      setCompressionProgress(null);
    }
  };

  const handleRemoveFile = (fileToRemove: File) => {
    setSelectedFiles((prev) => prev.filter((f) => f !== fileToRemove));
    setPreviews((prev) => prev.filter((p) => p.file !== fileToRemove));
    setCaptions((prev) => {
      const newCaptions = { ...prev };
      delete newCaptions[fileToRemove.name];
      return newCaptions;
    });
  };

  const handleRemoveAllFiles = () => {
    setSelectedFiles([]);
    setPreviews([]);
    setCaptions({});
    setIsDragActive(false);
    setIsDragReject(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDropZoneClick = () => {
    if (!uploadingFile && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return {
    selectedFiles,
    previews,
    uploadingFile,
    isDragActive,
    isDragReject,
    compressionProgress,
    fileInputRef,
    handleFileSelect,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleUpload,
    handleRemoveFile,
    handleRemoveAllFiles,
    handleDropZoneClick,
  };
}

