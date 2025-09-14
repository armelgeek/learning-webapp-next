'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { createLessonSchema } from '@/features/lessons/config/lesson.schema';
import { CreateLessonPayload } from '@/features/lessons/config/lesson.types';
import { useAvailableModules, useLessonById } from '@/features/admin/hooks/use-admin-lessons';

const languages = [
  { value: 'spanish', label: 'Spanish' },
  { value: 'french', label: 'French' },
  { value: 'german', label: 'German' },
  { value: 'italian', label: 'Italian' },
  { value: 'portuguese', label: 'Portuguese' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'chinese', label: 'Chinese' },
  { value: 'english', label: 'English' },
];

const lessonTypes = [
  { value: 'vocabulary', label: 'Vocabulary' },
  { value: 'grammar', label: 'Grammar' },
  { value: 'phrases', label: 'Phrases' },
  { value: 'pronunciation', label: 'Pronunciation' },
  { value: 'listening', label: 'Listening' },
  { value: 'reading', label: 'Reading' },
];

const difficultyLevels = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

interface LessonFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lesson?: any;
  onSave: (data: CreateLessonPayload) => void;
  availableLessons?: Array<{ id: string; title: string; }>;
  defaultModuleId?: string; // Pre-select a specific module
}

export function LessonFormDialog({
  open,
  onOpenChange,
  lesson,
  onSave,
  availableLessons = [],
  defaultModuleId,
}: LessonFormDialogProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  
  // Fetch available modules for the dropdown
  const { data: availableModules = [], isLoading: isLoadingModules } = useAvailableModules();
  
  // Fetch complete lesson data if editing (lesson.id provided)
  const { data: lessonData, isLoading: isLoadingLesson } = useLessonById(lesson?.id || null);
  
  // Use fetched lesson data or fallback to passed lesson prop
  const effectiveLesson = lessonData || lesson;

  const form = useForm<CreateLessonPayload>({
    resolver: zodResolver(createLessonSchema),
    defaultValues: {
      title: '',
      description: '',
      language: 'spanish',
      type: 'vocabulary',
      content: {
        text: '',
        examples: [],
        vocabulary: [],
        grammarRules: [],
      },
      audioUrl: '',
      videoUrl: '',
      imageUrl: '',
      difficultyLevel: 'beginner',
      estimatedDuration: 5,
      pointsReward: 10,
      order: 0,
      prerequisites: [],
      tags: [],
      moduleId: defaultModuleId || undefined, // Use defaultModuleId if provided
    },
  });

  // Update form when lesson data is available (for editing) or when defaultModuleId changes
  useEffect(() => {
    if (effectiveLesson) {
      form.reset({
        title: effectiveLesson.title || '',
        description: effectiveLesson.description || '',
        language: effectiveLesson.language || 'spanish',
        type: effectiveLesson.type || 'vocabulary',
        content: effectiveLesson.content || {
          text: '',
          examples: [],
          vocabulary: [],
          grammarRules: [],
        },
        audioUrl: effectiveLesson.audioUrl || '',
        videoUrl: effectiveLesson.videoUrl || '',
        imageUrl: effectiveLesson.imageUrl || '',
        difficultyLevel: effectiveLesson.difficultyLevel || 'beginner',
        estimatedDuration: effectiveLesson.estimatedDuration || 5,
        pointsReward: effectiveLesson.pointsReward || 10,
        order: effectiveLesson.order || 0,
        prerequisites: effectiveLesson.prerequisites || [],
        tags: effectiveLesson.tags || [],
        moduleId: effectiveLesson.moduleId || undefined,
      });
      setTags(effectiveLesson.tags || []);
    } else if (defaultModuleId && !lesson) {
      // When creating a new lesson with a pre-selected module
      form.setValue('moduleId', defaultModuleId);
    }
  }, [effectiveLesson, form, defaultModuleId, lesson]);

  const onSubmit = (data: CreateLessonPayload) => {
    const submitData = {
      ...data,
      tags,
    };
    onSave(submitData);
    form.reset();
    setTags([]);
  };

  const handleClose = () => {
    form.reset();
    setTags([]);
    onOpenChange(false);
  };

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="sm:max-w-[800px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {lesson ? 'Edit Lesson' : 'Create New Lesson'}
          </SheetTitle>
          <SheetDescription>
            {lesson 
              ? 'Update the lesson information below.'
              : 'Fill in the details to create a new lesson.'
            }
          </SheetDescription>
        </SheetHeader>

        {/* Show loading state when fetching lesson data for editing */}
        {lesson && isLoadingLesson ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
              <p>Loading lesson data...</p>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter lesson title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter lesson description"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {languages.map((language) => (
                          <SelectItem key={language.value} value={language.value}>
                            {language.label}
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
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select lesson type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {lessonTypes.map((type) => (
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

              <FormField
                control={form.control}
                name="difficultyLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {difficultyLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
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
                name="moduleId"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="flex items-center gap-2">
                      📚 Module Assignment (Optional)
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                      <FormControl>
                        <SelectTrigger className="h-auto">
                          <SelectValue placeholder={isLoadingModules ? "🔄 Loading modules..." : "Choose a module to organize this lesson"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="" className="py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">🚫</span>
                            <div>
                              <div className="font-medium">No Module</div>
                              <div className="text-sm text-gray-500">Lesson will not be assigned to any module</div>
                            </div>
                          </div>
                        </SelectItem>
                        {availableModules.map((module: any) => (
                          <SelectItem key={module.id} value={module.id} className="py-3">
                            <div className="flex items-center gap-3 w-full">
                              <span className="text-xl">🎯</span>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">{module.title}</div>
                                <div className="text-sm text-gray-500 truncate">
                                  {module.description || 'No description'}
                                </div>
                                <div className="flex gap-1 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {module.language}
                                  </Badge>
                                  <Badge variant="secondary" className="text-xs">
                                    {module.difficultyLevel}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-sm">
                      💡 Assigning this lesson to a module helps students follow a structured learning path. 
                      Lessons in modules are automatically ordered and unlocked progressively.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estimatedDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="5"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pointsReward"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Points Reward</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="10"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Display order (0 = first)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content.text"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Lesson Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter the main lesson content..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="audioUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Audio URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/audio.mp3" {...field} />
                    </FormControl>
                    <FormDescription>
                      Optional audio file URL
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/video.mp4" {...field} />
                    </FormControl>
                    <FormDescription>
                      Optional video file URL
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormDescription>
                      Optional image URL
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tags Section */}
              <div className="md:col-span-2 space-y-2">
                <FormLabel>Tags</FormLabel>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tag"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
                <FormDescription>
                  Add tags to help categorize this lesson
                </FormDescription>
              </div>
            </div>

            <SheetFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit">
                {lesson ? 'Update Lesson' : 'Create Lesson'}
              </Button>
            </SheetFooter>
          </form>
        </Form>
        )}
      </SheetContent>
    </Sheet>
  );
}