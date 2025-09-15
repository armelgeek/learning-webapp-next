'use client';

import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useSession } from '@/auth-client';
import { useUserLanguagePreferences } from '@/features/language/hooks/use-language-preferences';
import { LANGUAGES, type LanguageKey } from '@/features/language/config/language.schema';
import { ModuleProgressionView } from '@/features/modules/components/organisms/module-progression-view';

export default function LessonsPage() {
  const { data: session } = useSession();
  const { preferences, isLoading: preferencesLoading, error: preferencesError } = useUserLanguagePreferences(session?.user?.id);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  
  // Update selected language when preferences load
  useEffect(() => {
    if (preferences?.targetLanguage) {
      setSelectedLanguage(preferences.targetLanguage);
    }
  }, [preferences]);

  const handleStartModule = (moduleId: string) => {
    // Navigate to the module's first lesson
    // For now, just show an alert
    alert(`Starting module: ${moduleId}`);
  };

  const handleSetLanguagePreference = () => {
    // Navigate to language preference settings
    // This could be enhanced to navigate to a profile/settings page
    alert('Please set your target language in your profile settings first.');
  };

  if (preferencesLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="mb-6">
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  if (preferencesError || !preferences?.targetLanguage) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Please set your target language preference to start learning.</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSetLanguagePreference}
              className="ml-4"
            >
              Set Language
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Get language details
  const targetLanguage = preferences.targetLanguage;
  const languageInfo = LANGUAGES[targetLanguage as LanguageKey];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {languageInfo?.name || 'Language'} Learning Path {languageInfo?.flag || ''}
        </h1>
        <p className="text-muted-foreground">
          Complete modules in order to unlock new content and progress through your learning journey.
        </p>
      </div>
      <ModuleProgressionView
        language={selectedLanguage}
        languageName={LANGUAGES[selectedLanguage as LanguageKey]?.name || 'Language'}
        languageFlag={LANGUAGES[selectedLanguage as LanguageKey]?.flag || ''}
        onStartModule={handleStartModule}
      />
    </div>
  );
}
