'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Eye, MoreHorizontal, TrendingUp, Calendar, Award, Target } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AdminDataTable } from '../molecules/admin-data-table';
import { useAdminUserStats } from '../../hooks/use-user-progress';

type UserStats = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar: string | null;
  streakDays: number;
  longestStreak: number;
  totalLessonsCompleted: number;
  totalWordsLearned: number;
  totalStudyTime: number;
  currentLevel: string;
  totalPoints: number;
  weeklyPoints: number;
  monthlyPoints: number;
  level: number;
  experience: number;
  experienceToNextLevel: number;
  lastPracticeDate: string | null;
  dailyGoal: number;
  weeklyGoal: number;
  createdAt: string;
  updatedAt: string;
};

export function UserStatsManagement() {
  const { data: stats = [], isLoading, error } = useAdminUserStats();

  const handleViewDetails = (userId: string) => {
    console.log('View user details:', userId);
    // In real app, navigate to detailed user view
  };

  const formatStudyTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const columns: ColumnDef<UserStats>[] = [
    {
      accessorKey: 'userName',
      header: 'User',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.original.userAvatar || ''} alt={row.original.userName} />
            <AvatarFallback>
              {row.original.userName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{row.getValue('userName')}</div>
            <div className="text-sm text-muted-foreground">
              Level {row.original.level} • {row.original.currentLevel}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'streakDays',
      header: 'Current Streak',
      cell: ({ row }) => {
        const streak = row.getValue('streakDays') as number;
        return (
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-orange-500" />
            <span className="font-medium">{streak} days</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'totalLessonsCompleted',
      header: 'Lessons',
      cell: ({ row }) => (
        <div className="text-center">
          <span className="font-medium">{row.getValue('totalLessonsCompleted')}</span>
        </div>
      ),
    },
    {
      accessorKey: 'totalStudyTime',
      header: 'Study Time',
      cell: ({ row }) => {
        const time = row.getValue('totalStudyTime') as number;
        return (
          <div className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            <span className="text-sm">{formatStudyTime(time)}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'totalPoints',
      header: 'Total Points',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Award className="h-4 w-4 text-yellow-500" />
          <span className="font-medium">{row.getValue('totalPoints')}</span>
        </div>
      ),
    },
    {
      accessorKey: 'weeklyPoints',
      header: 'This Week',
      cell: ({ row }) => {
        const points = row.getValue('weeklyPoints') as number;
        return (
          <span className="font-medium text-green-600">+{points}</span>
        );
      },
    },
    {
      accessorKey: 'experience',
      header: 'XP Progress',
      cell: ({ row }) => {
        const current = row.original.experience;
        const needed = row.original.experienceToNextLevel;
        const percentage = (current / needed) * 100;
        
        return (
          <div className="space-y-1">
            <div className="text-sm">{current}/{needed} XP</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'dailyGoal',
      header: 'Daily Goal',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Target className="h-4 w-4 text-purple-500" />
          <span className="text-sm">{row.getValue('dailyGoal')} min</span>
        </div>
      ),
    },
    {
      accessorKey: 'lastPracticeDate',
      header: 'Last Active',
      cell: ({ row }) => {
        const lastPracticeDate = row.getValue('lastPracticeDate') as string | null;
        if (!lastPracticeDate) {
          return <Badge variant="destructive">Never</Badge>;
        }
        
        const date = new Date(lastPracticeDate);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        
        let badge;
        if (diffDays === 0) {
          badge = <Badge className="bg-green-100 text-green-800">Today</Badge>;
        } else if (diffDays === 1) {
          badge = <Badge variant="secondary">Yesterday</Badge>;
        } else if (diffDays <= 7) {
          badge = <Badge variant="outline">{diffDays} days ago</Badge>;
        } else {
          badge = <Badge variant="destructive">Inactive</Badge>;
        }
        
        return badge;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const userStats = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleViewDetails(userStats.userId)}>
                <Eye className="mr-2 h-4 w-4" />
                View Full Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log('View progress:', userStats.userId)}>
                <TrendingUp className="mr-2 h-4 w-4" />
                View Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log('View achievements:', userStats.userId)}>
                <Award className="mr-2 h-4 w-4" />
                View Achievements
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive mb-2">Failed to load user statistics</p>
          <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <AdminDataTable
      title="User Statistics Overview"
      description="Monitor user engagement, progress, and performance metrics"
      data={stats}
      columns={columns}
      searchColumn="userName"
      isLoading={isLoading}
    />
  );
}