'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { createAchievementSchema, CreateAchievementInput } from '../../config/admin.schema';

const achievementTypes = [
  { value: 'streak', label: 'Learning Streak' },
  { value: 'lessons_completed', label: 'Lessons Completed' },
  { value: 'perfect_score', label: 'Perfect Score' },
  { value: 'daily_goal', label: 'Daily Goal' },
  { value: 'weekly_goal', label: 'Weekly Goal' },
];

interface AchievementFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  achievement?: any;
  onSave: (data: CreateAchievementInput) => void;
}

export function AchievementFormDialog({
  open,
  onOpenChange,
  achievement,
  onSave,
}: AchievementFormDialogProps) {
  const form = useForm<CreateAchievementInput>({
    resolver: zodResolver(createAchievementSchema),
    defaultValues: {
      name: achievement?.name || '',
      description: achievement?.description || '',
      type: achievement?.type || 'lessons_completed',
      iconUrl: achievement?.iconUrl || '',
      pointsRequired: achievement?.pointsRequired || 0,
      criteria: achievement?.criteria || {},
      isActive: achievement?.isActive ?? true,
    },
  });

  const onSubmit = (data: CreateAchievementInput) => {
    onSave(data);
    form.reset();
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {achievement ? 'Edit Achievement' : 'Create New Achievement'}
          </DialogTitle>
          <DialogDescription>
            {achievement 
              ? 'Update the achievement information below.'
              : 'Fill in the details to create a new achievement.'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Achievement Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter achievement name" {...field} />
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
                        placeholder="Describe what users need to do to earn this achievement"
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
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Achievement Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {achievementTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The category this achievement belongs to
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pointsRequired"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Points Required</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Points needed before earning (0 = no requirement)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="iconUrl"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Icon URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/icon.svg" {...field} />
                    </FormControl>
                    <FormDescription>
                      Optional icon URL for the achievement badge
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormLabel>Achievement Criteria</FormLabel>
              <div className="p-4 border rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-3">
                  Configure the specific requirements for this achievement. The criteria format depends on the achievement type:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>Streak:</strong> {"{ streakDays: 7 }"}</li>
                  <li>• <strong>Lessons Completed:</strong> {"{ lessonsCount: 10 }"}</li>
                  <li>• <strong>Perfect Score:</strong> {"{ perfectScore: true }"}</li>
                  <li>• <strong>Daily Goal:</strong> {"{ dailyGoalsCompleted: 30 }"}</li>
                  <li>• <strong>Weekly Goal:</strong> {"{ weeklyGoalsCompleted: 4 }"}</li>
                </ul>
              </div>
            </div>

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Status</FormLabel>
                    <FormDescription>
                      Whether users can earn this achievement
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit">
                {achievement ? 'Update Achievement' : 'Create Achievement'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}