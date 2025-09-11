'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { updateProfileSchema, type UpdateProfileInput, languages, difficultyLevels } from '../../config/profile.schema';

interface ProfileFormProps {
  user: {
    name: string;
    email: string;
    age?: number;
    nativeLanguage?: string;
    targetLanguages?: string[];
    currentLevel?: string;
    learningGoal?: string;
    bio?: string;
    country?: string;
    timezone?: string;
  };
  onUpdate: (data: UpdateProfileInput) => Promise<void>;
}

export function ProfileForm({ user, onUpdate }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name || '',
      age: user.age || undefined,
      nativeLanguage: user.nativeLanguage as any || undefined,
      targetLanguages: (user.targetLanguages as any) || [],
      currentLevel: user.currentLevel as any || undefined,
      learningGoal: user.learningGoal || '',
      bio: user.bio || '',
      country: user.country || '',
      timezone: user.timezone || '',
    },
  });

  const selectedTargetLanguages = form.watch('targetLanguages') || [];

  const addTargetLanguage = (language: string) => {
    if (!selectedTargetLanguages.includes(language as any) && selectedTargetLanguages.length < 5) {
      form.setValue('targetLanguages', [...selectedTargetLanguages, language as any]);
    }
  };

  const removeTargetLanguage = (language: string) => {
    form.setValue('targetLanguages', selectedTargetLanguages.filter(lang => lang !== language));
  };

  const onSubmit = async (data: UpdateProfileInput) => {
    setIsLoading(true);
    try {
      await onUpdate(data);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
      console.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getLanguageDisplayName = (lang: string) => {
    return lang.charAt(0).toUpperCase() + lang.slice(1);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter your age" 
                        {...field} 
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timezone (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., UTC+2, EST" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Language Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nativeLanguage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Native Language</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your native language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang} value={lang}>
                            {getLanguageDisplayName(lang)}
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
                name="currentLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your current level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {difficultyLevels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Target Languages */}
            <FormField
              control={form.control}
              name="targetLanguages"
              render={() => (
                <FormItem>
                  <FormLabel>Target Languages (Max 5)</FormLabel>
                  <div className="space-y-2">
                    <Select 
                      onValueChange={addTargetLanguage}
                      disabled={selectedTargetLanguages.length >= 5}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select languages you want to learn" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {languages
                          .filter(lang => !selectedTargetLanguages.includes(lang))
                          .map((lang) => (
                            <SelectItem key={lang} value={lang}>
                              {getLanguageDisplayName(lang)}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    
                    {selectedTargetLanguages.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedTargetLanguages.map((lang) => (
                          <Badge key={lang} variant="secondary" className="pr-1">
                            {getLanguageDisplayName(lang)}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 ml-1"
                              onClick={() => removeTargetLanguage(lang)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Learning Goal and Bio */}
            <FormField
              control={form.control}
              name="learningGoal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Learning Goal (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What do you want to achieve with language learning?"
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us a bit about yourself..."
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
              {isLoading ? 'Updating...' : 'Update Profile'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}