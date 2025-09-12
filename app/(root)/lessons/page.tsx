'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Brain, MessageSquare, AlertCircle, Headphones, Volume2, FileText } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import type { Lesson } from '@/features/lessons/config/lesson.types';
import type { UserProgress } from '@/features/progress/config/progress.types';
import { useSession } from '@/auth-client';
import { useUserLanguagePreferences } from '@/features/language/hooks/use-language-preferences';
import { LANGUAGES, type LanguageKey } from '@/features/language/config/language.schema';

export default function LessonsPage() {
  const { data: session } = useSession();
  const { preferences, isLoading: preferencesLoading, error: preferencesError } = useUserLanguagePreferences(session?.user?.id);
  
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);

  // Set default language to user's target language when preferences load
  useEffect(() => {
    if (preferences && preferences.targetLanguage && selectedLanguage === 'all') {
      setSelectedLanguage(preferences.targetLanguage);
    }
  }, [preferences, selectedLanguage]);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedLanguage !== 'all') params.append('language', selectedLanguage);
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
  }, [selectedLanguage, selectedType, selectedLevel]);

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

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'vocabulary':
        return <BookOpen className="h-4 w-4" />;
      case 'grammar':
        return <Brain className="h-4 w-4" />;
      case 'phrases':
        return <MessageSquare className="h-4 w-4" />;
      case 'pronunciation':
        return <Volume2 className="h-4 w-4" />;
      case 'listening':
        return <Headphones className="h-4 w-4" />;
      case 'reading':
        return <FileText className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  if (loading || preferencesLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="mb-6 flex flex-wrap gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
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
          {preferences?.targetLanguage 
            ? `${LANGUAGES[preferences.targetLanguage as LanguageKey]?.name || 'Language'} Lessons ${LANGUAGES[preferences.targetLanguage as LanguageKey]?.flag || ''}` 
            : 'Language Lessons'
          }
        </h1>
        <p className="text-muted-foreground">
          {preferences?.targetLanguage 
            ? `Interactive lessons to improve your ${LANGUAGES[preferences.targetLanguage as LanguageKey]?.name || 'target language'} skills`
            : 'Choose from our interactive lessons to improve your language skills'
          }
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
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

      {/* Lessons Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => {
          const progress = getProgress(lesson.id);
          const isCompleted = progress?.completed ?? false;

          return (
            <Card 
              key={lesson.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                isCompleted ? 'ring-2 ring-green-200 bg-green-50/50' : ''
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(lesson.type)}
                    <div>
                      <CardTitle className="text-lg">{lesson.title}</CardTitle>
                      <CardDescription className="capitalize">
                        {lesson.language} • {lesson.type}
                      </CardDescription>
                    </div>
                  </div>
                  {isCompleted && (
                    <Badge variant="default" className="bg-green-600">
                      ✓ Complete
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant="outline" 
                      className={`capitalize ${getDifficultyColor(lesson.difficultyLevel)}`}
                    >
                      {lesson.difficultyLevel}
                    </Badge>
                    {isCompleted && progress && (
                      <span className="text-sm text-green-600 font-medium">
                        Score: {progress.score}%
                      </span>
                    )}
                  </div>

                  <Button 
                    className="w-full" 
                    variant={isCompleted ? "outline" : "default"}
                    onClick={() => {
                      // For demo purposes, just show an alert
                      alert(`Opening lesson: ${lesson.title}`);
                    }}
                  >
                    {isCompleted ? 'Review Lesson' : 'Start Lesson'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {lessons.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No lessons found matching your filters</p>
        </div>
      )}
    </div>
  );
}