'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Lock, CheckCircle, PlayCircle, BookOpen, Clock, AlertCircle } from 'lucide-react';
import type { ModuleWithProgress } from '../../config/module.types';

interface ModuleCardProps {
  module: ModuleWithProgress;
  onStartModule: (moduleId: string) => void;
}

export function ModuleCard({ module, onStartModule }: ModuleCardProps) {
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

  const getModuleIcon = () => {
    if (module.status === 'completed') {
      return <CheckCircle className="h-6 w-6 text-green-600" />;
    }
    if (module.status === 'locked') {
      return <Lock className="h-6 w-6 text-gray-400" />;
    }
    if (module.completionPercentage > 0) {
      return <PlayCircle className="h-6 w-6 text-blue-600" />;
    }
    return <BookOpen className="h-6 w-6 text-gray-600" />;
  };

  const getStatusText = () => {
    if (module.status === 'completed') {
      return 'Completed';
    }
    if (module.status === 'locked') {
      return 'Locked';
    }
    if (module.completionPercentage > 0) {
      return 'In Progress';
    }
    return 'Ready to Start';
  };

  const getButtonText = () => {
    if (module.status === 'completed') {
      return 'Review Module';
    }
    if (module.status === 'locked') {
      return 'Complete Prerequisites';
    }
    if (module.completionPercentage > 0) {
      return 'Continue Module';
    }
    return 'Start Module';
  };

  const handleModuleClick = () => {
    if (module.isUnlocked) {
      onStartModule(module.id);
    } else {
      // Show informative message for locked modules
      const prerequisiteCount = module.prerequisites?.length || 0;
      const message = prerequisiteCount > 0 
        ? `🔒 Complete ${prerequisiteCount} prerequisite module${prerequisiteCount > 1 ? 's' : ''} before accessing "${module.title}". Keep learning to unlock new content!`
        : `🔒 Module "${module.title}" is currently locked. Continue your learning journey to unlock it!`;
      
      alert(message);
    }
  };

  return (
    <TooltipProvider>
      <Card 
        className={`transition-all duration-200 hover:shadow-lg ${
          module.isUnlocked ? 'hover:scale-105' : 'opacity-60'
        } ${
          module.status === 'completed'
            ? 'ring-2 ring-green-200 bg-green-50/50' 
            : module.completionPercentage > 0 
            ? 'ring-2 ring-blue-200 bg-blue-50/50'
            : ''
        }`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  {getModuleIcon()}
                </TooltipTrigger>
                <TooltipContent>
                  <p>{getStatusText()}</p>
                  {module.status === 'locked' && module.prerequisites && module.prerequisites.length > 0 && (
                    <p className="text-xs mt-1">
                      Complete prerequisite modules first
                    </p>
                  )}
                </TooltipContent>
              </Tooltip>
              <div className="flex-1">
                <CardTitle className="text-lg">{module.title}</CardTitle>
                <CardDescription className="mt-1">
                  {module.description}
                </CardDescription>
              </div>
            </div>
            {module.imageUrl && (
              <div className="ml-4 w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img 
                  src={module.imageUrl} 
                  alt={module.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Module Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {module.totalLessons} lessons
            </span>
            {module.estimatedDuration && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                ~{module.estimatedDuration} min
              </span>
            )}
          </div>
          <Badge 
            variant="outline" 
            className={`capitalize ${getDifficultyColor(module.difficultyLevel)}`}
          >
            {module.difficultyLevel}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {module.completedLessons}/{module.totalLessons} lessons
            </span>
          </div>
          <Progress 
            value={module.completionPercentage} 
            className="h-2"
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{getStatusText()}</span>
            <span>{module.completionPercentage}% complete</span>
          </div>
        </div>

        {/* Prerequisites Info */}
        {module.status === 'locked' && module.prerequisites && module.prerequisites.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-orange-50 dark:bg-orange-950 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
              <Lock className="h-3 w-3 text-orange-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-orange-800 dark:text-orange-200">
                  Module Locked
                </p>
                <p className="text-orange-700 dark:text-orange-300">
                  Complete {module.prerequisites.length} prerequisite module{module.prerequisites.length > 1 ? 's' : ''} to unlock this content
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Completion Achievement */}
        {module.status === 'completed' && (
          <div className="flex items-center gap-2 text-xs bg-green-50 dark:bg-green-950 p-3 rounded-lg border border-green-200 dark:border-green-800">
            <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-green-800 dark:text-green-200">
                Module Completed! 
              </p>
              <p className="text-green-700 dark:text-green-300">
                🎉 You've mastered all {module.totalLessons} lessons
              </p>
            </div>
          </div>
        )}

        {/* Action Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              className="w-full" 
              variant={module.status === 'completed' ? "outline" : "default"}
              disabled={!module.isUnlocked}
              onClick={handleModuleClick}
            >
              {getButtonText()}
            </Button>
          </TooltipTrigger>
          {module.status === 'locked' && (
            <TooltipContent>
              <p>Complete the prerequisite modules to unlock this content</p>
            </TooltipContent>
          )}
        </Tooltip>
      </CardContent>
    </Card>
    </TooltipProvider>
  );
}