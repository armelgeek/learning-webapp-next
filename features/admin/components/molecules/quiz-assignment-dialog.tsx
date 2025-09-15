'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { X, Plus, BookOpen, HelpCircle, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { QuizFormDialog } from './quiz-form-dialog';
import { useCreateQuiz } from '../../hooks/use-admin-quizzes';

interface Quiz {
  id: string;
  lessonId: string;
  lessonTitle: string;
  question: string;
  type: string;
  correctAnswer: string;
  explanation?: string;
}

interface Lesson {
  id: string;
  title: string;
  type: string;
  difficultyLevel: string;
  language: string;
  estimatedDuration: number;
  moduleOrder?: number;
}

interface QuizAssignmentProps {
  moduleId: string;
  moduleName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuizAssignmentDialog({ 
  moduleId, 
  moduleName, 
  open, 
  onOpenChange 
}: QuizAssignmentProps) {
  const queryClient = useQueryClient();
  const [selectedLessonId, setSelectedLessonId] = useState<string>('');
  const [isQuizFormOpen, setIsQuizFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const createQuiz = useCreateQuiz();

  // Fetch module lessons
  const { data: moduleData, isLoading: moduleLessonsLoading } = useQuery({
    queryKey: ['module-lessons', moduleId],
    queryFn: async () => {
      const response = await axios.get(`/api/modules/${moduleId}/lessons`);
      return response.data;
    },
    enabled: open && !!moduleId,
  });

  // Fetch all quizzes for lessons in this module
  const { data: quizzesData, isLoading: quizzesLoading } = useQuery({
    queryKey: ['module-quizzes', moduleId],
    queryFn: async () => {
      if (!moduleData?.assigned) return [];
      
      const lessonIds = moduleData.assigned.map((lesson: Lesson) => lesson.id);
      if (lessonIds.length === 0) return [];
      
      // Fetch quizzes for all lessons in this module
      const quizPromises = lessonIds.map((lessonId: string) =>
        axios.get(`/api/v1/quizzes?lessonId=${lessonId}`)
      );
      
      const quizResponses = await Promise.all(quizPromises);
      const allQuizzes = quizResponses.flatMap(response => response.data);
      
      return allQuizzes;
    },
    enabled: open && !!moduleData?.assigned,
  });

  const assignedLessons: Lesson[] = moduleData?.assigned || [];
  const moduleQuizzes: Quiz[] = quizzesData || [];

  // Group quizzes by lesson
  const quizzesByLesson = useMemo(() => {
    const grouped: Record<string, Quiz[]> = {};
    moduleQuizzes.forEach(quiz => {
      if (!grouped[quiz.lessonId]) {
        grouped[quiz.lessonId] = [];
      }
      grouped[quiz.lessonId].push(quiz);
    });
    return grouped;
  }, [moduleQuizzes]);

  // Filter lessons based on search
  const filteredLessons = useMemo(() => {
    if (!searchQuery) return assignedLessons;
    return assignedLessons.filter(lesson =>
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [assignedLessons, searchQuery]);

  const handleCreateQuiz = async (quizData: any) => {
    try {
      await createQuiz.mutateAsync(quizData);
      setIsQuizFormOpen(false);
      queryClient.invalidateQueries({ queryKey: ['module-quizzes', moduleId] });
      toast.success('Quiz created successfully');
    } catch (error) {
      toast.error('Failed to create quiz');
      console.error('Error creating quiz:', error);
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (!confirm('Are you sure you want to delete this quiz?')) return;
    
    try {
      await axios.delete(`/api/v1/quizzes/${quizId}`);
      queryClient.invalidateQueries({ queryKey: ['module-quizzes', moduleId] });
      toast.success('Quiz deleted successfully');
    } catch (error) {
      toast.error('Failed to delete quiz');
      console.error('Error deleting quiz:', error);
    }
  };

  const getTotalQuizzesCount = () => {
    return Object.values(quizzesByLesson).flat().length;
  };

  if (moduleLessonsLoading || quizzesLoading) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-[900px] max-w-[90vw] overflow-y-auto">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
              <p>Loading module quizzes...</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[900px] max-w-[90vw] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Manage Quizzes - {moduleName}
          </SheetTitle>
          <SheetDescription>
            Create and manage quizzes for lessons in this module. Total: {getTotalQuizzesCount()} quizzes across {assignedLessons.length} lessons.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Search and Create Controls */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search lessons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              onClick={() => setIsQuizFormOpen(true)}
              className="flex items-center gap-2"
              disabled={assignedLessons.length === 0}
            >
              <Plus className="h-4 w-4" />
              Create Quiz
            </Button>
          </div>

          {/* Lessons and their Quizzes */}
          <div className="space-y-4">
            {assignedLessons.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No Lessons Assigned</h3>
                <p className="text-gray-500">Assign some lessons to this module first to create quizzes.</p>
              </div>
            ) : filteredLessons.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No lessons match your search.
              </div>
            ) : (
              filteredLessons.map((lesson) => {
                const lessonQuizzes = quizzesByLesson[lesson.id] || [];
                return (
                  <div key={lesson.id} className="border rounded-lg overflow-hidden">
                    {/* Lesson Header */}
                    <div className="bg-gray-50 p-4 border-b">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-lg">{lesson.title}</h4>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {lesson.type}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {lesson.difficultyLevel}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {lesson.estimatedDuration}min
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="default" className="text-xs">
                            {lessonQuizzes.length} Quiz{lessonQuizzes.length !== 1 ? 'zes' : ''}
                          </Badge>
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedLessonId(lesson.id);
                              setIsQuizFormOpen(true);
                            }}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Quiz
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Quizzes List */}
                    <div className="p-4">
                      {lessonQuizzes.length === 0 ? (
                        <div className="text-center py-6 text-gray-500">
                          <HelpCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                          <p>No quizzes created for this lesson yet.</p>
                          <Button
                            variant="link"
                            className="mt-2"
                            onClick={() => {
                              setSelectedLessonId(lesson.id);
                              setIsQuizFormOpen(true);
                            }}
                          >
                            Create the first quiz
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {lessonQuizzes.map((quiz) => (
                            <div
                              key={quiz.id}
                              className="flex items-start gap-3 p-3 bg-white border rounded-lg hover:shadow-sm transition-shadow"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm line-clamp-2">
                                  {quiz.question}
                                </p>
                                <div className="flex gap-2 mt-2">
                                  <Badge variant="outline" className="text-xs">
                                    {quiz.type.replace('_', ' ')}
                                  </Badge>
                                  {quiz.explanation && (
                                    <Badge variant="secondary" className="text-xs">
                                      Has explanation
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteQuiz(quiz.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <SheetFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </SheetFooter>
      </SheetContent>

      {/* Quiz Creation Dialog */}
      <QuizFormDialog
        open={isQuizFormOpen}
        onOpenChange={setIsQuizFormOpen}
        quiz={undefined}
        onSave={handleCreateQuiz}
        defaultLessonId={selectedLessonId}
      />
    </Sheet>
  );
}