'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Target, Clock } from 'lucide-react';
import { updateLearningGoalsSchema, type UpdateLearningGoalsInput } from '../../config/profile.schema';

interface LearningGoalsFormProps {
  goals: {
    dailyGoal: number;
    weeklyGoal: number;
    learningGoal?: string;
  };
  onUpdate: (data: UpdateLearningGoalsInput) => Promise<void>;
}

export function LearningGoalsForm({ goals, onUpdate }: LearningGoalsFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<UpdateLearningGoalsInput>({
    resolver: zodResolver(updateLearningGoalsSchema),
    defaultValues: {
      dailyGoal: goals.dailyGoal || 15,
      weeklyGoal: goals.weeklyGoal || 105,
      learningGoal: goals.learningGoal || '',
    },
  });

  const dailyGoal = form.watch('dailyGoal');
  const weeklyGoal = form.watch('weeklyGoal');

  const onSubmit = async (data: UpdateLearningGoalsInput) => {
    setIsLoading(true);
    try {
      await onUpdate(data);
      toast.success('Learning goals updated successfully!');
    } catch (error) {
      toast.error('Failed to update learning goals. Please try again.');
      console.error('Learning goals update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours} hour${hours > 1 ? 's' : ''}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Learning Goals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Daily Goal */}
            <FormField
              control={form.control}
              name="dailyGoal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Daily Goal: {formatTime(dailyGoal)}
                  </FormLabel>
                  <FormControl>
                    <div className="px-2">
                      <Slider
                        min={5}
                        max={180}
                        step={5}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="w-full"
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Set your daily study goal (5 minutes to 3 hours)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Weekly Goal */}
            <FormField
              control={form.control}
              name="weeklyGoal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Weekly Goal: {formatTime(weeklyGoal)}
                  </FormLabel>
                  <FormControl>
                    <div className="px-2">
                      <Slider
                        min={30}
                        max={1260}
                        step={15}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="w-full"
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Set your weekly study goal (30 minutes to 21 hours)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Learning Goal Description */}
            <FormField
              control={form.control}
              name="learningGoal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What do you want to achieve?</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your language learning goal (e.g., 'Become conversational in Spanish for my trip to Mexico', 'Pass the JLPT N3 exam', 'Improve my business English')"
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Having a clear goal helps you stay motivated and track meaningful progress.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Goal Preview */}
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Goal Summary</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>• Daily: {formatTime(dailyGoal)} of study time</p>
                <p>• Weekly: {formatTime(weeklyGoal)} total study time</p>
                <p>• That's about {Math.round(weeklyGoal / 7)} minutes per day on average</p>
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
              {isLoading ? 'Updating...' : 'Update Goals'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}