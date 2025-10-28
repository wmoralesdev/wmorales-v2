"use client";

import { Camera, Eye, Sparkles } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/auth-provider";
import { AuthenticatedImageUpload } from "@/components/events/authenticated-image-upload";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserEventImages } from "@/hooks/use-user-event-images";
import { useLiveEventStore } from "@/lib/stores/live-event-store";
import { subscribeToEventUpdates } from "@/lib/supabase/realtime";
import type { EventFullDetails } from "../../lib/types/event.types";
import { EventStats } from "./event-stats";
import { ImageLightbox } from "./image-lightbox";
import { LiveEventHeader } from "./live-event-header";
import { PhotoCarousel } from "./photo-carousel";
import { PhotoGrid } from "./photo-grid";
import { QRCodeDialog } from "./qr-code-dialog";
import { getEventUrl, sortImagesByDate } from "./utils";

type LiveEventViewProps = {
  event: EventFullDetails;
  onImageUpload: (imageUrl: string, caption?: string) => Promise<void>;
  onImageDelete: (imageId: string) => void;
};

export function LiveEventView({
  event,
  onImageUpload,
  onImageDelete,
}: LiveEventViewProps) {
  const t = useTranslations("events");
  const locale = useLocale();
  const { user } = useAuth();

  // Zustand store
  const {
    activeViewers,
    showQRCode,
    uploading,
    currentPhotoIndex,
    selectedImage,
    eventImages,
    setActiveViewers,
    setShowQRCode,
    setUploading,
    setCurrentPhotoIndex,
    setSelectedImage,
    setEventImages,
    addEventImage,
    removeEventImage,
  } = useLiveEventStore();

  const { userImages, isLoading: isLoadingUserImages } = useUserEventImages(
    event.id
  );
  const userImageCount = userImages.length;
  const canUpload = userImageCount < event.maxImages;

  // Get event URL for QR code
  const eventUrl = getEventUrl(event.slug);

  // Initialize event images from props
  useEffect(() => {
    setEventImages(event.images);
  }, [event.images, setEventImages]);

  // Subscribe to realtime updates
  useEffect(() => {
    const channel = subscribeToEventUpdates(
      event.id,
      (update) => {
        if (update.type === "image_uploaded" && update.image) {
          // Add new image to the list
          addEventImage({
            id: update.image!.id,
            eventId: event.id,
            profileId: update.image!.profileId,
            imageUrl: update.image!.imageUrl,
            caption: update.image!.caption || null,
            createdAt: new Date(update.image!.createdAt),
            profile: {
              name: update.image!.profile.name,
              avatar: update.image!.profile.avatar || undefined,
            },
          });
        } else if (update.type === "image_deleted" && update.imageId) {
          // Remove deleted image from the list
          removeEventImage(update.imageId);
        }
      },
      (count) => {
        setActiveViewers(count);
      }
    );

    return () => {
      channel.unsubscribe();
    };
  }, [event.id, addEventImage, removeEventImage, setActiveViewers]);

  // Auto-cycle through photos for live slideshow
  useEffect(() => {
    if (eventImages.length === 0) return;

    const interval = setInterval(() => {
      const nextIndex = (currentPhotoIndex + 1) % eventImages.length;
      setCurrentPhotoIndex(nextIndex);
    }, 5000); // Change photo every 5 seconds

    return () => clearInterval(interval);
  }, [eventImages.length, currentPhotoIndex, setCurrentPhotoIndex]);

  const handleImageUpload = async (imageUrl: string, caption?: string) => {
    setUploading(true);
    try {
      await onImageUpload(imageUrl, caption);
    } catch (error) {
      toast.error(t("uploadError"));
    } finally {
      setUploading(false);
    }
  };

  const handleImageDelete = (imageId: string) => {
    onImageDelete(imageId);
  };

  const sortedImages = sortImagesByDate(eventImages);

  return (
    <div className="mx-auto px-0 py-4 sm:container sm:px-6 sm:py-8 lg:px-8">
      {/* Header Section */}
      <LiveEventHeader
        activeViewers={activeViewers}
        eventSlug={event.slug}
        locale={locale}
        onShowQRCode={() => setShowQRCode(true)}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-0 sm:gap-6 lg:grid-cols-3 lg:gap-8">
        {/* Left Column - Upload & Stats */}
        <div className="space-y-0 sm:space-y-6">
          {/* Upload Section */}
          <Card className="rounded-none border-0 border-gray-800 bg-gray-900/80 shadow-none backdrop-blur-xl sm:rounded-lg sm:border sm:shadow-md">
            <CardContent className="px-0 lg:px-6">
              {canUpload ? (
                <AuthenticatedImageUpload
                  isLoadingUserImages={isLoadingUserImages}
                  maxImages={event.maxImages - userImageCount}
                  onUpload={handleImageUpload}
                  slug={event.slug}
                  uploading={uploading}
                />
              ) : (
                <Alert className="border-purple-500/30 bg-purple-500/10">
                  <Sparkles className="h-4 w-4" />
                  <AlertDescription className="text-purple-300">
                    {t("maxPhotosReached", { maxImages: event.maxImages })}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Event Stats */}
          <EventStats
            locale={locale}
            stats={{
              totalPhotos: eventImages.length,
              contributors: event.contributors,
              createdAt: event.createdAt,
            }}
            variant="live"
          />
        </div>

        {/* Middle Column - Live Photo Carousel */}
        <div className="lg:col-span-2">
          <Card className="h-full rounded-none border-0 border-gray-800 border-t bg-gray-900/80 shadow-none backdrop-blur-xl sm:rounded-lg sm:border sm:border-t-0 sm:shadow-md">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="flex items-center gap-2 text-white text-xl">
                <Eye className="h-5 w-5 text-purple-400" />
                {t("livePhotoWall")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              {eventImages.length > 0 ? (
                <div className="space-y-4 sm:space-y-6">
                  {/* Main Carousel */}
                  <PhotoCarousel
                    currentIndex={currentPhotoIndex}
                    images={eventImages}
                    onIndexChange={setCurrentPhotoIndex}
                  />

                  {/* Instagram-style Photo Grid */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-400 text-sm">
                        {t("allPhotos")} ({eventImages.length})
                      </h3>
                      <div className="flex items-center gap-2 text-gray-500 text-xs">
                        <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
                        {t("updatingLive")}
                      </div>
                    </div>
                    <PhotoGrid
                      currentProfileId={user?.id}
                      images={sortedImages}
                      locale={locale}
                      onImageClick={(image) => setSelectedImage(image)}
                      onImageDelete={(imageId) => handleImageDelete(imageId)}
                    />
                  </div>
                </div>
              ) : (
                <div className="mx-0 flex aspect-[16/9] items-center justify-center rounded-lg bg-gray-800/50 sm:mx-0">
                  <div className="p-8 text-center">
                    <Camera className="mx-auto mb-4 h-16 w-16 text-gray-600" />
                    <p className="mb-2 text-gray-400 text-lg">
                      {t("beFirstToShare")}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {t("uploadPhotoPrompt")}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* QR Code Dialog */}
      <QRCodeDialog
        eventUrl={eventUrl}
        onOpenChange={setShowQRCode}
        open={showQRCode}
      />

      {/* Image Lightbox */}
      <ImageLightbox
        locale={locale}
        onClose={() => setSelectedImage(null)}
        selectedImage={selectedImage}
      />
    </div>
  );
}
