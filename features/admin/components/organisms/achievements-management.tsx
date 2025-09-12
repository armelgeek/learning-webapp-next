'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2, MoreHorizontal, Award } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AdminDataTable } from '../molecules/admin-data-table';
import { AchievementFormDialog } from '../molecules/achievement-form-dialog';

// Mock data for demo
const mockAchievements = [
  {
    id: '1',
    name: 'First Steps',
    description: 'Complete your first lesson',
    type: 'lessons_completed',
    iconUrl: '',
    pointsRequired: 0,
    criteria: { lessonsCount: 1 },
    isActive: true,
    earnedCount: 150,
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Week Warrior',
    description: 'Maintain a 7-day learning streak',
    type: 'streak',
    iconUrl: '',
    pointsRequired: 0,
    criteria: { streakDays: 7 },
    isActive: true,
    earnedCount: 45,
    createdAt: '2024-01-10T09:00:00Z',
  },
  {
    id: '3',
    name: 'Perfect Score',
    description: 'Get 100% on any quiz',
    type: 'perfect_score',
    iconUrl: '',
    pointsRequired: 0,
    criteria: { perfectScore: true },
    isActive: true,
    earnedCount: 87,
    createdAt: '2024-01-05T08:00:00Z',
  },
  {
    id: '4',
    name: 'Daily Goal Master',
    description: 'Complete your daily goal 30 times',
    type: 'daily_goal',
    iconUrl: '',
    pointsRequired: 500,
    criteria: { dailyGoalsCompleted: 30 },
    isActive: false,
    earnedCount: 12,
    createdAt: '2024-01-01T08:00:00Z',
  },
];

type Achievement = typeof mockAchievements[0];

export function AchievementsManagement() {
  const [achievements, setAchievements] = useState<Achievement[]>(mockAchievements);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);

  const handleAdd = () => {
    setEditingAchievement(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setIsDialogOpen(true);
  };

  const handleDelete = (achievementId: string) => {
    if (confirm('Are you sure you want to delete this achievement?')) {
      setAchievements(achievements.filter(a => a.id !== achievementId));
    }
  };

  const handleSave = (achievementData: any) => {
    if (editingAchievement) {
      // Update existing achievement
      setAchievements(achievements.map(a => 
        a.id === editingAchievement.id 
          ? { ...a, ...achievementData }
          : a
      ));
    } else {
      // Add new achievement
      const newAchievement = {
        ...achievementData,
        id: Date.now().toString(),
        earnedCount: 0,
        createdAt: new Date().toISOString(),
      };
      setAchievements([...achievements, newAchievement]);
    }
    setIsDialogOpen(false);
    setEditingAchievement(null);
  };

  const columns: ColumnDef<Achievement>[] = [
    {
      accessorKey: 'name',
      header: 'Achievement',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
            <Award className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="font-medium">{row.getValue('name')}</div>
            <div className="text-sm text-muted-foreground line-clamp-2">
              {row.original.description}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        const type = row.getValue('type') as string;
        const typeColors = {
          streak: 'bg-orange-100 text-orange-800',
          lessons_completed: 'bg-blue-100 text-blue-800',
          perfect_score: 'bg-green-100 text-green-800',
          daily_goal: 'bg-purple-100 text-purple-800',
          weekly_goal: 'bg-pink-100 text-pink-800',
        };
        return (
          <Badge 
            variant="secondary" 
            className={`capitalize ${typeColors[type as keyof typeof typeColors] || ''}`}
          >
            {type.replace('_', ' ')}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'pointsRequired',
      header: 'Points Required',
      cell: ({ row }) => {
        const points = row.getValue('pointsRequired') as number;
        return <span>{points > 0 ? points : 'None'}</span>;
      },
    },
    {
      accessorKey: 'earnedCount',
      header: 'Times Earned',
      cell: ({ row }) => (
        <div className="text-center">
          <span className="font-medium">{row.getValue('earnedCount')}</span>
        </div>
      ),
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
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => {
        const date = new Date(row.getValue('createdAt'));
        return <span className="text-sm">{date.toLocaleDateString()}</span>;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const achievement = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => console.log('View achievement:', achievement.id)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(achievement)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleDelete(achievement.id)}
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
    <>
      <AdminDataTable
        title="Achievements & Badges"
        description="Manage user achievements and reward system"
        data={achievements}
        columns={columns}
        onAdd={handleAdd}
        searchColumn="name"
      />
      
      <AchievementFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        achievement={editingAchievement}
        onSave={handleSave}
      />
    </>
  );
}