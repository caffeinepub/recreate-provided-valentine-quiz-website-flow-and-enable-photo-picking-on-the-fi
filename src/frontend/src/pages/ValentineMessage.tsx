import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Heart, Image as ImageIcon, Edit, Save, X, Eraser } from 'lucide-react';
import FloatingPetals from '@/components/FloatingPetals';
import { useGetLoveLetter, useSaveLoveLetter } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { preloadedMemoryImages } from '@/valentine/preloadedMemories';
import LocalMemoriesPicker from '@/components/LocalMemoriesPicker';

export default function ValentineMessage() {
  const [showMemories, setShowMemories] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedLetter, setEditedLetter] = useState('');
  const [saveError, setSaveError] = useState<string | null>(null);
  
  const { data: loveLetter, isLoading, isError } = useGetLoveLetter();
  const { mutate: saveLoveLetter, isPending: isSaving } = useSaveLoveLetter();
  const { login, identity } = useInternetIdentity();

  const isAuthenticated = !!identity;

  // Check if the backend letter is truly empty (empty string or whitespace only)
  const hasLetter = loveLetter && loveLetter.trim().length > 0;

  const handleEditClick = () => {
    // Start editing from the backend value only (empty if no letter exists)
    setEditedLetter(loveLetter || '');
    setIsEditing(true);
    setSaveError(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedLetter('');
    setSaveError(null);
  };

  const handleClearClick = () => {
    setEditedLetter('');
  };

  const handleSaveClick = async () => {
    if (!isAuthenticated) {
      try {
        await login();
      } catch (error) {
        setSaveError('Please sign in to save your love letter.');
        return;
      }
    }

    saveLoveLetter(editedLetter, {
      onSuccess: () => {
        setIsEditing(false);
        setEditedLetter('');
        setSaveError(null);
      },
      onError: (error: any) => {
        setSaveError(error?.message || 'Failed to save your love letter. Please try again.');
      },
    });
  };

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
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl md:text-3xl text-valentine-primary text-center flex-1" style={{ hyphens: 'none' }}>
                  To My Dearest Valentine
                </CardTitle>
                {!isEditing && (
                  <Button
                    onClick={handleEditClick}
                    variant="ghost"
                    size="icon"
                    className="text-valentine-primary hover:text-valentine-primary-dark hover:bg-valentine-light"
                    aria-label="Edit love letter"
                  >
                    <Edit className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <Heart className="w-12 h-12 text-valentine-primary fill-valentine-primary mx-auto animate-pulse" />
                  <p className="text-valentine-dark mt-4">Loading your love letter...</p>
                </div>
              ) : isEditing ? (
                <div className="space-y-4">
                  <Textarea
                    value={editedLetter}
                    onChange={(e) => setEditedLetter(e.target.value)}
                    className="min-h-[400px] text-base md:text-lg leading-relaxed resize-none"
                    placeholder="Write your love letter here..."
                  />
                  {saveError && (
                    <div className="text-destructive text-sm bg-destructive/10 p-3 rounded-md">
                      {saveError}
                    </div>
                  )}
                  <div className="flex gap-3 justify-end">
                    <Button
                      onClick={handleClearClick}
                      variant="outline"
                      disabled={isSaving}
                      className="border-valentine-medium text-valentine-dark hover:bg-valentine-light"
                    >
                      <Eraser className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
                      variant="outline"
                      disabled={isSaving}
                      className="border-valentine-medium text-valentine-dark hover:bg-valentine-light"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveClick}
                      disabled={isSaving}
                      className="bg-valentine-primary text-white hover:bg-valentine-primary-dark"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                </div>
              ) : hasLetter ? (
                <div className="prose prose-lg max-w-none">
                  <p className="text-valentine-dark whitespace-pre-wrap leading-relaxed text-base md:text-lg" style={{ hyphens: 'manual' }}>
                    {loveLetter}
                  </p>
                </div>
              ) : (
                <div className="text-center py-12 space-y-4">
                  <Heart className="w-16 h-16 text-valentine-primary/30 mx-auto" />
                  <div className="space-y-2">
                    <p className="text-valentine-dark text-lg font-medium">
                      Your love letter awaits...
                    </p>
                    <p className="text-valentine-dark/70 text-base">
                      Click the edit button above to write your heartfelt message on this website.
                    </p>
                  </div>
                  {isError && (
                    <p className="text-valentine-primary/60 text-sm italic">
                      (Unable to load saved letter)
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
