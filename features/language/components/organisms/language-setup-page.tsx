'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LanguageSelectionForm } from '@/features/language/components/organisms/language-selection-form';
import { LanguageService } from '@/features/language/domain/service';
import type { LanguageSelection } from '@/features/language/config/language.schema';
import { toast } from 'sonner';

interface LanguageSetupPageProps {
  userId: string;
}

export default function LanguageSetupPage({ userId }: LanguageSetupPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLanguageSelection = async (selection: LanguageSelection) => {
    setIsLoading(true);
    try {
      const result = await LanguageService.updateUserLanguagePreferences(userId, selection);
      
      if (result.success) {
        toast.success('Language preferences saved!');
        router.push('/'); // Redirect to home page
      } else {
        toast.error(result.error || 'Failed to save preferences');
      }
    } catch (error) {
      toast.error('An error occurred while saving your preferences');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to LinguaLearn!</h1>
          <p className="text-muted-foreground">
            Let&apos;s personalize your language learning experience
          </p>
        </div>
        
        {isLoading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Setting up your preferences...</p>
          </div>
        ) : (
          <LanguageSelectionForm onComplete={handleLanguageSelection} />
        )}
      </div>
    </div>
  );
}