import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import MemoryLightbox from './MemoryLightbox';

interface LocalImage {
  id: string;
  url: string;
  file?: File;
  isPreloaded?: boolean;
  fileName: string;
}

interface LocalMemoriesPickerProps {
  preloadedImages?: string[];
}

export default function LocalMemoriesPicker({ preloadedImages = [] }: LocalMemoriesPickerProps) {
  const [selectedImages, setSelectedImages] = useState<LocalImage[]>([]);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize with preloaded images on mount
  useEffect(() => {
    if (preloadedImages.length > 0) {
      const preloaded: LocalImage[] = preloadedImages.map((url, index) => {
        const fileName = url.split('/').pop() || `memory-${index + 1}.jpeg`;
        return {
          id: `preloaded-${index}`,
          url,
          isPreloaded: true,
          fileName,
        };
      });
      setSelectedImages(preloaded);
    }
  }, [preloadedImages]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newImages: LocalImage[] = [];
    
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return;
      }

      const url = URL.createObjectURL(file);
      newImages.push({
        id: `${Date.now()}-${Math.random()}`,
        url,
        file,
        isPreloaded: false,
        fileName: file.name,
      });
    });

    setSelectedImages((prev) => [...prev, ...newImages]);
    toast.success(`${newImages.length} photo${newImages.length > 1 ? 's' : ''} added`);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (id: string) => {
    setSelectedImages((prev) => {
      const image = prev.find((img) => img.id === id);
      // Only revoke object URLs for locally created images, not preloaded ones
      if (image && !image.isPreloaded && image.url.startsWith('blob:')) {
        URL.revokeObjectURL(image.url);
      }
      return prev.filter((img) => img.id !== id);
    });
    toast.success('Photo removed');
  };

  const handleAddPhotosClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageError = (id: string) => {
    setImageErrors((prev) => new Set(prev).add(id));
  };

  const handleImageClick = (url: string) => {
    setLightboxImageUrl(url);
    setLightboxOpen(true);
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Select photos from device"
      />

      <Button
        onClick={handleAddPhotosClick}
        className="w-full bg-valentine-primary hover:bg-valentine-primary-dark text-white shadow-lg py-6 text-lg rounded-lg"
        role="button"
        aria-label="Add photos from your device"
      >
        <Upload className="w-5 h-5 mr-2" />
        Add Photos from Your Device
      </Button>

      {selectedImages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedImages.map((image) => {
            const hasError = imageErrors.has(image.id);
            
            return (
              <Card key={image.id} className="overflow-hidden group relative shadow-lg">
                <div className="aspect-square relative bg-valentine-light/20">
                  {!hasError ? (
                    <>
                      <img
                        src={image.url}
                        alt={image.fileName}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => handleImageClick(image.url)}
                        onError={() => handleImageError(image.id)}
                        loading="lazy"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleImageClick(image.url);
                          }
                        }}
                      />
                      
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage(image.id);
                          }}
                          className="shadow-lg pointer-events-auto"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      </div>

                      <div className="absolute top-2 right-2 bg-white/90 rounded-full p-2 shadow-md pointer-events-none">
                        <ImageIcon className="w-4 h-4 text-valentine-primary" />
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-valentine-light/50 p-4">
                      <AlertCircle className="w-12 h-12 text-valentine-primary/60 mb-3" />
                      <p className="text-valentine-dark/70 text-center text-sm font-medium mb-2">
                        Image Failed to Load
                      </p>
                      <p className="text-valentine-dark/50 text-center text-xs mb-4 line-clamp-2 px-2">
                        {image.fileName}
                      </p>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveImage(image.id)}
                        className="shadow-lg"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 border-2 border-dashed border-valentine-primary/30 rounded-lg bg-valentine-light/30">
          <ImageIcon className="w-12 h-12 md:w-16 md:h-16 mx-auto text-valentine-primary/40 mb-4" />
          <p className="text-valentine-dark/60 text-base md:text-lg px-4">
            No photos selected yet. Add some special moments!
          </p>
        </div>
      )}

      <MemoryLightbox
        isOpen={lightboxOpen}
        imageUrl={lightboxImageUrl}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}
