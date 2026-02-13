import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { quizQuestions } from '@/valentine/quizData';

interface ValentineQuizProps {
  onComplete: () => void;
}

export default function ValentineQuiz({ onComplete }: ValentineQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showHearts, setShowHearts] = useState(false);

  const handleAnswer = (selectedIndex: number) => {
    const isCorrect = selectedIndex === quizQuestions[currentQuestion].answer;
    
    if (isCorrect) {
      setShowHearts(true);
      setTimeout(() => {
        setShowHearts(false);
        if (currentQuestion < quizQuestions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
        } else {
          onComplete();
        }
      }, 1500);
    }
  };

  const question = quizQuestions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-valentine-light via-valentine-medium to-valentine-accent flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {showHearts && (
        <div className="absolute inset-0 pointer-events-none z-50">
          {[...Array(15)].map((_, i) => (
            <Heart
              key={i}
              className="absolute text-valentine-primary fill-valentine-primary animate-heart-burst"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${30 + Math.random() * 40}px`,
                height: `${30 + Math.random() * 40}px`,
                animationDelay: `${Math.random() * 0.3}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 w-full max-w-2xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-10">
          <div className="mb-6 flex justify-between items-center">
            <span className="text-valentine-primary font-semibold text-lg">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </span>
            <Heart className="w-8 h-8 text-valentine-primary fill-valentine-primary animate-pulse" />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-valentine-dark mb-8" style={{ hyphens: 'none', wordBreak: 'normal' }}>
            {question.q}
          </h2>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {question.options.map((option, index) => (
              <Button
                key={index}
                onClick={() => handleAnswer(index)}
                variant="outline"
                className="w-full text-left justify-start h-auto py-4 px-6 text-base md:text-lg border-2 border-valentine-medium hover:border-valentine-primary hover:bg-valentine-light transition-all duration-200 whitespace-normal"
                style={{ hyphens: 'none', wordBreak: 'normal', textAlign: 'left' }}
              >
                <span className="font-semibold text-valentine-primary mr-3">{String.fromCharCode(65 + index)}.</span>
                <span className="flex-1">{option}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
