import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useBackgroundMusic } from '@/hooks/useBackgroundMusic';

interface ValentineWelcomeProps {
  onStart: () => void;
}

export default function ValentineWelcome({ onStart }: ValentineWelcomeProps) {
  const { startMusic } = useBackgroundMusic();

  const handleStart = () => {
    startMusic();
    onStart();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-valentine-light via-valentine-medium to-valentine-accent flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        {[...Array(20)].map((_, i) => (
          <Heart
            key={i}
            className="absolute text-valentine-primary fill-valentine-primary animate-float-up"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${20 + Math.random() * 30}px`,
              height: `${20 + Math.random() * 30}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <div className="mb-8 flex justify-center gap-4">
          <Heart className="w-16 h-16 md:w-20 md:h-20 text-valentine-primary fill-valentine-primary animate-pulse" />
          <Heart className="w-16 h-16 md:w-20 md:h-20 text-valentine-primary fill-valentine-primary animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-valentine-dark mb-4 animate-fade-in" style={{ hyphens: 'none' }}>
          Welcome Wania Akhand 💖
        </h1>

        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-valentine-primary-dark mb-12 animate-fade-in" style={{ animationDelay: '0.3s', hyphens: 'none', wordBreak: 'keep-all' }}>
          The Ultimate Valentine Championship 🎀
        </h2>

        <Button
          onClick={handleStart}
          size="lg"
          className="bg-valentine-primary text-white hover:bg-valentine-primary-dark text-xl md:text-2xl px-12 py-8 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 animate-fade-in font-bold"
          style={{ animationDelay: '0.6s' }}
        >
          Start Baby 💕
        </Button>
      </div>
    </div>
  );
}
