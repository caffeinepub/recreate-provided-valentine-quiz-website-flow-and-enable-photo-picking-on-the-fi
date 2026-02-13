import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MemoryLightboxProps {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
}

export default function MemoryLightbox({ isOpen, imageUrl, onClose }: MemoryLightboxProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-auto h-auto p-0 bg-black/95 border-none">
        <div className="relative flex items-center justify-center w-full h-full">
          <img
            src={imageUrl}
            alt="Memory"
            className="max-w-full max-h-[90vh] w-auto h-auto object-contain"
          />
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full"
              onClick={onClose}
            >
              <X className="w-6 h-6" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
