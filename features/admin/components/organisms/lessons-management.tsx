'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AdminDataTable } from '../molecules/admin-data-table';
import { LessonFormDialog } from '../molecules/lesson-form-dialog';
import { useAdminLessons, useDeleteLesson, useCreateLesson, useUpdateLesson } from '../../hooks/use-admin-lessons';
import { toast } from 'sonner';

type Lesson = {
  id: string;
  title: string;
  description: string;
  language: string;
  type: string;
  difficultyLevel: string;
  estimatedDuration: number;
  pointsReward: number;
  isActive: boolean;
  order: number;
  moduleTitle: string;
  createdAt: string;
  updatedAt: string;
};

export function LessonsManagement() {
  const { data: lessons = [], isLoading, error } = useAdminLessons();
  const deleteLesson = useDeleteLesson();
  const createLesson = useCreateLesson();
  const updateLesson = useUpdateLesson();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  const handleAdd = () => {
    setEditingLesson(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setIsDialogOpen(true);
  };

  const handleDelete = async (lessonId: string) => {
    if (confirm('Are you sure you want to delete this lesson?')) {
      try {
        await deleteLesson.mutateAsync(lessonId);
        toast.success('Lesson deleted successfully');
      } catch (error) {
        toast.error('Failed to delete lesson');
        console.error('Error deleting lesson:', error);
      }
    }
  };

  const handleSave = async (lessonData: any) => {
    try {
      if (editingLesson) {
        // Update existing lesson
        await updateLesson.mutateAsync({ id: editingLesson.id, ...lessonData });
        toast.success('Lesson updated successfully');
      } else {
        // Create new lesson
        await createLesson.mutateAsync(lessonData);
        toast.success('Lesson created successfully');
      }
      setIsDialogOpen(false);
      setEditingLesson(null);
    } catch (error) {
      toast.error(editingLesson ? 'Failed to update lesson' : 'Failed to create lesson');
      console.error('Error saving lesson:', error);
    }
  };

  const columns: ColumnDef<Lesson>[] = [
    {
      accessorKey: 'title',
      header: 'Lesson',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.getValue('title')}</span>
          <span className="text-sm text-muted-foreground line-clamp-2">
            {row.original.description}
          </span>
          <span className="text-xs text-muted-foreground">
            Module: {row.original.moduleTitle}
          </span>
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
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => (
        <Badge variant="secondary" className="capitalize">
          {row.getValue('type')}
        </Badge>
      ),
    },
    {
      accessorKey: 'difficultyLevel',
      header: 'Difficulty',
      cell: ({ row }) => {
        const level = row.getValue('difficultyLevel') as string;
        const variant = level === 'beginner' ? 'default' : 
                      level === 'intermediate' ? 'secondary' : 'destructive';
        return (
          <Badge variant={variant} className="capitalize">
            {level}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'estimatedDuration',
      header: 'Duration',
      cell: ({ row }) => {
        const duration = row.getValue('estimatedDuration') as number;
        return <span>{duration} min</span>;
      },
    },
    {
      accessorKey: 'pointsReward',
      header: 'Points',
      cell: ({ row }) => (
        <span className="text-center">{row.getValue('pointsReward')}</span>
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
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const lesson = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => console.log('View lesson:', lesson.id)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(lesson)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleDelete(lesson.id)}
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

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive mb-2">Failed to load lessons</p>
          <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AdminDataTable
        title="Lesson Content"
        description="Manage lesson content, videos, and documents"
        data={lessons}
        columns={columns}
        onAdd={handleAdd}
        searchColumn="title"
        isLoading={isLoading}
      />
      
      <LessonFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        lesson={editingLesson}
        onSave={handleSave}
      />
    </>
  );
}