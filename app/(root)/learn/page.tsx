'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, Clock, Play, Search } from 'lucide-react';
import { useLessons } from '@/features/lessons/hooks/use-lessons';
import type { LessonQuery, Language, Difficulty, LessonType, LessonWithProgress } from '@/features/lessons/config/lesson.types';
import Link from 'next/link';

export default function LearnPage() {
  const [query, setQuery] = useState<LessonQuery>({
    page: 1,
    pageSize: 10
  });

  const { data: lessonsData, isLoading, error } = useLessons(query);

  const updateQuery = (updates: Partial<LessonQuery>) => {
    setQuery(prev => ({ ...prev, ...updates, page: 1 }));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLanguageFlag = (language: string) => {
    const flags: { [key: string]: string } = {
      english: '🇺🇸',
      french: '🇫🇷',
      spanish: '🇪🇸',
      german: '🇩🇪',
      italian: '🇮🇹',
      portuguese: '🇵🇹'
    };
    return flags[language] || '🌍';
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Lessons</h1>
          <p className="text-gray-600">Failed to load lessons. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">🌐 Learn Languages</h1>
        <p className="text-gray-600">Discover interactive lessons to master new languages</p>
      </div>

      {/* Filters */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search lessons..."
              value={query.search || ''}
              onChange={(e) => updateQuery({ search: e.target.value || undefined })}
              className="pl-10"
            />
          </div>

          {/* Language Filter */}
          <Select
            value={query.language || 'all'}
            onValueChange={(value) => updateQuery({ language: value === 'all' ? undefined : (value as Language) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Languages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              <SelectItem value="english">🇺🇸 English</SelectItem>
              <SelectItem value="french">🇫🇷 French</SelectItem>
              <SelectItem value="spanish">🇪🇸 Spanish</SelectItem>
              <SelectItem value="german">🇩🇪 German</SelectItem>
              <SelectItem value="italian">🇮🇹 Italian</SelectItem>
              <SelectItem value="portuguese">🇵🇹 Portuguese</SelectItem>
            </SelectContent>
          </Select>

          {/* Difficulty Filter */}
          <Select
            value={query.difficulty || 'all'}
            onValueChange={(value) => updateQuery({ difficulty: value === 'all' ? undefined : (value as Difficulty) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>

          {/* Lesson Type Filter */}
          <Select
            value={query.lessonType || 'all'}
            onValueChange={(value) => updateQuery({ lessonType: value === 'all' ? undefined : (value as LessonType) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="vocabulary">Vocabulary</SelectItem>
              <SelectItem value="grammar">Grammar</SelectItem>
              <SelectItem value="phrases">Phrases</SelectItem>
              <SelectItem value="conversation">Conversation</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-gray-200 rounded mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Lessons Grid */}
      {!isLoading && lessonsData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {lessonsData.lessons.map((lesson: LessonWithProgress) => (
              <Card key={lesson.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2 flex items-center gap-2">
                        <span>{getLanguageFlag(lesson.language)}</span>
                        {lesson.title}
                        {lesson.progress?.isCompleted && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {lesson.description || 'No description available'}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Tags and Badges */}
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getDifficultyColor(lesson.difficulty)}>
                        {lesson.difficulty}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {lesson.lessonType}
                      </Badge>
                      {lesson.estimatedDuration && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {lesson.estimatedDuration}m
                        </Badge>
                      )}
                    </div>

                    {/* Tags */}
                    {lesson.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {lesson.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {lesson.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{lesson.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Action Button */}
                    <Link href={`/learn/lesson/${lesson.id}`}>
                      <Button className="w-full" variant={lesson.progress?.isCompleted ? "outline" : "default"}>
                        <Play className="h-4 w-4 mr-2" />
                        {lesson.progress?.isCompleted ? 'Review Lesson' : 'Start Lesson'}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {lessonsData.totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                disabled={lessonsData.page <= 1}
                onClick={() => updateQuery({ page: lessonsData.page - 1 })}
              >
                Previous
              </Button>
              
              <div className="flex items-center gap-2">
                {[...Array(Math.min(5, lessonsData.totalPages))].map((_, i) => {
                  const pageNum = lessonsData.page - 2 + i;
                  if (pageNum < 1 || pageNum > lessonsData.totalPages) return null;
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === lessonsData.page ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateQuery({ page: pageNum })}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                disabled={lessonsData.page >= lessonsData.totalPages}
                onClick={() => updateQuery({ page: lessonsData.page + 1 })}
              >
                Next
              </Button>
            </div>
          )}

          {/* Results Summary */}
          <div className="text-center text-sm text-gray-600 mt-4">
            Showing {lessonsData.lessons.length} of {lessonsData.total} lessons
          </div>
        </>
      )}

      {/* Empty State */}
      {!isLoading && lessonsData && lessonsData.lessons.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No lessons found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your filters or search terms.</p>
          <Button onClick={() => setQuery({ page: 1, pageSize: 10 })}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}