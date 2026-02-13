import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Image as ImageIcon } from 'lucide-react';
import FloatingPetals from '@/components/FloatingPetals';
import { useGetLoveLetter } from '@/hooks/useQueries';
import { defaultLoveLetter } from '@/valentine/loveLetter';
import { preloadedMemoryImages } from '@/valentine/preloadedMemories';
import LocalMemoriesPicker from '@/components/LocalMemoriesPicker';

export default function ValentineMessage() {
  const [showMemories, setShowMemories] = useState(false);
  const { data: loveLetter, isLoading, isError } = useGetLoveLetter();

  // Robust fallback: use defaultLoveLetter if backend value is missing, empty, whitespace-only, or errored
  const displayLetter = 
    loveLetter && loveLetter.trim().length > 0 
      ? loveLetter 
      : defaultLoveLetter;

  return (
    <div className="min-h-screen bg-gradient-to-br from-valentine-light via-valentine-medium to-valentine-accent relative overflow-hidden">
      <FloatingPetals />
      
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center mb-8 animate-fade-in">
            <Heart className="w-16 h-16 md:w-20 md:h-20 text-valentine-primary fill-valentine-primary mx-auto mb-4 animate-pulse" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-valentine-dark mb-2" style={{ hyphens: 'none' }}>
              My Love Letter 💕
            </h1>
          </div>

          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-valentine-medium animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl text-valentine-primary text-center" style={{ hyphens: 'none' }}>
                To My Dearest Valentine
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <Heart className="w-12 h-12 text-valentine-primary fill-valentine-primary mx-auto animate-pulse" />
                  <p className="text-valentine-dark mt-4">Loading your love letter...</p>
                </div>
              ) : (
                <div className="prose prose-lg max-w-none">
                  <p className="text-valentine-dark whitespace-pre-wrap leading-relaxed text-base md:text-lg" style={{ hyphens: 'manual' }}>
                    {displayLetter}
                  </p>
                  {isError && (
                    <p className="text-valentine-primary/60 text-sm mt-4 italic text-center">
                      (Showing default message)
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Button
              onClick={() => setShowMemories(!showMemories)}
              size="lg"
              className="bg-valentine-primary text-white hover:bg-valentine-primary-dark text-lg md:text-xl px-8 py-6 rounded-full shadow-xl transition-all duration-300 hover:scale-105"
              role="button"
              aria-label={showMemories ? 'Hide our memories' : 'Open our memories'}
              tabIndex={0}
            >
              <ImageIcon className="w-6 h-6 mr-2" />
              {showMemories ? 'Hide' : 'Open'} Our Memories
            </Button>
          </div>

          {showMemories && (
            <div className="animate-fade-in">
              <LocalMemoriesPicker preloadedImages={preloadedMemoryImages} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
