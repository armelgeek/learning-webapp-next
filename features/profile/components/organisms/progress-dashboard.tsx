'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  Flame, 
  Target, 
  BookOpen, 
  Clock, 
  Star,
  TrendingUp,
  Calendar
} from 'lucide-react';

interface UserStats {
  // Learning progress
  streakDays: number;
  longestStreak: number;
  totalLessonsCompleted: number;
  totalWordsLearned: number;
  totalStudyTime: number; // in minutes
  currentLevel: string;
  
  // Gamification
  totalPoints: number;
  weeklyPoints: number;
  monthlyPoints: number;
  level: number;
  experience: number;
  experienceToNextLevel: number;
  
  // Goals
  dailyGoal: number;
  weeklyGoal: number;
  
  // Activity
  lastPracticeDate?: string;
}

interface ProgressDashboardProps {
  userStats: UserStats;
  todayStudyTime?: number; // minutes studied today
  weekStudyTime?: number; // minutes studied this week
}

export function ProgressDashboard({ userStats, todayStudyTime = 0, weekStudyTime = 0 }: ProgressDashboardProps) {
  const {
    streakDays,
    longestStreak,
    totalLessonsCompleted,
    totalWordsLearned,
    totalStudyTime,
    currentLevel,
    totalPoints,
    weeklyPoints,
    level,
    experience,
    experienceToNextLevel,
    dailyGoal,
    weeklyGoal
  } = userStats;

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const dailyProgress = Math.min((todayStudyTime / dailyGoal) * 100, 100);
  const weeklyProgress = Math.min((weekStudyTime / weeklyGoal) * 100, 100);
  const experienceProgress = (experience / experienceToNextLevel) * 100;

  return (
    <div className="space-y-6">
      {/* Current Streak and Level */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
                <div className="flex items-center gap-2 mt-1">
                  <Flame className="h-5 w-5 text-orange-500" />
                  <span className="text-2xl font-bold">{streakDays}</span>
                  <span className="text-sm text-muted-foreground">days</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Best: {longestStreak} days
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Level</p>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="text-2xl font-bold">{level}</span>
                </div>
                <Badge variant="secondary" className="mt-1 text-xs">
                  {currentLevel}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Points</p>
                <div className="flex items-center gap-2 mt-1">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <span className="text-2xl font-bold">{totalPoints.toLocaleString()}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  +{weeklyPoints} this week
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily and Weekly Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5" />
              Today's Goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{formatTime(todayStudyTime)} / {formatTime(dailyGoal)}</span>
                <span>{Math.round(dailyProgress)}%</span>
              </div>
              <Progress value={dailyProgress} className="h-2" />
              {dailyProgress >= 100 ? (
                <p className="text-sm text-green-600 font-medium">🎉 Goal completed!</p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {formatTime(dailyGoal - todayStudyTime)} remaining
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Weekly Goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{formatTime(weekStudyTime)} / {formatTime(weeklyGoal)}</span>
                <span>{Math.round(weeklyProgress)}%</span>
              </div>
              <Progress value={weeklyProgress} className="h-2" />
              {weeklyProgress >= 100 ? (
                <p className="text-sm text-green-600 font-medium">🏆 Weekly goal achieved!</p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {formatTime(weeklyGoal - weekStudyTime)} remaining
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <BookOpen className="h-4 w-4 text-blue-500" />
                <span className="text-2xl font-bold">{totalLessonsCompleted}</span>
              </div>
              <p className="text-sm text-muted-foreground">Lessons Completed</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-xl">📚</span>
                <span className="text-2xl font-bold">{totalWordsLearned}</span>
              </div>
              <p className="text-sm text-muted-foreground">Words Learned</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-green-500" />
                <span className="text-2xl font-bold">{formatTime(totalStudyTime)}</span>
              </div>
              <p className="text-sm text-muted-foreground">Total Study Time</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Star className="h-4 w-4 text-purple-500" />
                <span className="text-2xl font-bold">{experience}</span>
              </div>
              <p className="text-sm text-muted-foreground">Experience Points</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Level Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Level Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Level {level}</span>
              <span>Level {level + 1}</span>
            </div>
            <Progress value={experienceProgress} className="h-3" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{experience} XP</span>
              <span>{experienceToNextLevel - experience} XP to next level</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}