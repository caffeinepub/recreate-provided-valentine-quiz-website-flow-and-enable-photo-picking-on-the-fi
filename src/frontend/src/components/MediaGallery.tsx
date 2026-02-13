import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Image as ImageIcon, Video as VideoIcon, Loader2, Download, AlertCircle, Play } from 'lucide-react';
import { toast } from 'sonner';
import { useDeleteMedia } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import type { MediaItem } from '@/backend';
import { MediaType } from '@/backend';
import MemoryLightbox from './MemoryLightbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface MediaGalleryProps {
  items: MediaItem[];
  isLoading: boolean;
}

export default function MediaGallery({ items, isLoading }: MediaGalleryProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const deleteMediaMutation = useDeleteMedia();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [videoErrors, setVideoErrors] = useState<Set<string>>(new Set());
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [loadingVideos, setLoadingVideos] = useState<Set<string>>(new Set());
  const [videoPosterUrls, setVideoPosterUrls] = useState<Map<string, string>>(new Map());
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string>('');

  const handleDelete = async (id: string) => {
    if (!isAuthenticated) {
      toast.error('Please log in to delete media');
      return;
    }

    try {
      setDeletingId(id);
      await deleteMediaMutation.mutateAsync(id);
      toast.success('Media deleted successfully');
    } catch (error: any) {
      console.error('Delete error:', error);
      const errorMessage = error?.message || 'Failed to delete media';
      
      if (errorMessage.includes('Unauthorized') || errorMessage.includes('authenticated')) {
        toast.error('Please log in to delete media');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleVideoError = (id: string, event: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const videoElement = event.currentTarget;
    console.error(`Video playback error for item ${id}:`, {
      error: videoElement.error,
      networkState: videoElement.networkState,
      readyState: videoElement.readyState,
    });
    setVideoErrors((prev) => new Set(prev).add(id));
    setLoadingVideos((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const handleVideoLoadStart = (id: string) => {
    setLoadingVideos((prev) => new Set(prev).add(id));
    setVideoErrors((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const handleVideoCanPlay = (id: string) => {
    setLoadingVideos((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const handleImageError = (id: string) => {
    setImageErrors((prev) => new Set(prev).add(id));
  };

  const handleImageClick = (url: string) => {
    setLightboxImageUrl(url);
    setLightboxOpen(true);
  };

  const getMimeType = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'webm':
        return 'video/webm';
      case 'mov':
        return 'video/quicktime';
      case 'mp4':
      default:
        return 'video/mp4';
    }
  };

  const handleDownload = (url: string, fileName: string) => {
    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'media-file';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Download started');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file');
    }
  };

  const handleRetryVideo = (id: string) => {
    setVideoErrors((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
    setLoadingVideos((prev) => new Set(prev).add(id));
  };

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      videoPosterUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [videoPosterUrls]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="w-12 h-12 text-valentine-primary animate-spin" />
        <p className="text-valentine-dark/70 text-base md:text-lg">
          Loading your precious memories... 📸
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-valentine-primary/30 rounded-lg bg-valentine-light/30">
        <ImageIcon className="w-12 h-12 md:w-16 md:h-16 mx-auto text-valentine-primary/40 mb-4" />
        <p className="text-valentine-dark/60 text-base md:text-lg px-4">
          No memories uploaded yet. Start adding your special moments!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const mediaUrl = item.blob.getDirectURL();
          const itemIsVideo = item.mediaType === MediaType.video;
          const itemIsImage = item.mediaType === MediaType.image;
          const hasVideoError = videoErrors.has(item.id);
          const hasImageError = imageErrors.has(item.id);
          const isVideoLoading = loadingVideos.has(item.id);
          const fileName = item.fileName || item.description || 'media-file';
          const mimeType = getMimeType(fileName);

          return (
            <Card key={item.id} className="overflow-hidden group relative shadow-lg hover:shadow-xl transition-shadow">
              <div className="aspect-square relative bg-valentine-light/20">
                {itemIsImage && !hasImageError && (
                  <>
                    <img
                      src={mediaUrl}
                      alt={item.description || 'Memory'}
                      className="w-full h-full object-cover cursor-pointer"
                      loading="lazy"
                      onClick={() => handleImageClick(mediaUrl)}
                      onError={() => handleImageError(item.id)}
                    />
                  </>
                )}
                {itemIsImage && hasImageError && (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-valentine-light/50 p-4">
                    <AlertCircle className="w-12 h-12 md:w-16 md:h-16 text-valentine-primary/60 mb-3" />
                    <p className="text-valentine-dark/70 text-center text-sm font-medium mb-2">
                      Image Failed to Load
                    </p>
                    <p className="text-valentine-dark/50 text-center text-xs mb-4 line-clamp-2 px-2">
                      {fileName}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-valentine-primary text-valentine-primary hover:bg-valentine-light"
                      onClick={() => handleDownload(mediaUrl, fileName)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                )}
                {itemIsVideo && !hasVideoError && (
                  <div className="relative w-full h-full bg-black">
                    {isVideoLoading && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-valentine-light/50 z-10">
                        <Loader2 className="w-8 h-8 text-valentine-primary animate-spin mb-2" />
                        <p className="text-xs text-valentine-dark/70">Loading video...</p>
                      </div>
                    )}
                    <video
                      key={`${item.id}-${mediaUrl}`}
                      autoPlay
                      muted
                      controls
                      loop
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-contain"
                      onError={(e) => handleVideoError(item.id, e)}
                      onLoadStart={() => handleVideoLoadStart(item.id)}
                      onCanPlay={() => handleVideoCanPlay(item.id)}
                      onLoadedData={() => handleVideoCanPlay(item.id)}
                      controlsList="nodownload"
                      poster={videoPosterUrls.get(item.id)}
                    >
                      <source src={mediaUrl} type={mimeType} />
                      <source src={mediaUrl} type="video/mp4" />
                      <source src={mediaUrl} type="video/webm" />
                      <source src={mediaUrl} type="video/quicktime" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
                {itemIsVideo && hasVideoError && (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-valentine-light/50 p-4">
                    <AlertCircle className="w-12 h-12 md:w-16 md:h-16 text-valentine-primary/60 mb-3" />
                    <p className="text-valentine-dark/70 text-center text-sm font-medium mb-2">
                      Video Preview Unavailable
                    </p>
                    <p className="text-valentine-dark/50 text-center text-xs mb-4 line-clamp-2 px-2">
                      {fileName}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-valentine-primary text-valentine-primary hover:bg-valentine-light"
                        onClick={() => handleRetryVideo(item.id)}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Retry
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-valentine-primary text-valentine-primary hover:bg-valentine-light"
                        onClick={() => handleDownload(mediaUrl, fileName)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                )}
                
                {isAuthenticated && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center touch-manipulation">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={deletingId === item.id}
                          className="shadow-lg"
                        >
                          {deletingId === item.id ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </>
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this memory?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this {itemIsImage ? 'image' : 'video'}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(item.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}

                <div className="absolute top-2 right-2 bg-white/90 rounded-full p-2 shadow-md">
                  {itemIsImage ? (
                    <ImageIcon className="w-4 h-4 text-valentine-primary" />
                  ) : (
                    <VideoIcon className="w-4 h-4 text-valentine-primary" />
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <MemoryLightbox
        isOpen={lightboxOpen}
        imageUrl={lightboxImageUrl}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}
