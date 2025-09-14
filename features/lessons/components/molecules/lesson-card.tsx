import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BookOpen, CheckCircle, Clock, Lock, AlertTriangle } from 'lucide-react';

interface LessonCardProps {
  lesson: {
    id: string;
    title: string;
    type: string;
    difficultyLevel: string;
    language: string;
    estimatedDuration?: number;
  };
  progress?: {
    completed: boolean;
    score?: number;
  } | null;
  isUnlocked?: boolean;
  unmetPrerequisites?: string[];
  prerequisiteDetails?: Array<{
    id: string;
    title: string;
    completed: boolean;
  }>;
  onClick?: () => void;
}

export function LessonCard({ 
  lesson, 
  progress, 
  isUnlocked = true, 
  unmetPrerequisites = [], 
  prerequisiteDetails = [],
  onClick 
}: LessonCardProps) {
  const isCompleted = progress?.completed ?? false;
  const score = progress?.score ?? 0;
  const hasUnmetPrerequisites = unmetPrerequisites.length > 0;

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
    return <BookOpen className="h-4 w-4" />;
  };

  const getStatusContent = () => {
    if (isCompleted) {
      return (
        <div className="flex items-center gap-1 text-sm text-green-600">
          <CheckCircle className="h-4 w-4" />
          <span>Completed</span>
        </div>
      );
    }

    if (!isUnlocked && hasUnmetPrerequisites) {
      return (
        <div className="flex items-center gap-1 text-sm text-orange-600">
          <Lock className="h-4 w-4" />
          <span>Locked</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span>
          {lesson.estimatedDuration ? `${lesson.estimatedDuration} min` : 'Not started'}
        </span>
      </div>
    );
  };

  const getCardClassName = () => {
    const baseClass = "cursor-pointer transition-all duration-200 hover:shadow-md";
    
    if (!isUnlocked) {
      return `${baseClass} opacity-60 border-orange-200 bg-orange-50/30`;
    }
    
    if (isCompleted) {
      return `${baseClass} hover:scale-105 ring-2 ring-green-200 bg-green-50/50`;
    }
    
    return `${baseClass} hover:scale-105`;
  };

  const handleClick = () => {
    if (isUnlocked && onClick) {
      onClick();
    }
  };

  const renderPrerequisiteTooltip = () => {
    if (!hasUnmetPrerequisites) return null;

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1">
              <p className="font-semibold">Complete these lessons first:</p>
              {prerequisiteDetails
                .filter(p => !p.completed)
                .map(prerequisite => (
                  <p key={prerequisite.id} className="text-sm">
                    • {prerequisite.title}
                  </p>
                ))}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <Card className={getCardClassName()} onClick={handleClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getTypeIcon(lesson.type)}
            <div>
              <CardTitle className="text-lg">{lesson.title}</CardTitle>
              <CardDescription className="capitalize">{lesson.language} • {lesson.type}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {hasUnmetPrerequisites && renderPrerequisiteTooltip()}
            {isCompleted && <CheckCircle className="h-6 w-6 text-green-600" />}
            {!isUnlocked && <Lock className="h-6 w-6 text-orange-600" />}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge 
              variant="outline" 
              className={`capitalize ${getDifficultyColor(lesson.difficultyLevel)}`}
            >
              {lesson.difficultyLevel}
            </Badge>
            {isCompleted && score !== undefined && (
              <div className="flex items-center gap-1 text-sm text-green-600">
                <span>Score: {score}%</span>
              </div>
            )}
          </div>
          
          {isCompleted && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-green-600 font-medium">Complete</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
          )}
          
          <div className="flex items-center justify-between">
            {getStatusContent()}
            {hasUnmetPrerequisites && (
              <Badge variant="outline" className="text-orange-600 border-orange-200">
                {unmetPrerequisites.length} prerequisite{unmetPrerequisites.length > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}