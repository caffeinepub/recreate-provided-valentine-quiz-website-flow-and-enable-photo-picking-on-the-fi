import { useState, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { InternetIdentityProvider } from '@/hooks/useInternetIdentity';
import ValentineWelcome from './pages/ValentineWelcome';
import ValentineQuiz from './pages/ValentineQuiz';
import ValentineMessage from './pages/ValentineMessage';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import { initReleaseMode } from '@/utils/releaseMode';

type PageView = 'welcome' | 'quiz' | 'memories';

function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('welcome');

  // Initialize release mode on mount to sanitize preview-only artifacts
  useEffect(() => {
    initReleaseMode();
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <InternetIdentityProvider>
        <QueryClientProvider client={queryClient}>
          <div className="min-h-screen relative overflow-hidden">
            {currentPage === 'welcome' && (
              <ValentineWelcome onStart={() => setCurrentPage('quiz')} />
            )}
            {currentPage === 'quiz' && (
              <ValentineQuiz onComplete={() => setCurrentPage('memories')} />
            )}
            {currentPage === 'memories' && (
              <ValentineMessage />
            )}
            <Toaster />
          </div>
        </QueryClientProvider>
      </InternetIdentityProvider>
    </ThemeProvider>
  );
}

export default App;
