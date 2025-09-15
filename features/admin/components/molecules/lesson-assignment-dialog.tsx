'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Label } from '@/components/ui/label';
import { X, Plus, GripVertical, BookPlus } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { LessonFormDialog } from './lesson-form-dialog';
import { useCreateLesson } from '../../hooks/use-admin-lessons';

interface Lesson {
  id: string;
  title: string;
  type: string;
  difficultyLevel: string;
  language: string;
  estimatedDuration: number;
  moduleOrder?: number;
}

interface LessonAssignmentProps {
  moduleId: string;
  moduleName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LessonAssignmentDialog({ 
  moduleId, 
  moduleName, 
  open, 
  onOpenChange 
}: LessonAssignmentProps) {
  const queryClient = useQueryClient();
  const [selectedLessonId, setSelectedLessonId] = useState<string>('');
  const [isLessonFormOpen, setIsLessonFormOpen] = useState(false);
  const createLesson = useCreateLesson();

  // Fetch module lessons
  const { data: moduleData, isLoading } = useQuery({
    queryKey: ['module-lessons', moduleId],
    queryFn: async () => {
      const response = await axios.get(`/api/modules/${moduleId}/lessons`);
      return response.data;
    },
    enabled: open && !!moduleId,
  });

  // Assign lesson mutation
  const assignLessonMutation = useMutation({
    mutationFn: async (data: { lessonIds: string[]; orders?: number[] }) => {
      const response = await axios.post(`/api/modules/${moduleId}/lessons`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['module-lessons', moduleId] });
      queryClient.invalidateQueries({ queryKey: ['admin-modules'] });
      toast.success('Lesson assigned successfully');
      setSelectedLessonId('');
    },
    onError: () => {
      toast.error('Failed to assign lesson');
    },
  });

  // Remove lesson mutation
  const removeLessonMutation = useMutation({
    mutationFn: async (lessonId: string) => {
      const response = await axios.delete(`/api/modules/${moduleId}/lessons`, {
        data: { lessonId }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['module-lessons', moduleId] });
      queryClient.invalidateQueries({ queryKey: ['admin-modules'] });
      toast.success('Lesson removed successfully');
    },
    onError: () => {
      toast.error('Failed to remove lesson');
    },
  });

  const assignedLessons: Lesson[] = moduleData?.assigned || [];
  const availableLessons: Lesson[] = moduleData?.available || [];

  const handleAssignLesson = () => {
    if (!selectedLessonId) return;
    
    assignLessonMutation.mutate({
      lessonIds: [selectedLessonId],
      orders: [assignedLessons.length],
    });
  };

  const handleRemoveLesson = (lessonId: string) => {
    removeLessonMutation.mutate(lessonId);
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(assignedLessons);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update orders for all lessons
    const lessonOrders = items.map((lesson, index) => ({
      lessonId: lesson.id,
      order: index,
    }));

    try {
      await axios.put(`/api/modules/${moduleId}/lessons/order`, { lessonOrders });
      queryClient.invalidateQueries({ queryKey: ['module-lessons', moduleId] });
      toast.success('Lesson order updated successfully');
    } catch (error) {
      toast.error('Failed to update lesson order');
      console.error('Error reordering lessons:', error);
    }
  };

  const handleCreateLesson = async (lessonData: any) => {
    try {
      // Create the lesson
      const newLesson = await createLesson.mutateAsync(lessonData);
      
      // Automatically assign it to this module
      await assignLessonMutation.mutateAsync({
        lessonIds: [newLesson.id],
        orders: [assignedLessons.length],
      });
      
      setIsLessonFormOpen(false);
      toast.success('Lesson created and assigned successfully');
    } catch (error) {
      toast.error('Failed to create lesson');
      console.error('Error creating lesson:', error);
    }
  };

  if (isLoading) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-[800px] max-w-[90vw] overflow-y-auto">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
              <p>Loading lessons...</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[800px] max-w-[90vw] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Manage Lessons - {moduleName}</SheetTitle>
          <SheetDescription>
            Assign lessons to this module and reorder them as needed.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Assigned Lessons */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              Assigned Lessons ({assignedLessons.length})
            </h3>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="assigned-lessons">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2 min-h-[200px] p-2 border-2 border-dashed border-gray-200 rounded-lg"
                  >
                    {assignedLessons.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        No lessons assigned yet
                      </div>
                    ) : (
                      assignedLessons.map((lesson, index) => (
                        <Draggable key={lesson.id} draggableId={lesson.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`flex items-center gap-2 p-3 bg-white border rounded-lg shadow-sm ${
                                snapshot.isDragging ? 'shadow-lg' : ''
                              }`}
                            >
                              <div {...provided.dragHandleProps}>
                                <GripVertical className="h-4 w-4 text-gray-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">
                                  {lesson.title}
                                </div>
                                <div className="flex gap-1 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {lesson.type}
                                  </Badge>
                                  <Badge variant="secondary" className="text-xs">
                                    {lesson.difficultyLevel}
                                  </Badge>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveLesson(lesson.id)}
                                disabled={removeLessonMutation.isPending}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>

          {/* Available Lessons */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">
                Available Lessons ({availableLessons.length})
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLessonFormOpen(true)}
                className="flex items-center gap-2"
              >
                <BookPlus className="h-4 w-4" />
                Create New Lesson
              </Button>
            </div>

            {/* Add Lesson Form */}
            <div className="flex gap-2">
              <Select value={selectedLessonId} onValueChange={setSelectedLessonId}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a lesson to assign" />
                </SelectTrigger>
                <SelectContent>
                  {availableLessons.map((lesson) => (
                    <SelectItem key={lesson.id} value={lesson.id}>
                      <div className="flex items-center gap-2">
                        <span>{lesson.title}</span>
                        <Badge variant="outline" className="text-xs">
                          {lesson.type}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleAssignLesson}
                disabled={!selectedLessonId || assignLessonMutation.isPending}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Assign
              </Button>
            </div>

            {/* Available Lessons List */}
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {availableLessons.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  All lessons are assigned
                </div>
              ) : (
                availableLessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center gap-2 p-3 bg-gray-50 border rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {lesson.title}
                      </div>
                      <div className="flex gap-1 mt-1">
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedLessonId(lesson.id);
                        handleAssignLesson();
                      }}
                      disabled={assignLessonMutation.isPending}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <SheetFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </SheetFooter>
      </SheetContent>

      {/* Lesson Creation Sheet - now as sheet instead of dialog */}
      <LessonFormDialog
        open={isLessonFormOpen}
        onOpenChange={setIsLessonFormOpen}
        lesson={null}
        onSave={handleCreateLesson}
        defaultModuleId={moduleId}
      />
    </Sheet>
  );
}