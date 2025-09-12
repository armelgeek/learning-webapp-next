'use client';

import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Map, Trophy, Star } from 'lucide-react';
import { ModuleCard } from '../molecules/module-card';
import { useModules } from '../../hooks/use-modules';
import type { ModuleWithProgress } from '../../config/module.types';

interface ModuleProgressionViewProps {
  language: string;
  languageName: string;
  languageFlag: string;
  onStartModule: (moduleId: string) => void;
}

export function ModuleProgressionView({ 
  language, 
  languageName, 
  languageFlag,
  onStartModule 
}: ModuleProgressionViewProps) {
  const { modules, loading, error, refetch } = useModules(language);

  // Calculate overall progress stats
  const totalModules = modules.length;
  const completedModules = modules.filter(m => m.completionPercentage === 100).length;
  const totalLessons = modules.reduce((sum, m) => sum + m.totalLessons, 0);
  const completedLessons = modules.reduce((sum, m) => sum + m.completedLessons, 0);
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>

        {/* Stats Skeleton */}
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>

        {/* Modules Skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  if (modules.length === 0) {
    return (
      <div className="text-center py-12">
        <Map className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Learning Path Available</h3>
        <p className="text-muted-foreground">
          No modules are available for {languageName} yet. Check back later!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">
          {languageName} Learning Path {languageFlag}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Master {languageName} step by step! Complete each module to unlock the next one in your learning journey.
        </p>
      </div>

      {/* Progress Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <Map className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600">{completedModules}/{totalModules}</div>
          <p className="text-sm text-blue-700 dark:text-blue-300">Modules Completed</p>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <Trophy className="h-6 w-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">{completedLessons}/{totalLessons}</div>
          <p className="text-sm text-green-700 dark:text-green-300">Lessons Completed</p>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <Star className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-yellow-600">{overallProgress}%</div>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">Overall Progress</p>
        </div>
      </div>

      {/* Learning Path */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Your Learning Path</h2>
          <p className="text-muted-foreground">
            Complete modules in order to unlock new content
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module, index) => (
            <div key={module.id} className="relative">
              {/* Connection Line for Desktop */}
              {index < modules.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-border z-0" />
              )}
              
              {/* Module Number Badge */}
              <div className="absolute -top-3 -left-3 z-10 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                {index + 1}
              </div>
              
              <ModuleCard 
                module={module} 
                onStartModule={onStartModule}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Duolingo-style Encouragement */}
      {overallProgress > 0 && (
        <div className="text-center py-6">
          <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 px-4 py-2 rounded-full">
            <Trophy className="h-4 w-4" />
            <span className="text-sm font-medium">
              {overallProgress < 25 
                ? "Great start! Keep going!" 
                : overallProgress < 50 
                ? "You're making good progress!" 
                : overallProgress < 75 
                ? "Halfway there! Don't give up!" 
                : overallProgress < 100 
                ? "Almost done! You've got this!" 
                : "Congratulations! You've completed the learning path!"
              }
            </span>
          </div>
        </div>
      )}
    </div>
  );
}