import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Image, Video, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAddMedia } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { ExternalBlob, MediaType } from '@/backend';
import { Progress } from '@/components/ui/progress';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export default function MediaUpload() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<'image' | 'video' | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addMediaMutation = useAddMedia();

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return { valid: false, error: 'File size must be less than 100MB' };
    }

    // Check file type
    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

    if (!isImage && !isVideo) {
      return { 
        valid: false, 
        error: 'Invalid file type. Please upload JPEG, PNG, MP4, MOV, or WebM files only.' 
      };
    }

    return { valid: true };
  };

  const clearPreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setPreviewType(null);
    setSelectedFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!isAuthenticated) {
      toast.error('Please log in to upload media');
      clearPreview();
      return;
    }

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      toast.error(validation.error || 'Invalid file');
      clearPreview();
      return;
    }

    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setSelectedFileName(file.name);

      // Create preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setPreviewType(isImage ? 'image' : 'video');

      // Read file as bytes
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);

      // Create ExternalBlob with progress tracking
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      const mediaType = isImage ? MediaType.image : MediaType.video;
      const id = `${Date.now()}-${file.name}`;

      await addMediaMutation.mutateAsync({
        id,
        blob,
        mediaType,
        description: file.name,
        fileName: file.name,
      });

      toast.success(`${isImage ? 'Image' : 'Video'} uploaded successfully! 💕`);
      
      // Clear preview after successful upload
      setTimeout(() => {
        clearPreview();
      }, 2000);
    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMessage = error?.message || 'Failed to upload file';
      
      if (errorMessage.includes('Unauthorized') || errorMessage.includes('authenticated')) {
        toast.error('Please log in to upload media');
      } else {
        toast.error(errorMessage);
      }
      
      clearPreview();
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="flex-1">
          <Label htmlFor="media-upload" className="sr-only">
            Upload Image or Video
          </Label>
          <Input
            ref={fileInputRef}
            id="media-upload"
            type="file"
            accept={[...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES].join(',')}
            onChange={handleFileSelect}
            disabled={isUploading || !isAuthenticated}
            className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-valentine-light file:text-valentine-primary hover:file:bg-valentine-medium disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || !isAuthenticated}
          className="bg-valentine-primary hover:bg-valentine-primary-dark text-white w-full sm:w-auto disabled:opacity-50"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </>
          )}
        </Button>
      </div>

      {isUploading && (
        <div className="space-y-2">
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-sm text-valentine-dark/60 text-center">
            Uploading {selectedFileName}... {Math.round(uploadProgress)}%
          </p>
        </div>
      )}

      {previewUrl && previewType && (
        <div className="border-2 border-valentine-primary/30 rounded-lg p-4 bg-valentine-light/30 relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 z-10"
            onClick={clearPreview}
            disabled={isUploading}
          >
            <X className="w-4 h-4" />
          </Button>
          <p className="text-sm font-semibold text-valentine-dark mb-2">Preview:</p>
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            {previewType === 'image' ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            ) : (
              <video
                src={previewUrl}
                controls
                loop
                playsInline
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 text-xs sm:text-sm text-valentine-dark/60 bg-valentine-light/30 p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <Image className="w-4 h-4 flex-shrink-0" />
          <span>Images: JPEG, PNG</span>
        </div>
        <div className="flex items-center gap-2">
          <Video className="w-4 h-4 flex-shrink-0" />
          <span>Videos: MP4, MOV, WebM</span>
        </div>
      </div>
    </div>
  );
}
