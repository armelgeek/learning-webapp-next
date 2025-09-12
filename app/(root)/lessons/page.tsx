'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, BookOpen, Map } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useSession } from '@/auth-client';
import { useUserLanguagePreferences } from '@/features/language/hooks/use-language-preferences';
import { LANGUAGES, type LanguageKey } from '@/features/language/config/language.schema';
import { ModuleProgressionView } from '@/features/modules/components/organisms/module-progression-view';
import { LessonList } from '@/features/lessons/components/organisms/lesson-list';

export default function LessonsPage() {
  const { data: session } = useSession();
  const { preferences, isLoading: preferencesLoading, error: preferencesError } = useUserLanguagePreferences(session?.user?.id);
  
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('modules');

  // Set default language to user's target language when preferences load
  useEffect(() => {
    if (preferences && preferences.targetLanguage && selectedLanguage === 'all') {
      setSelectedLanguage(preferences.targetLanguage);
    }
  }, [preferences, selectedLanguage]);

  const handleStartModule = (moduleId: string) => {
    // Navigate to the module's first lesson
    // For now, just show an alert
    alert(`Starting module: ${moduleId}`);
  };

  const handleStartLesson = (lessonId: string) => {
    // Navigate to lesson
    alert(`Starting lesson: ${lessonId}`);
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

  if (preferencesError && !preferences?.targetLanguage) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Unable to load your language preferences. Please set your target language in your profile settings.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Language Learning
        </h1>
        <p className="text-muted-foreground">
          Choose your learning approach: structured modules or browse individual lessons
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
  const [lessons, setLessons] = useState<any[]>([]);
  const [userProgress, setUserProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (language !== 'all') params.append('language', language);
        if (selectedType !== 'all') params.append('type', selectedType);
        if (selectedLevel !== 'all') params.append('difficultyLevel', selectedLevel);
        
        const response = await fetch(`/api/lessons?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setLessons(data);
        } else {
          console.error('Failed to fetch lessons');
        }
      } catch (error) {
        console.error('Error fetching lessons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [language, selectedType, selectedLevel]);

  // Fetch user progress when user session is available
  useEffect(() => {
    const fetchProgress = async () => {
      if (!session?.user) return;
      
      try {
        const response = await fetch('/api/progress');
        if (response.ok) {
          const progressData = await response.json();
          setUserProgress(progressData);
        } else {
          console.error('Failed to fetch user progress');
        }
      } catch (error) {
        console.error('Error fetching user progress:', error);
      }
    };

    if (session?.user) {
      fetchProgress();
    }
  }, [session?.user]);

  const getProgress = (lessonId: string) => {
    return userProgress.find(p => p.lessonId === lessonId);
  };

  if (loading) {
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

      {/* Transform lessons data for LessonList component */}
      <LessonList
        lessons={lessons.map(lesson => ({
          lesson,
          progress: getProgress(lesson.id)
        }))}
        onLessonClick={onStartLesson}
      />
    </div>
  );
}