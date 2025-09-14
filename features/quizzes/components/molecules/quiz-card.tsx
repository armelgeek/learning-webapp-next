'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { QuizOption } from '../atoms/quiz-option';
import { Quiz, QuizResult } from '../../config/quiz.types';

interface QuizCardProps {
  quiz: Quiz;
  onSubmit?: (selectedAnswer: string, timeSpent: number) => Promise<QuizResult>;
  onNext?: () => void;
  showNextButton?: boolean;
  className?: string;
}

export function QuizCard({
  quiz,
  onSubmit,
  onNext,
  showNextButton = false,
  className,
}: QuizCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [startTime] = useState(Date.now());

  const handleSubmit = async () => {
    if (!selectedAnswer || !onSubmit) return;

    setIsLoading(true);
    try {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      const quizResult = await onSubmit(selectedAnswer, timeSpent);
      setResult(quizResult);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedAnswer('');
    setIsSubmitted(false);
    setResult(null);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'multiple_choice':
        return 'bg-blue-100 text-blue-800';
      case 'flashcard':
        return 'bg-green-100 text-green-800';
      case 'fill_blanks':
        return 'bg-yellow-100 text-yellow-800';
      case 'translation':
        return 'bg-purple-100 text-purple-800';
      case 'dictation':
        return 'bg-orange-100 text-orange-800';
      case 'pronunciation':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{quiz.question}</CardTitle>
          <Badge className={getTypeColor(quiz.type)}>
            {quiz.type.replace('_', ' ')}
          </Badge>
        </div>
        <CardDescription>
          Choose the correct answer from the options below
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {quiz.options.map((option, index) => (
          <QuizOption
            key={index}
            option={option}
            isSelected={selectedAnswer === option}
            isCorrect={result ? option === quiz.correctAnswer : undefined}
            isRevealed={isSubmitted}
            onSelect={() => setSelectedAnswer(option)}
            disabled={isLoading}
          />
        ))}

        {isSubmitted && result && (
          <div className="mt-4 p-4 rounded-lg bg-gray-50">
            <div className="flex items-center gap-2 mb-2">
              {result.isCorrect ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <span className="font-medium">
                {result.isCorrect ? 'Correct!' : 'Incorrect'}
              </span>
            </div>
            {!result.isCorrect && (
              <p className="text-sm text-gray-600 mb-2">
                The correct answer is: <strong>{result.correctAnswer}</strong>
              </p>
            )}
            {result.explanation && (
              <p className="text-sm text-gray-600">{result.explanation}</p>
            )}
            {result.timeSpent && (
              <p className="text-xs text-gray-500 mt-2">
                Time spent: {result.timeSpent}s
              </p>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2">
        {!isSubmitted ? (
          <Button
            onClick={handleSubmit}
            disabled={!selectedAnswer || isLoading}
            className="flex-1"
          >
            {isLoading ? 'Submitting...' : 'Submit Answer'}
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            {showNextButton && onNext && (
              <Button onClick={onNext} className="flex-1">
                Next Question
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
}