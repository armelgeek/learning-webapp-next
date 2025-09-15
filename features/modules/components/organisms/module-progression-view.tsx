'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Map, Trophy, Star } from 'lucide-react';
import { ModuleCard } from '../molecules/module-card';
import { useModules } from '../../hooks/use-modules';

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
        
        {/* Learning Path Instructions */}
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-2xl mx-auto">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
              <Map className="h-4 w-4" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                How Progressive Learning Works
              </h3>
              <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                <li>🔓 <strong>Unlocked modules</strong> are ready to start</li>
                <li>🔒 <strong>Locked modules</strong> need prerequisites completed first</li>
                <li>✅ <strong>Completed modules</strong> unlock new content</li>
                <li>📈 <strong>Progress tracking</strong> shows your learning journey</li>
              </ul>
            </div>
          </div>
        </div>
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
            <div key={module.id} className="relative group">
              {/* Connection Line for Desktop */}
              {index < modules.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-border to-border/50 z-0">
                  {/* Arrow indication */}
                  <div className="absolute right-0 top-1/2 w-0 h-0 border-l-4 border-l-border border-t-2 border-t-transparent border-b-2 border-b-transparent transform -translate-y-1/2" />
                </div>
              )}
              
              {/* Module Number Badge */}
              <div className={`absolute -top-3 -left-3 z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                module.status === 'completed'
                  ? 'bg-green-600 text-white border-green-500 shadow-lg shadow-green-500/25'
                  : module.status === 'unlocked'
                  ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/25'
                  : 'bg-gray-400 text-gray-200 border-gray-300'
              }`}>
                {module.status === 'completed' ? '✓' : index + 1}
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
          <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 px-6 py-3 rounded-full border border-green-200 dark:border-green-800">
            <Trophy className="h-5 w-5" />
            <span className="text-sm font-medium">
              {overallProgress < 25 
                ? `Great start! You've completed ${completedLessons} lessons. Keep the momentum going!` 
                : overallProgress < 50 
                ? `You're making excellent progress! ${completedModules} modules down, ${totalModules - completedModules} to go!` 
                : overallProgress < 75 
                ? `Halfway champion! You're mastering ${languageName} one step at a time!` 
                : overallProgress < 100 
                ? `Almost there! Just ${totalModules - completedModules} more modules to complete your journey!` 
                : `🎉 Congratulations! You've mastered the entire ${languageName} learning path!`
              }
            </span>
          </div>
        </div>
      )}
    </div>
  );
}