import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BookOpen, CheckCircle, Clock } from 'lucide-react';

interface LessonCardProps {
  lesson: {
    id: string;
    title: string;
    type: string;
    difficultyLevel: string;
    language: string;
  };
  progress?: {
    completed: boolean;
    score: number;
  } | null;
  onClick?: () => void;
}

export function LessonCard({ lesson, progress, onClick }: LessonCardProps) {
  const isCompleted = progress?.completed ?? false;
  const score = progress?.score ?? 0;

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

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105 ${
        isCompleted ? 'ring-2 ring-green-200 bg-green-50/50' : ''
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getTypeIcon(lesson.type)}
            <div>
              <CardTitle className="text-lg">{lesson.title}</CardTitle>
              <CardDescription className="capitalize">{lesson.language} • {lesson.type}</CardDescription>
            </div>
          </div>
          {isCompleted && (
            <CheckCircle className="h-6 w-6 text-green-600" />
          )}
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
            {isCompleted && (
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
          
          {!isCompleted && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Not started</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}