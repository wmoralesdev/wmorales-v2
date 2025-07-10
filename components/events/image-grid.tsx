'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Image as ImageIcon } from 'lucide-react';

type EventImage = {
  id: string;
  imageUrl: string;
  caption?: string;
  createdAt: Date;
};

type ImageGridProps = {
  images: EventImage[];
  onImageClick: (image: EventImage) => void;
};

export function ImageGrid({ images, onImageClick }: ImageGridProps) {
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <ImageIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">
          No Photos Yet
        </h3>
        <p className="text-sm text-muted-foreground">
          Be the first to share a photo from this event!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {images.map((image) => (
        <div
          key={image.id}
          className="relative group cursor-pointer"
          onMouseEnter={() => setHoveredImage(image.id)}
          onMouseLeave={() => setHoveredImage(null)}
          onClick={() => onImageClick(image)}
        >
          <div className="aspect-square overflow-hidden rounded-lg bg-muted">
            <img
              src={image.imageUrl}
              alt={image.caption || 'Event photo'}
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
          </div>
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 rounded-lg flex items-center justify-center">
            <Button
              size="sm"
              variant="secondary"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
          </div>

          {/* Caption badge */}
          {image.caption && (
            <div className="absolute bottom-2 left-2 right-2">
              <Badge variant="secondary" className="text-xs truncate w-full">
                {image.caption}
              </Badge>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}