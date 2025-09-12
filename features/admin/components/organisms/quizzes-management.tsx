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

// Mock data for demo
const mockQuizzes = [
  {
    id: '1',
    lessonId: 'lesson-1',
    lessonTitle: 'Spanish Greetings',
    question: '¿Cómo se dice "Hello" en español?',
    options: ['Hola', 'Adiós', 'Buenos días', 'Buenas noches'],
    correctAnswer: 'Hola',
    type: 'multiple_choice',
    explanation: 'Hola is the most common way to say Hello in Spanish.',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
  },
  {
    id: '2',
    lessonId: 'lesson-2',
    lessonTitle: 'French Numbers',
    question: 'How do you say "five" in French?',
    options: ['quatre', 'cinq', 'six', 'sept'],
    correctAnswer: 'cinq',
    type: 'multiple_choice',
    explanation: 'Cinq is the French word for five.',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-18T14:20:00Z',
  },
  {
    id: '3',
    lessonId: 'lesson-3',
    lessonTitle: 'German Articles',
    question: 'What is the definite article for "Haus" (house)?',
    options: ['der', 'die', 'das', 'den'],
    correctAnswer: 'das',
    type: 'multiple_choice',
    explanation: 'Das is the definite article for neuter nouns like Haus.',
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-01-12T11:15:00Z',
  },
];

type Quiz = typeof mockQuizzes[0];

export function QuizzesManagement() {
  const [quizzes, setQuizzes] = useState<Quiz[]>(mockQuizzes);
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

  const handleDelete = (quizId: string) => {
    if (confirm('Are you sure you want to delete this quiz?')) {
      setQuizzes(quizzes.filter(q => q.id !== quizId));
    }
  };

  const handleSave = (quizData: any) => {
    if (editingQuiz) {
      // Update existing quiz
      setQuizzes(quizzes.map(q => 
        q.id === editingQuiz.id 
          ? { ...q, ...quizData, updatedAt: new Date().toISOString() }
          : q
      ));
    } else {
      // Add new quiz
      const newQuiz = {
        ...quizData,
        id: Date.now().toString(),
        lessonTitle: 'Unknown Lesson', // In real app, fetch from API
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setQuizzes([...quizzes, newQuiz]);
    }
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

  return (
    <>
      <AdminDataTable
        title="Quiz Questions"
        description="Manage quiz questions for all lessons"
        data={quizzes}
        columns={columns}
        onAdd={handleAdd}
        searchColumn="question"
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