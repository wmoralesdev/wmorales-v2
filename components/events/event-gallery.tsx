'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageUpload } from '@/components/events/image-upload';
import { ImageGrid } from '@/components/events/image-grid';
import { subscribeToEventUpdates } from '@/lib/supabase/realtime';
import { getUserEventImages, uploadEventImage, deleteEventImage } from '@/app/actions/events.actions';
import { Camera, Upload, Users, Image, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

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

export function EventGallery({ event }: EventGalleryProps) {
  const [images, setImages] = useState<EventImage[]>(event.images);
  const [userImages, setUserImages] = useState<EventImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeViewers, setActiveViewers] = useState(0);
  const [selectedImage, setSelectedImage] = useState<EventImage | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  // Load user's images
  useEffect(() => {
    const loadUserImages = async () => {
      try {
        const userEventImages = await getUserEventImages(event.id);
        setUserImages(userEventImages);
      } catch (error) {
        console.error('Failed to load user images:', error);
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
          setImages(prev => [newImage, ...prev]);
          toast.success('New photo uploaded!');
        } else if (update.type === 'image_deleted' && update.imageId) {
          setImages(prev => prev.filter(img => img.id !== update.imageId));
          setUserImages(prev => prev.filter(img => img.id !== update.imageId));
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

  const handleImageUpload = useCallback(async (imageUrl: string, caption?: string) => {
    try {
      setUploading(true);
      await uploadEventImage({
        eventId: event.id,
        imageUrl,
        caption,
      });
      
      setShowUploadDialog(false);
      toast.success('Photo uploaded successfully!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upload photo';
      toast.error(message);
    } finally {
      setUploading(false);
    }
  }, [event.id]);

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Image className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{images.length}</p>
                <p className="text-sm text-muted-foreground">Total Photos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{activeViewers}</p>
                <p className="text-sm text-muted-foreground">Active Viewers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{userImageCount}/{event.maxImages}</p>
                <p className="text-sm text-muted-foreground">Your Photos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Section */}
      {!isEventEnded && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Photos
            </CardTitle>
            <CardDescription>
              Share your photos from this event. You can upload up to {event.maxImages} photos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {canUpload ? (
              <div className="space-y-4">
                <ImageUpload
                  onUpload={handleImageUpload}
                  uploading={uploading}
                  maxImages={event.maxImages - userImageCount}
                />
                
                {userImageCount > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Your Photos</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                      {userImages.map((image) => (
                        <div key={image.id} className="relative group">
                          <img
                            src={image.imageUrl}
                            alt={image.caption || 'Event photo'}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <Button
                            size="sm"
                            variant="destructive"
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleImageDelete(image.id)}
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
              <Alert>
                <AlertDescription>
                  You have reached the maximum number of photos ({event.maxImages}) for this event.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Gallery */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Event Gallery
          </CardTitle>
          <CardDescription>
            {images.length === 0 
              ? 'No photos uploaded yet. Be the first to share!'
              : `${images.length} photos shared by attendees`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : (
            <ImageGrid
              images={images}
              onImageClick={setSelectedImage}
            />
          )}
        </CardContent>
      </Card>

      {/* Image Preview Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Photo Preview</DialogTitle>
            <DialogDescription>
              {selectedImage?.caption || 'No caption provided'}
            </DialogDescription>
          </DialogHeader>
          {selectedImage && (
            <div className="space-y-4">
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.caption || 'Event photo'}
                className="w-full rounded-lg"
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  Uploaded {formatDistanceToNow(new Date(selectedImage.createdAt), { addSuffix: true })}
                </span>
                {userImages.some(img => img.id === selectedImage.id) && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      handleImageDelete(selectedImage.id);
                      setSelectedImage(null);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}