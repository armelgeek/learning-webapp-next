'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Eye, Edit, MoreHorizontal, TrendingUp, BookOpen } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AdminDataTable } from '../molecules/admin-data-table';
import { useAdminUserProgress, useResetUserProgress } from '../../hooks/use-user-progress';
import { toast } from 'sonner';

type UserProgress = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar: string;
  lessonId: string;
  lessonTitle: string;
  moduleTitle: string;
  language: string;
  completed: boolean;
  score: number;
  attempts: number;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export function UserProgressManagement() {
  const { data: progress = [], isLoading, error } = useAdminUserProgress();
  const resetProgress = useResetUserProgress();

  const handleViewDetails = (progressId: string) => {
    console.log('View progress details:', progressId);
    // In real app, navigate to detailed progress view
  };

  const handleResetProgress = async (progressId: string) => {
    if (confirm('Are you sure you want to reset this user\'s progress for this lesson?')) {
      try {
        await resetProgress.mutateAsync(progressId);
        toast.success('User progress reset successfully');
      } catch (error) {
        toast.error('Failed to reset user progress');
        console.error('Error resetting progress:', error);
      }
    }
  };

  const columns: ColumnDef<UserProgress>[] = [
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
              {row.original.userEmail}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'lessonTitle',
      header: 'Lesson',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.getValue('lessonTitle')}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.moduleTitle}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'language',
      header: 'Language',
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.getValue('language')}
        </Badge>
      ),
    },
    {
      accessorKey: 'completed',
      header: 'Status',
      cell: ({ row }) => {
        const completed = row.getValue('completed') as boolean;
        return (
          <Badge variant={completed ? 'default' : 'secondary'}>
            {completed ? 'Completed' : 'In Progress'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'score',
      header: 'Score',
      cell: ({ row }) => {
        const score = row.getValue('score') as number;
        const completed = row.original.completed;
        if (!completed) return <span className="text-muted-foreground">-</span>;
        
        const scoreColor = score >= 90 ? 'text-green-600' : 
                          score >= 70 ? 'text-yellow-600' : 'text-red-600';
        
        return (
          <div className="flex items-center gap-1">
            <TrendingUp className={`h-4 w-4 ${scoreColor}`} />
            <span className={`font-medium ${scoreColor}`}>{score}%</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'attempts',
      header: 'Attempts',
      cell: ({ row }) => (
        <div className="text-center">
          <span className="font-medium">{row.getValue('attempts')}</span>
        </div>
      ),
    },
    {
      accessorKey: 'completedAt',
      header: 'Completed',
      cell: ({ row }) => {
        const completedAt = row.getValue('completedAt') as string;
        if (!completedAt) return <span className="text-muted-foreground">-</span>;
        
        const date = new Date(completedAt);
        return <span className="text-sm">{date.toLocaleDateString()}</span>;
      },
    },
    {
      accessorKey: 'updatedAt',
      header: 'Last Activity',
      cell: ({ row }) => {
        const date = new Date(row.getValue('updatedAt'));
        return <span className="text-sm">{date.toLocaleDateString()}</span>;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const progress = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleViewDetails(progress.id)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log('View user profile:', progress.userId)}>
                <BookOpen className="mr-2 h-4 w-4" />
                User Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleResetProgress(progress.id)}
                className="text-destructive"
              >
                <Edit className="mr-2 h-4 w-4" />
                Reset Progress
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
          <p className="text-destructive mb-2">Failed to load user progress</p>
          <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <AdminDataTable
      title="User Learning Progress"
      description="Monitor how users are progressing through lessons and modules"
      data={progress}
      columns={columns}
      searchColumn="userName"
      isLoading={isLoading}
    />
  );
}