'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Award, Target, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface ProgressOverviewProps {
  stats: {
    streakDays: number;
    totalLessonsCompleted: number;
    totalPoints: number;
    level: number;
    experience: number;
    experienceToNextLevel: number;
  };
  completionPercentage: number;
  targetLanguage: string;
}

export function ProgressOverview({ stats, completionPercentage, targetLanguage }: ProgressOverviewProps) {
  const experienceProgress = (stats.experience / stats.experienceToNextLevel) * 100;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.streakDays} days</div>
          <p className="text-xs text-muted-foreground">
            Keep it up! 🔥
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Lessons Completed</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalLessonsCompleted}</div>
          <p className="text-xs text-muted-foreground">
            {completionPercentage}% of {targetLanguage} content
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Points</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalPoints}</div>
          <p className="text-xs text-muted-foreground">
            Level {stats.level} learner
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Experience</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.experience} XP</div>
          <div className="mt-2">
            <Progress value={experienceProgress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {stats.experienceToNextLevel - stats.experience} XP to level {stats.level + 1}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}