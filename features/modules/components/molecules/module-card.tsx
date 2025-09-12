'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Lock, CheckCircle, PlayCircle, BookOpen, Clock } from 'lucide-react';
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
    if (module.completionPercentage === 100) {
      return <CheckCircle className="h-6 w-6 text-green-600" />;
    }
    if (!module.isUnlocked) {
      return <Lock className="h-6 w-6 text-gray-400" />;
    }
    if (module.completionPercentage > 0) {
      return <PlayCircle className="h-6 w-6 text-blue-600" />;
    }
    return <BookOpen className="h-6 w-6 text-gray-600" />;
  };

  const getStatusText = () => {
    if (module.completionPercentage === 100) {
      return 'Completed';
    }
    if (!module.isUnlocked) {
      return 'Locked';
    }
    if (module.completionPercentage > 0) {
      return 'In Progress';
    }
    return 'Ready to Start';
  };

  const getButtonText = () => {
    if (module.completionPercentage === 100) {
      return 'Review Module';
    }
    if (!module.isUnlocked) {
      return 'Complete Previous Module';
    }
    if (module.completionPercentage > 0) {
      return 'Continue Module';
    }
    return 'Start Module';
  };

  return (
    <Card 
      className={`transition-all duration-200 hover:shadow-lg ${
        module.isUnlocked ? 'hover:scale-105' : 'opacity-60'
      } ${
        module.completionPercentage === 100 
          ? 'ring-2 ring-green-200 bg-green-50/50' 
          : module.completionPercentage > 0 
          ? 'ring-2 ring-blue-200 bg-blue-50/50'
          : ''
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {getModuleIcon()}
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

        {/* Action Button */}
        <Button 
          className="w-full" 
          variant={module.completionPercentage === 100 ? "outline" : "default"}
          disabled={!module.isUnlocked}
          onClick={() => module.isUnlocked && onStartModule(module.id)}
        >
          {getButtonText()}
        </Button>
      </CardContent>
    </Card>
  );
}