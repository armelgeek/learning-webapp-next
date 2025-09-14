'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { createQuizSchema, CreateQuizInput } from '../../config/admin.schema';

const quizTypes = [
  { value: 'multiple_choice', label: 'Multiple Choice' },
  { value: 'flashcard', label: 'Flashcard' },
  { value: 'fill_blanks', label: 'Fill in the Blanks' },
  { value: 'translation', label: 'Translation' },
  { value: 'dictation', label: 'Dictation' },
  { value: 'pronunciation', label: 'Pronunciation' },
];

// Mock lessons for the dropdown - in real app, fetch from API
const mockLessons = [
  { id: 'lesson-1', title: 'Spanish Greetings' },
  { id: 'lesson-2', title: 'French Numbers' },
  { id: 'lesson-3', title: 'German Articles' },
  { id: 'lesson-4', title: 'Italian Food' },
  { id: 'lesson-5', title: 'Portuguese Basics' },
];

interface QuizFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quiz?: any;
  onSave: (data: CreateQuizInput) => void;
}

export function QuizFormDialog({
  open,
  onOpenChange,
  quiz,
  onSave,
}: QuizFormDialogProps) {
  const form = useForm<CreateQuizInput>({
    resolver: zodResolver(createQuizSchema),
    defaultValues: {
      lessonId: quiz?.lessonId || '',
      question: quiz?.question || '',
      options: quiz?.options || ['Option 1', 'Option 2'],
      correctAnswer: quiz?.correctAnswer || '',
      type: quiz?.type || 'multiple_choice',
      explanation: quiz?.explanation || '',
    },
  });

  const onSubmit = (data: CreateQuizInput) => {
    onSave(data);
    form.reset();
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {quiz ? 'Edit Quiz Question' : 'Create New Quiz Question'}
          </SheetTitle>
          <SheetDescription>
            {quiz 
              ? 'Update the quiz question information below.'
              : 'Fill in the details to create a new quiz question.'
            }
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="lessonId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lesson</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select lesson" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockLessons.map((lesson) => (
                          <SelectItem key={lesson.id} value={lesson.id}>
                            {lesson.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quiz Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select quiz type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {quizTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the quiz question"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel>Answer Options (Enter comma-separated values)</FormLabel>
              <FormField
                control={form.control}
                name="options"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Option 1, Option 2, Option 3, Option 4"
                        value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                        onChange={(e) => {
                          const options = e.target.value.split(',').map(opt => opt.trim()).filter(Boolean);
                          field.onChange(options);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Separate options with commas. Minimum 2 options required.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="correctAnswer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correct Answer</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the correct answer exactly as it appears in options"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Must match one of the options exactly
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="explanation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Explanation (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Explain why this is the correct answer"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Helpful explanation shown after answering
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit">
                {quiz ? 'Update Quiz' : 'Create Quiz'}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}