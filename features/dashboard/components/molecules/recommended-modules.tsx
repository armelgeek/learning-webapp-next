'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';

interface RecommendedModule {
  id: string;
  title: string;
  description: string;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number | null;
  imageUrl: string | null;
}

interface RecommendedModulesProps {
  modules: RecommendedModule[];
  targetLanguage: string;
}

export function RecommendedModules({ modules, targetLanguage }: RecommendedModulesProps) {
  if (modules.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Recommended for You
          </CardTitle>
          <CardDescription>
            No recommendations available right now.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/lessons">
              <BookOpen className="h-4 w-4 mr-2" />
              Browse All Lessons
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-700';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700';
      case 'advanced':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Recommended for You
        </CardTitle>
        <CardDescription>
          Perfect {targetLanguage} modules based on your progress
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {modules.map((module) => (
          <div key={module.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1">
                <h4 className="font-medium">{module.title}</h4>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {module.description}
                </p>
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
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge 
                  variant="secondary" 
                  className={getDifficultyColor(module.difficultyLevel)}
                >
                  {module.difficultyLevel}
                </Badge>
                {module.estimatedDuration && (
                  <span className="text-xs text-muted-foreground">
                    ~{module.estimatedDuration} min
                  </span>
                )}
              </div>
              
              <Button asChild size="sm">
                <Link href={`/lessons?module=${module.id}`}>
                  Start Module
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        ))}
        
        <div className="pt-2">
          <Button asChild variant="outline" className="w-full">
            <Link href="/lessons">
              Browse All Modules
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}