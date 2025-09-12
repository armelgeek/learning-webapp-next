'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Play } from 'lucide-react';
import Link from 'next/link';

interface Module {
  moduleId: string;
  moduleTitle: string;
  moduleDescription: string;
  totalLessons: number;
  completedLessons: number;
}

interface ModulesInProgressProps {
  modules: Module[];
}

export function ModulesInProgress({ modules }: ModulesInProgressProps) {
  if (modules.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Modules in Progress
          </CardTitle>
          <CardDescription>
            You haven&apos;t started any modules yet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/lessons">
              <Play className="h-4 w-4 mr-2" />
              Start Learning
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Modules in Progress
        </CardTitle>
        <CardDescription>
          Continue where you left off
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {modules.map((module) => {
          const progressPercentage = module.totalLessons > 0 
            ? (module.completedLessons / module.totalLessons) * 100 
            : 0;

          return (
            <div key={module.moduleId} className="space-y-2 p-3 border rounded-lg">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{module.moduleTitle}</h4>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/lessons?module=${module.moduleId}`}>
                    Continue
                  </Link>
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-2">
                {module.moduleDescription}
              </p>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span>
                    {module.completedLessons} / {module.totalLessons} lessons
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-1.5" />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}