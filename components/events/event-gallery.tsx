'use client';

import { formatDistanceToNow } from 'date-fns';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { Camera, Eye, Grid3x3, Image as ImageIcon, LayoutGrid, Trash2, Upload, Users } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { deleteEventImage, getUserEventImages, uploadEventImage } from '@/app/actions/events.actions';
import { ImageGrid } from '@/components/events/image-grid';
import { ImageUpload } from '@/components/events/image-upload';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { subscribeToEventUpdates } from '@/lib/supabase/realtime';

type EventImage = {
  id: string;
  imageUrl: string;
  caption?: string;
  createdAt: Date;
};

type Event = {
  id: string;
  title: string;
  description: string | null;
  qrCode: string;
  maxImages: number;
  createdAt: Date;
  endsAt: Date | null;
  images: EventImage[];
};

type EventGalleryProps = {
  event: Event;
};

const statsVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: 'easeOut',
    },
  }),
};

export function EventGallery({ event }: EventGalleryProps) {
  const [images, setImages] = useState<EventImage[]>(event.images);
  const [userImages, setUserImages] = useState<EventImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeViewers, setActiveViewers] = useState(0);
  const [selectedImage, setSelectedImage] = useState<EventImage | null>(null);
  const [galleryLayout, setGalleryLayout] = useState<'grid' | 'masonry'>('masonry');

  // Load user's images
  useEffect(() => {
    const loadUserImages = async () => {
      try {
        const userEventImages = await getUserEventImages(event.id);
        setUserImages(
          userEventImages.map((image) => ({
            ...image,
            caption: image.caption || undefined,
            createdAt: new Date(image.createdAt),
          }))
        );
      } finally {
        setLoading(false);
      }
    };

    loadUserImages();
  }, [event.id]);

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = subscribeToEventUpdates(
      event.id,
      (update) => {
        if (update.type === 'image_uploaded' && update.image) {
          const newImage: EventImage = {
            ...update.image,
            createdAt: new Date(update.image.createdAt),
          };
          setImages((prev) => [newImage, ...prev]);
          toast.success('New photo uploaded!');
        } else if (update.type === 'image_deleted' && update.imageId) {
          setImages((prev) => prev.filter((img) => img.id !== update.imageId));
          setUserImages((prev) => prev.filter((img) => img.id !== update.imageId));
          toast.success('Photo deleted');
        }
      },
      (viewersCount) => {
        setActiveViewers(viewersCount);
      }
    );

    return () => {
      channel.unsubscribe();
    };
  }, [event.id]);

  const handleImageUpload = useCallback(
    async (imageUrl: string, caption?: string) => {
      try {
        setUploading(true);
        await uploadEventImage({
          eventId: event.id,
          imageUrl,
          caption,
        });

        toast.success('Photo uploaded successfully!');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to upload photo';
        toast.error(message);
      } finally {
        setUploading(false);
      }
    },
    [event.id]
  );

  const handleImageDelete = useCallback(async (imageId: string) => {
    try {
      await deleteEventImage(imageId);
      toast.success('Photo deleted successfully!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete photo';
      toast.error(message);
    }
  }, []);

  const userImageCount = userImages.length;
  const canUpload = userImageCount < event.maxImages;
  const isEventEnded = event.endsAt && new Date() > event.endsAt;

  return (
    <div className="space-y-6">
      {/* Event Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <motion.div animate="visible" custom={0} initial="hidden" variants={statsVariants}>
          <Card className="border-gray-800 bg-gray-900/80 backdrop-blur-xl transition-all hover:border-purple-500/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-purple-500/20 p-3">
                  <ImageIcon className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="font-bold text-2xl text-white">{images.length}</p>
                  <p className="text-gray-400 text-sm">Total Photos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div animate="visible" custom={1} initial="hidden" variants={statsVariants}>
          <Card className="border-gray-800 bg-gray-900/80 backdrop-blur-xl transition-all hover:border-purple-500/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-green-500/20 p-3">
                  <Users className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="font-bold text-2xl text-white">{activeViewers}</p>
                  <p className="text-gray-400 text-sm">Active Viewers</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div animate="visible" custom={2} initial="hidden" variants={statsVariants}>
          <Card className="border-gray-800 bg-gray-900/80 backdrop-blur-xl transition-all hover:border-purple-500/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-purple-500/20 p-3">
                  <Camera className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="font-bold text-2xl text-white">
                    {userImageCount}/{event.maxImages}
                  </p>
                  <p className="text-gray-400 text-sm">Your Photos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Upload Section */}
      {!isEventEnded && (
        <Card className="border-gray-800 bg-gray-900/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Upload className="h-5 w-5 text-purple-400" />
              Upload Photos
            </CardTitle>
            <CardDescription className="text-gray-400">
              Share your photos from this event. You can upload up to {event.maxImages} photos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {canUpload ? (
              <div className="space-y-4">
                <ImageUpload
                  maxImages={event.maxImages - userImageCount}
                  onUpload={handleImageUpload}
                  uploading={uploading}
                />

                {userImageCount > 0 && (
                  <div className="mt-6">
                    <h3 className="mb-3 font-semibold text-lg text-white">Your Photos</h3>
                    <div className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-6">
                      {userImages.map((image) => (
                        <div className="group relative" key={image.id}>
                          <div className="aspect-square overflow-hidden rounded-lg bg-gray-800">
                            <Image
                              alt={image.caption || 'Event photo'}
                              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-110"
                              src={image.imageUrl}
                            />
                          </div>
                          <Button
                            className="absolute top-2 right-2 opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
                            onClick={() => handleImageDelete(image.id)}
                            size="sm"
                            variant="destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Alert className="border-purple-500/30 bg-purple-500/10">
                <AlertDescription className="text-purple-300">
                  You have reached the maximum number of photos ({event.maxImages}) for this event.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Gallery */}
      <Card className="border-gray-800 bg-gray-900/80 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-white">
                <Eye className="h-5 w-5 text-purple-400" />
                Event Gallery
              </CardTitle>
              <CardDescription className="text-gray-400">
                {images.length === 0
                  ? 'No photos uploaded yet. Be the first to share!'
                  : `${images.length} photos shared by attendees`}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                className={
                  galleryLayout === 'grid'
                    ? 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
                    : 'border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white'
                }
                onClick={() => setGalleryLayout('grid')}
                size="sm"
                variant={galleryLayout === 'grid' ? 'default' : 'outline'}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                className={
                  galleryLayout === 'masonry'
                    ? 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
                    : 'border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white'
                }
                onClick={() => setGalleryLayout('masonry')}
                size="sm"
                variant={galleryLayout === 'masonry' ? 'default' : 'outline'}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: use as skeleton, irrelevant
                <Skeleton className="h-32 w-full bg-gray-800" key={i} />
              ))}
            </div>
          ) : (
            <ImageGrid images={images} onImageClick={setSelectedImage} />
          )}
        </CardContent>
      </Card>

      {/* Image Preview Dialog */}
      <AnimatePresence>
        {selectedImage && (
          <Dialog onOpenChange={() => setSelectedImage(null)} open={!!selectedImage}>
            <DialogContent className="max-w-4xl border-gray-800 bg-gray-900/95 backdrop-blur-xl">
              <DialogHeader>
                <DialogTitle className="text-white">Photo Preview</DialogTitle>
                <DialogDescription className="text-gray-400">
                  {selectedImage?.caption || 'No caption provided'}
                </DialogDescription>
              </DialogHeader>
              {selectedImage && (
                <motion.div
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                  exit={{ opacity: 0, scale: 0.9 }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="relative overflow-hidden rounded-lg bg-gray-800">
                    <Image
                      alt={selectedImage.caption || 'Event photo'}
                      className="max-h-[70vh] w-full object-contain"
                      src={selectedImage.imageUrl}
                    />
                  </div>
                  <div className="flex items-center justify-between text-gray-400 text-sm">
                    <span>Uploaded {formatDistanceToNow(new Date(selectedImage.createdAt), { addSuffix: true })}</span>
                    {userImages.some((img) => img.id === selectedImage.id) && (
                      <Button
                        onClick={() => {
                          handleImageDelete(selectedImage.id);
                          setSelectedImage(null);
                        }}
                        size="sm"
                        variant="destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}
