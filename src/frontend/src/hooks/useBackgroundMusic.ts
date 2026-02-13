import { useEffect, useRef } from 'react';

export function useBackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio element
    // Music file should be placed at: frontend/public/assets/audio/valentine-bg.mp3
    // You can replace this file with your own MP3 without code changes
    const audio = new Audio('/assets/audio/valentine-bg.mp3');
    audio.loop = true;
    audio.volume = 0.15;
    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const startMusic = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.log('Audio playback failed:', error);
      });
    }
  };

  return { startMusic };
}
