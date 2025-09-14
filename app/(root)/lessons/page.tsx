'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, BookOpen, Map } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSession } from '@/auth-client';
import { useUserLanguagePreferences } from '@/features/language/hooks/use-language-preferences';
import { LANGUAGES, type LanguageKey } from '@/features/language/config/language.schema';
import { ModuleProgressionView } from '@/features/modules/components/organisms/module-progression-view';
import { LessonList } from '@/features/lessons/components/organisms/lesson-list';
import { useLessonsWithPrerequisites } from '@/features/lessons/hooks/use-lessons-with-prerequisites';
import { Language, LessonType, DifficultyLevel } from '@/features/lessons/config/lesson.types';

export default function LessonsPage() {
  const { data: session } = useSession();
  const { preferences, isLoading: preferencesLoading, error: preferencesError } = useUserLanguagePreferences(session?.user?.id);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('modules');

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

  const handleStartLesson = (lessonId: string) => {
    // Navigate to the specific lesson
    // For now, just show an alert
    alert(`Starting lesson: ${lessonId}`);
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

      {/* Language Selector */}
      <div className="mb-6">
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Languages</SelectItem>
            {Object.entries(LANGUAGES).map(([key, language]) => (
              <SelectItem key={key} value={key}>
                {language.flag} {language.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Only show content if a specific language is selected */}
      {selectedLanguage === 'all' ? (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Choose a Language</h3>
          <p className="text-muted-foreground">
            Select a language above to start your learning journey
          </p>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="modules" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              Learning Path
            </TabsTrigger>
            <TabsTrigger value="lessons" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              All Lessons
            </TabsTrigger>
          </TabsList>

          <TabsContent value="modules" className="mt-6">
            <ModuleProgressionView
              language={selectedLanguage}
              languageName={LANGUAGES[selectedLanguage as LanguageKey]?.name || 'Language'}
              languageFlag={LANGUAGES[selectedLanguage as LanguageKey]?.flag || ''}
              onStartModule={handleStartModule}
            />
          </TabsContent>

          <TabsContent value="lessons" className="mt-6">
            <LegacyLessonsView 
              language={selectedLanguage}
              onStartLesson={handleStartLesson}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

// Keep the old lessons view as a legacy component for individual lesson browsing
function LegacyLessonsView({ 
  language, 
  onStartLesson 
}: { 
  language: string; 
  onStartLesson: (lessonId: string) => void;
}) {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // Build filter for lessons
  const filter = {
    language: language !== 'all' ? (language as Language) : undefined,
    type: selectedType !== 'all' ? (selectedType as LessonType) : undefined,
    difficultyLevel: selectedLevel !== 'all' ? (selectedLevel as DifficultyLevel) : undefined,
    isActive: true,
  };

  // Use the new hook for lessons with prerequisites
  const { lessons, isLoading } = useLessonsWithPrerequisites(userId || '', filter);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-48" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Please log in to view lessons with your progress.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Browse Individual Lessons</h2>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Lesson Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="vocabulary">📚 Vocabulary</SelectItem>
              <SelectItem value="grammar">🧠 Grammar</SelectItem>
              <SelectItem value="phrases">💬 Phrases</SelectItem>
              <SelectItem value="pronunciation">🗣️ Pronunciation</SelectItem>
              <SelectItem value="listening">👂 Listening</SelectItem>
              <SelectItem value="reading">📖 Reading</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Difficulty Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Use the new LessonList component with prerequisite-aware lessons */}
      <LessonList
        lessons={lessons}
        onLessonClick={onStartLesson}
      />
    </div>
  );
}