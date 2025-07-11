'use client';

import { motion } from 'framer-motion';
import { Eye, Image as ImageIcon, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

export function ImageGrid({ images, onImageClick }: ImageGridProps) {
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  if (images.length === 0) {
    return (
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className='py-16 text-center'
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <div className='mx-auto max-w-md rounded-2xl border border-gray-800 bg-gray-900/80 p-12 backdrop-blur-xl'>
          <div className="relative">
            <ImageIcon className='mx-auto mb-6 h-20 w-20 text-gray-600' />
            <Sparkles className='-top-2 -right-2 absolute h-6 w-6 animate-pulse text-purple-400' />
          </div>
          <h3 className='mb-3 font-semibold text-white text-xl'>No Photos Yet</h3>
          <p className='text-gray-400 text-sm'>Be the first to share a photo from this event!</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      animate="visible"
      className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'
      initial="hidden"
      variants={containerVariants}
    >
      {images.map((image, index) => (
        <motion.div
          className='group relative cursor-pointer'
          key={image.id}
          onClick={() => onImageClick(image)}
          onMouseEnter={() => setHoveredImage(image.id)}
          onMouseLeave={() => setHoveredImage(null)}
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
        >
          <div className='aspect-square overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 transition-all duration-300 group-hover:border-purple-500/50 group-hover:shadow-lg group-hover:shadow-purple-500/20'>
            <img
              alt={image.caption || 'Event photo'}
              className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-110'
              loading="lazy"
              src={image.imageUrl}
            />
          </div>

          {/* Overlay */}
          <div className='absolute inset-0 flex items-end justify-center rounded-xl bg-gradient-to-t from-black/80 via-black/20 to-transparent pb-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
            <Button
              className='border-0 bg-purple-500/90 text-white shadow-lg backdrop-blur-sm hover:bg-purple-600/90'
              size="sm"
            >
              <Eye className='mr-2 h-4 w-4' />
              View
            </Button>
          </div>

          {/* Caption badge */}
          {image.caption && (
            <motion.div
              animate={{ opacity: hoveredImage === image.id ? 1 : 0, y: hoveredImage === image.id ? 0 : 10 }}
              className='absolute right-2 bottom-2 left-2'
              initial={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <Badge
                className='w-full truncate border-purple-500/30 bg-black/80 text-purple-300 text-xs backdrop-blur-sm'
                variant="outline"
              >
                {image.caption}
              </Badge>
            </motion.div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
