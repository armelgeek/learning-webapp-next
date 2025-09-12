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

// Mock data for demo
const mockLessons = [
  {
    id: '1',
    title: 'Spanish Greetings',
    description: 'Learn basic Spanish greetings and introductions',
    language: 'spanish',
    type: 'vocabulary',
    difficultyLevel: 'beginner',
    content: { text: 'Sample lesson content...', examples: [] },
    audioUrl: 'https://example.com/audio.mp3',
    videoUrl: 'https://example.com/video.mp4',
    imageUrl: 'https://example.com/image.jpg',
    estimatedDuration: 15,
    pointsReward: 10,
    isActive: true,
    order: 1,
    moduleTitle: 'Spanish Basics',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
  },
  {
    id: '2',
    title: 'French Numbers 1-20',
    description: 'Master French numbers from one to twenty',
    language: 'french',
    type: 'vocabulary',
    difficultyLevel: 'beginner',
    content: { text: 'Sample lesson content...', examples: [] },
    audioUrl: null,
    videoUrl: null,
    imageUrl: null,
    estimatedDuration: 20,
    pointsReward: 15,
    isActive: true,
    order: 1,
    moduleTitle: 'French Basics',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-18T14:20:00Z',
  },
];

type Lesson = typeof mockLessons[0];

export function LessonsManagement() {
  const [lessons, setLessons] = useState<Lesson[]>(mockLessons);

  const handleEdit = (lesson: Lesson) => {
    console.log('Edit lesson:', lesson.id);
  };

  const handleDelete = (lessonId: string) => {
    if (confirm('Are you sure you want to delete this lesson?')) {
      setLessons(lessons.filter(l => l.id !== lessonId));
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

  return (
    <AdminDataTable
      title="Lesson Content"
      description="Manage lesson content, videos, and documents"
      data={lessons}
      columns={columns}
      onAdd={() => console.log('Add new lesson')}
      searchColumn="title"
    />
  );
}