'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Camera, Image as ImageIcon, Sparkles, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { generateUploadURL } from '@/app/actions/events.actions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@/lib/supabase/client';

type ImageUploadProps = {
  onUpload: (imageUrl: string, caption?: string) => Promise<void>;
  uploading: boolean;
  maxImages: number;
};

export function ImageUpload({ onUpload, uploading, maxImages }: ImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      return;
    }

    try {
      setUploadingFile(true);

      // Get upload URL from server
      const { filePath } = await generateUploadURL('temp', selectedFile.name);

      // Upload to Supabase storage
      const supabase = createClient();
      const { error: uploadError } = await supabase.storage.from('event-images').upload(filePath, selectedFile, {
        cacheControl: '3600',
        upsert: false,
      });

      if (uploadError) {
        throw new Error('Failed to upload image');
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('event-images').getPublicUrl(filePath);

      // Call the parent upload handler
      await onUpload(publicUrl, caption.trim() || undefined);

      // Reset form
      setSelectedFile(null);
      setPreview(null);
      setCaption('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upload image';
      toast.error(message);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreview(null);
    setCaption('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isUploading = uploading || uploadingFile;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* File Selection */}
        <Card className="border-gray-800 bg-gray-900/80 backdrop-blur-xl transition-all duration-300 hover:border-purple-500/30">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label className="flex items-center gap-2 font-medium text-sm text-white" htmlFor="image-upload">
                  Select Image
                  <Sparkles className="h-3 w-3 text-purple-400" />
                </Label>
                <div className="mt-2">
                  <Input
                    accept="image/*"
                    className="cursor-pointer border-gray-700 bg-gray-800/50 text-gray-300 transition-all duration-300 file:border-0 file:bg-purple-500/20 file:text-purple-300 hover:border-purple-500/50 hover:bg-gray-800 file:hover:bg-purple-500/30 focus:border-purple-500 focus:ring-purple-500/20"
                    disabled={isUploading}
                    id="image-upload"
                    onChange={handleFileSelect}
                    ref={fileInputRef}
                    type="file"
                  />
                </div>
                <p className="mt-1 text-gray-500 text-xs">
                  Max file size: 10MB. Supported formats: JPG, PNG, GIF, WebP
                </p>
              </div>

              <AnimatePresence>
                {preview && (
                  <motion.div
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-2"
                    exit={{ opacity: 0, scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Label className="font-medium text-sm text-white">Preview</Label>
                    <div className="group relative">
                      <Image
                        alt="Preview"
                        className="h-48 w-full rounded-xl border border-gray-800 object-cover transition-all duration-300 group-hover:border-purple-500/30"
                        src={preview}
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <Button
                        className="absolute top-2 right-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        disabled={isUploading}
                        onClick={handleRemoveFile}
                        size="sm"
                        variant="destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        {/* Caption and Upload */}
        <Card className="border-gray-800 bg-gray-900/80 backdrop-blur-xl transition-all duration-300 hover:border-purple-500/30">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label className="font-medium text-sm text-white" htmlFor="caption">
                  Caption (Optional)
                </Label>
                <Textarea
                  className="mt-2 border-gray-700 bg-gray-800/50 text-white transition-all duration-300 placeholder:text-gray-500 hover:border-purple-500/50 focus:border-purple-500 focus:ring-purple-500/20"
                  disabled={isUploading}
                  id="caption"
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Add a caption to your photo..."
                  rows={3}
                  value={caption}
                />
              </div>

              <div className="space-y-2">
                <Button
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg transition-all duration-300 hover:from-purple-600 hover:to-purple-700 hover:shadow-purple-500/25 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!selectedFile || isUploading}
                  onClick={handleUpload}
                  size="lg"
                >
                  {isUploading ? (
                    <>
                      <Upload className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Camera className="mr-2 h-4 w-4" />
                      Upload Photo
                    </>
                  )}
                </Button>

                <p className="text-center text-gray-500 text-xs">
                  {maxImages > 0 ? (
                    <span className="text-purple-400">{maxImages} photos</span>
                  ) : (
                    <span className="text-red-400">No photos</span>
                  )}{' '}
                  remaining
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {maxImages <= 0 && (
        <motion.div animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 10 }} transition={{ duration: 0.3 }}>
          <Alert className="border-yellow-500/30 bg-yellow-500/10 backdrop-blur-sm">
            <ImageIcon className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-yellow-300">
              You have reached the maximum number of photos for this event.
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
    </div>
  );
}
