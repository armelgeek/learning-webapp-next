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
import { QuizFormDialog } from '../molecules/quiz-form-dialog';
import { useAdminQuizzes, useDeleteQuiz } from '../../hooks/use-admin-quizzes';
import { toast } from 'sonner';

type Quiz = {
  id: string;
  lessonId: string;
  lessonTitle: string;
  question: string;
  options: string[];
  correctAnswer: string;
  type: string;
  explanation: string;
  createdAt: string;
  updatedAt: string;
};

export function QuizzesManagement() {
  const { data: quizzes = [], isLoading, error } = useAdminQuizzes();
  const deleteQuiz = useDeleteQuiz();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);

  const handleAdd = () => {
    setEditingQuiz(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setIsDialogOpen(true);
  };

  const handleDelete = async (quizId: string) => {
    if (confirm('Are you sure you want to delete this quiz?')) {
      try {
        await deleteQuiz.mutateAsync(quizId);
        toast.success('Quiz deleted successfully');
      } catch (error) {
        toast.error('Failed to delete quiz');
        console.error('Error deleting quiz:', error);
      }
    }
  };

  const handleSave = (quizData: any) => {
    // TODO: Implement save logic with API
    console.log('Save quiz:', quizData);
    setIsDialogOpen(false);
    setEditingQuiz(null);
  };

  const columns: ColumnDef<Quiz>[] = [
    {
      accessorKey: 'question',
      header: 'Question',
      cell: ({ row }) => (
        <div className="max-w-md">
          <p className="font-medium line-clamp-2">{row.getValue('question')}</p>
          <p className="text-sm text-muted-foreground mt-1">
            Lesson: {row.original.lessonTitle}
          </p>
        </div>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {(row.getValue('type') as string).replace('_', ' ')}
        </Badge>
      ),
    },
    {
      accessorKey: 'correctAnswer',
      header: 'Correct Answer',
      cell: ({ row }) => (
        <span className="font-medium text-green-600">
          {row.getValue('correctAnswer')}
        </span>
      ),
    },
    {
      accessorKey: 'options',
      header: 'Options',
      cell: ({ row }) => {
        const options = row.getValue('options') as string[];
        return (
          <div className="text-sm">
            {options.length} option{options.length !== 1 ? 's' : ''}
          </div>
        );
      },
    },
    {
      accessorKey: 'explanation',
      header: 'Has Explanation',
      cell: ({ row }) => {
        const explanation = row.getValue('explanation') as string;
        return (
          <Badge variant={explanation ? 'default' : 'secondary'}>
            {explanation ? 'Yes' : 'No'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'updatedAt',
      header: 'Last Updated',
      cell: ({ row }) => {
        const date = new Date(row.getValue('updatedAt'));
        return <span className="text-sm">{date.toLocaleDateString()}</span>;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const quiz = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => console.log('View quiz:', quiz.id)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(quiz)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleDelete(quiz.id)}
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
          <p className="text-destructive mb-2">Failed to load quizzes</p>
          <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AdminDataTable
        title="Quiz Questions"
        description="Manage quiz questions for all lessons"
        data={quizzes}
        columns={columns}
        onAdd={handleAdd}
        searchColumn="question"
        isLoading={isLoading}
      />
      
      <QuizFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        quiz={editingQuiz}
        onSave={handleSave}
      />
    </>
  );
}