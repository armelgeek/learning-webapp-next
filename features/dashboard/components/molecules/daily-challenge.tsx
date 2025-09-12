'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target } from 'lucide-react';
import Link from 'next/link';

interface DailyChallengeProps {
  challenge?: {
    challengeId: string;
    title: string;
    description: string;
    targetValue: number;
    pointsReward: number;
    currentProgress: number | null;
    completed: boolean | null;
  } | null;
}

export function DailyChallenge({ challenge }: DailyChallengeProps) {
  if (!challenge) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Daily Challenge
          </CardTitle>
          <CardDescription>
            No challenge available today. Check back tomorrow!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Daily challenges help you stay motivated and build consistent learning habits.
          </p>
        </CardContent>
      </Card>
    );
  }

  const progress = challenge.currentProgress || 0;
  const progressPercentage = Math.min((progress / challenge.targetValue) * 100, 100);
  const isCompleted = challenge.completed || progressPercentage >= 100;

  return (
    <Card className={isCompleted ? 'border-green-200 bg-green-50' : ''}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Daily Challenge
          {isCompleted && (
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <Trophy className="h-3 w-3 mr-1" />
              Completed
            </Badge>
          )}
        </CardTitle>
        <CardDescription>{challenge.title}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {challenge.description}
        </p>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>
              {progress} / {challenge.targetValue}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Reward: {challenge.pointsReward} points
          </div>
          {!isCompleted && (
            <Button asChild size="sm">
              <Link href="/lessons">
                Continue Learning
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}