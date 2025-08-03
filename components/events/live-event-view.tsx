'use client';

import type { EventImage } from '@prisma/client';
import { Camera, Eye, Sparkles } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ImageUpload } from '@/components/events/image-upload';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useAuth } from '@/components/auth/auth-provider';
import { useUserEventImages } from '@/hooks/use-user-event-images';
import { subscribeToEventUpdates } from '@/lib/supabase/realtime';
import { LiveEventHeader } from './live-event-header';
import { EventStats } from './event-stats';
import { PhotoCarousel } from './photo-carousel';
import { PhotoGrid } from './photo-grid';
import { QRCodeDialog } from './qr-code-dialog';
import { ImageLightbox } from './image-lightbox';
import { sortImagesByDate, getEventUrl } from './utils';
import { EventFullDetails } from './types';

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
  const t = useTranslations('events');
  const locale = useLocale();
  const { user } = useAuth();
  const [activeViewers, setActiveViewers] = useState(1); // Start with 1 (current user)
  const [showQRCode, setShowQRCode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<EventImage | null>(null);
  const [eventImages, setEventImages] = useState<EventImage[]>(event.images);

  const { userImages, isLoading: isLoadingUserImages } = useUserEventImages(
    event.id
  );
  const userImageCount = userImages.length;
  const canUpload = userImageCount < event.maxImages;

  // Get event URL for QR code
  const eventUrl = getEventUrl(event.slug);

  // Subscribe to realtime updates
  useEffect(() => {
    const channel = subscribeToEventUpdates(
      event.id,
      (update) => {
        if (update.type === 'image_uploaded' && update.image) {
          // Add new image to the list
          setEventImages((prev) => [
            {
              id: update.image!.id,
              eventId: event.id,
              userId: update.image!.userId,
              imageUrl: update.image!.imageUrl,
              caption: update.image!.caption || null,
              createdAt: new Date(update.image!.createdAt),
            },
            ...prev,
          ]);
        } else if (update.type === 'image_deleted' && update.imageId) {
          // Remove deleted image from the list
          setEventImages((prev) =>
            prev.filter((img) => img.id !== update.imageId)
          );
          // Also remove from selected image if it's the one being deleted
          setSelectedImage((prev) =>
            prev?.id === update.imageId ? null : prev
          );
        }
      },
      (count) => {
        setActiveViewers(count);
      }
    );

    return () => {
      channel.unsubscribe();
    };
  }, [event.id]);

  // Auto-cycle through photos for live slideshow
  useEffect(() => {
    if (eventImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentPhotoIndex((prev) => (prev + 1) % eventImages.length);
    }, 5000); // Change photo every 5 seconds

    return () => clearInterval(interval);
  }, [eventImages.length]);

  const handleImageUpload = async (imageUrl: string, caption?: string) => {
    setUploading(true);
    try {
      await onImageUpload(imageUrl, caption);
      toast.success(t('photoUploaded'));
    } catch (error) {
      toast.error(t('uploadError'));
    } finally {
      setUploading(false);
    }
  };

  const handleImageDelete = (imageId: string) => {
    onImageDelete(imageId);
  };

  const sortedImages = sortImagesByDate(eventImages);

  return (
    <div className="sm:container mx-auto px-0 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Header Section */}
      <LiveEventHeader
        activeViewers={activeViewers}
        onShowQRCode={() => setShowQRCode(true)}
        eventSlug={event.slug}
        locale={locale}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 sm:gap-6 lg:gap-8">
        {/* Left Column - Upload & Stats */}
        <div className="space-y-0 sm:space-y-6">
          {/* Upload Section */}
          <Card className="border-0 sm:border border-gray-800 bg-gray-900/80 backdrop-blur-xl rounded-none sm:rounded-lg shadow-none sm:shadow-md">
            <CardContent className="px-0 lg:px-6">
              {canUpload ? (
                <ImageUpload
                  maxImages={event.maxImages - userImageCount}
                  onUpload={handleImageUpload}
                  slug={event.slug}
                  uploading={uploading}
                  isLoadingUserImages={isLoadingUserImages}
                />
              ) : (
                <Alert className="border-purple-500/30 bg-purple-500/10">
                  <Sparkles className="h-4 w-4" />
                  <AlertDescription className="text-purple-300">
                    {t('maxPhotosReached', { maxImages: event.maxImages })}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Event Stats */}
          <EventStats
            stats={{
              totalPhotos: eventImages.length,
              contributors: event.contributors,
              createdAt: event.createdAt,
            }}
            locale={locale}
            variant="live"
          />
        </div>

        {/* Middle Column - Live Photo Carousel */}
        <div className="lg:col-span-2">
          <Card className="border-0 sm:border border-gray-800 bg-gray-900/80 backdrop-blur-xl h-full rounded-none sm:rounded-lg shadow-none sm:shadow-md border-t sm:border-t-0">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <Eye className="h-5 w-5 text-purple-400" />
                {t('livePhotoWall')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
              {eventImages.length > 0 ? (
                <div className="space-y-4 sm:space-y-6">
                  {/* Main Carousel */}
                  <PhotoCarousel
                    images={eventImages}
                    currentIndex={currentPhotoIndex}
                    onIndexChange={setCurrentPhotoIndex}
                  />

                  {/* Instagram-style Photo Grid */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-400">
                        {t('allPhotos')} ({eventImages.length})
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                        {t('updatingLive')}
                      </div>
                    </div>
                    <PhotoGrid
                      images={sortedImages}
                      onImageClick={(image) => setSelectedImage(image)}
                      onImageDelete={(imageId) => handleImageDelete(imageId)}
                      currentUserId={user?.id}
                      locale={locale}
                    />
                  </div>
                </div>
              ) : (
                <div className="aspect-[16/9] bg-gray-800/50 rounded-lg flex items-center justify-center mx-0 sm:mx-0">
                  <div className="text-center p-8">
                    <Camera className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg mb-2">
                      {t('beFirstToShare')}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {t('uploadPhotoPrompt')}
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
        open={showQRCode}
        onOpenChange={setShowQRCode}
        eventUrl={eventUrl}
      />

      {/* Image Lightbox */}
      <ImageLightbox
        selectedImage={selectedImage}
        onClose={() => setSelectedImage(null)}
        locale={locale}
        showNavigation={false}
      />
    </div>
  );
}
