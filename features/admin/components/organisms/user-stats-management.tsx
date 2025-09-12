'use client';

import { useState } from 'react';
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

// Mock data for demo
const mockUserStats = [
  {
    id: '1',
    userId: 'user-1',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    userAvatar: '',
    streakDays: 15,
    longestStreak: 28,
    totalLessonsCompleted: 45,
    totalWordsLearned: 320,
    totalStudyTime: 1680, // 28 hours
    currentLevel: 'intermediate',
    totalPoints: 4500,
    weeklyPoints: 280,
    monthlyPoints: 1150,
    level: 5,
    experience: 1200,
    experienceToNextLevel: 1500,
    lastPracticeDate: '2024-01-21T09:15:00Z',
    dailyGoal: 20,
    weeklyGoal: 140,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-21T09:15:00Z',
  },
  {
    id: '2',
    userId: 'user-2',
    userName: 'Jane Smith',
    userEmail: 'jane@example.com',
    userAvatar: '',
    streakDays: 7,
    longestStreak: 12,
    totalLessonsCompleted: 23,
    totalWordsLearned: 185,
    totalStudyTime: 920, // 15.3 hours
    currentLevel: 'beginner',
    totalPoints: 2300,
    weeklyPoints: 150,
    monthlyPoints: 650,
    level: 3,
    experience: 480,
    experienceToNextLevel: 600,
    lastPracticeDate: '2024-01-20T16:30:00Z',
    dailyGoal: 15,
    weeklyGoal: 105,
    createdAt: '2024-01-05T14:00:00Z',
    updatedAt: '2024-01-20T16:30:00Z',
  },
  {
    id: '3',
    userId: 'user-3',
    userName: 'Bob Wilson',
    userEmail: 'bob@example.com',
    userAvatar: '',
    streakDays: 0,
    longestStreak: 5,
    totalLessonsCompleted: 8,
    totalWordsLearned: 67,
    totalStudyTime: 240, // 4 hours
    currentLevel: 'beginner',
    totalPoints: 800,
    weeklyPoints: 0,
    monthlyPoints: 180,
    level: 1,
    experience: 80,
    experienceToNextLevel: 100,
    lastPracticeDate: '2024-01-15T11:00:00Z',
    dailyGoal: 10,
    weeklyGoal: 70,
    createdAt: '2024-01-10T16:00:00Z',
    updatedAt: '2024-01-15T11:00:00Z',
  },
];

type UserStats = typeof mockUserStats[0];

export function UserStatsManagement() {
  const [stats, setStats] = useState<UserStats[]>(mockUserStats);

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
            <AvatarImage src={row.original.userAvatar} alt={row.original.userName} />
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
        const date = new Date(row.getValue('lastPracticeDate'));
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

  return (
    <AdminDataTable
      title="User Statistics Overview"
      description="Monitor user engagement, progress, and performance metrics"
      data={stats}
      columns={columns}
      searchColumn="userName"
    />
  );
}