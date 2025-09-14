'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2, MoreHorizontal, Calendar } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AdminDataTable } from '../molecules/admin-data-table';
import { useDailyChallenges, useDeleteDailyChallenge } from '../../hooks/use-daily-challenges';
import { toast } from 'sonner';

export function DailyChallengesManagement() {
  // Replace mock data with real API calls
  const { data: challengesData, isLoading, error } = useDailyChallenges();
  const deleteChallengeMutation = useDeleteDailyChallenge();
  
  const challenges = challengesData?.data || [];

  const handleEdit = (challenge: any) => {
    console.log('Edit challenge:', challenge.id);
  };

  const handleDelete = async (challengeId: string) => {
    if (confirm('Are you sure you want to delete this challenge?')) {
      try {
        await deleteChallengeMutation.mutateAsync(challengeId);
        toast.success('Challenge deleted successfully');
      } catch (error) {
        toast.error('Failed to delete challenge');
      }
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'title',
      header: 'Challenge',
      cell: ({ row }) => (
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="font-medium">{row.getValue('title')}</div>
            <div className="text-sm text-muted-foreground line-clamp-2">
              {row.original.description}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => {
        const date = new Date(row.getValue('date'));
        const today = new Date();
        const isToday = date.toDateString() === today.toDateString();
        const isFuture = date > today;
        
        return (
          <div className="flex flex-col">
            <span className="text-sm">{date.toLocaleDateString()}</span>
            {isToday && <Badge variant="default" className="w-fit mt-1">Today</Badge>}
            {isFuture && <Badge variant="secondary" className="w-fit mt-1">Upcoming</Badge>}
          </div>
        );
      },
    },
    {
      accessorKey: 'language',
      header: 'Language',
      cell: ({ row }) => {
        const language = row.getValue('language') as string;
        return language ? (
          <Badge variant="outline" className="capitalize">
            {language}
          </Badge>
        ) : (
          <span className="text-muted-foreground">All</span>
        );
      },
    },
    {
      accessorKey: 'targetValue',
      header: 'Target',
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue('targetValue')}</span>
      ),
    },
    {
      accessorKey: 'pointsReward',
      header: 'Reward',
      cell: ({ row }) => (
        <span className="text-green-600 font-medium">
          +{row.getValue('pointsReward')} pts
        </span>
      ),
    },
    {
      accessorKey: 'participantsCount',
      header: 'Participants',
      cell: ({ row }) => (
        <span className="text-center">{row.getValue('participantsCount')}</span>
      ),
    },
    {
      accessorKey: 'completedCount',
      header: 'Completed',
      cell: ({ row }) => {
        const completed = row.getValue('completedCount') as number;
        const total = row.original.participantsCount;
        const percentage = total > 0 ? ((completed / total) * 100).toFixed(0) : '0';
        
        return (
          <div className="flex flex-col items-center">
            <span className="font-medium">{completed}</span>
            <span className="text-xs text-muted-foreground">
              {percentage}%
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.getValue('isActive') ? 'default' : 'secondary'}>
          {row.getValue('isActive') ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const challenge = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => console.log('View challenge:', challenge.id)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(challenge)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleDelete(challenge.id)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <AdminDataTable
      title="Daily Challenges"
      description="Create and manage daily challenges to engage users"
      data={challenges}
      columns={columns}
      onAdd={() => console.log('Add new challenge')}
      searchColumn="title"
    />
  );
}