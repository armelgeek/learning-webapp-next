'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Clock, CheckCircle } from 'lucide-react';
import { QuizCard } from '../molecules/quiz-card';
import { Quiz, QuizResult } from '../../config/quiz.types';

interface QuizSessionProps {
  quizzes: Quiz[];
  lessonTitle?: string;
  onComplete?: (results: QuizSessionResult) => void;
  onSubmitAnswer?: (quizId: string, selectedAnswer: string, timeSpent: number) => Promise<QuizResult>;
}

interface QuizSessionResult {
  totalQuestions: number;
  correctAnswers: number;
  totalTimeSpent: number;
  results: Array<{
    quizId: string;
    isCorrect: boolean;
    timeSpent: number;
  }>;
}

export function QuizSession({
  quizzes,
  lessonTitle,
  onComplete,
  onSubmitAnswer,
}: QuizSessionProps) {
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [sessionResults, setSessionResults] = useState<QuizSessionResult>({
    totalQuestions: quizzes.length,
    correctAnswers: 0,
    totalTimeSpent: 0,
    results: [],
  });
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuiz = quizzes[currentQuizIndex];
  const progress = ((currentQuizIndex + (isCompleted ? 1 : 0)) / quizzes.length) * 100;

  const handleSubmitAnswer = async (selectedAnswer: string, timeSpent: number): Promise<QuizResult> => {
    if (!onSubmitAnswer) {
      // Fallback behavior if no submit handler provided
      const isCorrect = selectedAnswer === currentQuiz.correctAnswer;
      return {
        isCorrect,
        selectedAnswer,
        correctAnswer: currentQuiz.correctAnswer,
        explanation: currentQuiz.explanation,
        timeSpent,
      };
    }

    const result = await onSubmitAnswer(currentQuiz.id, selectedAnswer, timeSpent);
    
    // Update session results
    setSessionResults(prev => ({
      ...prev,
      correctAnswers: prev.correctAnswers + (result.isCorrect ? 1 : 0),
      totalTimeSpent: prev.totalTimeSpent + timeSpent,
      results: [
        ...prev.results,
        {
          quizId: currentQuiz.id,
          isCorrect: result.isCorrect,
          timeSpent,
        },
      ],
    }));

    return result;
  };

  const handleNext = () => {
    if (currentQuizIndex < quizzes.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuizIndex(0);
    setIsCompleted(false);
    setSessionResults({
      totalQuestions: quizzes.length,
      correctAnswers: 0,
      totalTimeSpent: 0,
      results: [],
    });
  };

  useEffect(() => {
    if (isCompleted && onComplete) {
      onComplete(sessionResults);
    }
  }, [isCompleted, sessionResults, onComplete]);

  if (quizzes.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">No quizzes available for this lesson.</p>
        </CardContent>
      </Card>
    );
  }

  if (isCompleted) {
    const scorePercentage = Math.round((sessionResults.correctAnswers / sessionResults.totalQuestions) * 100);
    const averageTime = Math.round(sessionResults.totalTimeSpent / sessionResults.totalQuestions);

    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Quiz Completed!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              {scorePercentage}%
            </div>
            <p className="text-muted-foreground">
              {sessionResults.correctAnswers} out of {sessionResults.totalQuestions} correct
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Target className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <div className="font-semibold">{sessionResults.correctAnswers}</div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <div className="font-semibold">{sessionResults.totalQuestions}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Clock className="h-6 w-6 text-orange-500 mx-auto mb-2" />
              <div className="font-semibold">{averageTime}s</div>
              <div className="text-sm text-muted-foreground">Avg. Time</div>
            </div>
          </div>

          <div className="flex gap-2 justify-center">
            <Button onClick={handleRestart} variant="outline">
              Try Again
            </Button>
            <Button onClick={() => window.history.back()}>
              Back to Lesson
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">
                Question {currentQuizIndex + 1} of {quizzes.length}
              </h2>
              {lessonTitle && (
                <p className="text-sm text-muted-foreground">{lessonTitle}</p>
              )}
            </div>
            <Badge variant="outline">
              {Math.round(progress)}% Complete
            </Badge>
          </div>
          <Progress value={progress} className="w-full" />
        </CardContent>
      </Card>

      {/* Current Quiz */}
      <QuizCard
        quiz={currentQuiz}
        onSubmit={handleSubmitAnswer}
        onNext={handleNext}
        showNextButton={currentQuizIndex < quizzes.length - 1}
      />
    </div>
  );
}