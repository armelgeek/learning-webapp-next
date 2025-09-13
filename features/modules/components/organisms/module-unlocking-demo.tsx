'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Lock, PlayCircle } from 'lucide-react';

interface MockModule {
  id: string;
  title: string;
  status: 'locked' | 'unlocked' | 'completed';
  prerequisites: string[];
  order: number;
}

const initialMockModules: MockModule[] = [
  {
    id: 'module-1',
    title: 'Alphabet & Pronunciation',
    status: 'unlocked',
    prerequisites: [],
    order: 1,
  },
  {
    id: 'module-2', 
    title: 'Basic Grammar',
    status: 'locked',
    prerequisites: ['module-1'],
    order: 2,
  },
  {
    id: 'module-3',
    title: 'Sentence Construction', 
    status: 'locked',
    prerequisites: ['module-2'],
    order: 3,
  },
  {
    id: 'module-4',
    title: 'Simple Conversations',
    status: 'locked', 
    prerequisites: ['module-3'],
    order: 4,
  },
  {
    id: 'module-5',
    title: 'Vocabulary Building',
    status: 'locked',
    prerequisites: ['module-2'], // Alternative path
    order: 5,
  },
  {
    id: 'module-6',
    title: 'Advanced Conversations',
    status: 'locked',
    prerequisites: ['module-4', 'module-5'], // Requires both paths
    order: 6,
  },
];

export function ModuleUnlockingDemo() {
  const [modules, setModules] = useState<MockModule[]>(initialMockModules);

  const completeModule = (moduleId: string) => {
    setModules(prevModules => {
      const updatedModules = prevModules.map(module => 
        module.id === moduleId 
          ? { ...module, status: 'completed' as const }
          : module
      );

      // Check and unlock dependent modules
      return updatedModules.map(module => {
        if (module.status === 'locked') {
          const prerequisitesMet = module.prerequisites.every(prereqId =>
            updatedModules.find(m => m.id === prereqId)?.status === 'completed'
          );
          
          if (prerequisitesMet) {
            return { ...module, status: 'unlocked' as const };
          }
        }
        return module;
      });
    });
  };

  const resetModules = () => {
    setModules(initialMockModules);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'unlocked':
        return <PlayCircle className="h-5 w-5 text-blue-600" />;
      case 'locked':
        return <Lock className="h-5 w-5 text-gray-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'unlocked':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'locked':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>🧪 Module Unlocking Demo</CardTitle>
        <CardDescription>
          Test the progressive module unlocking system. Complete modules to unlock dependent ones.
        </CardDescription>
        <Button onClick={resetModules} variant="outline" className="w-fit">
          Reset Demo
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {modules.map((module) => (
          <div
            key={module.id}
            className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
              module.status === 'completed' 
                ? 'bg-green-50 border-green-200' 
                : module.status === 'unlocked'
                ? 'bg-blue-50 border-blue-200'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              {getStatusIcon(module.status)}
              <div>
                <h3 className="font-medium">{module.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Prerequisites: {module.prerequisites.length > 0 
                    ? module.prerequisites.map(id => 
                        modules.find(m => m.id === id)?.title
                      ).join(', ')
                    : 'None'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className={`capitalize ${getStatusColor(module.status)}`}
              >
                {module.status}
              </Badge>
              
              {module.status === 'unlocked' && (
                <Button
                  size="sm"
                  onClick={() => completeModule(module.id)}
                >
                  Complete Module
                </Button>
              )}
            </div>
          </div>
        ))}
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Progress Summary</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-green-600 font-medium">
                {modules.filter(m => m.status === 'completed').length}
              </span>
              <span className="text-muted-foreground"> Completed</span>
            </div>
            <div>
              <span className="text-blue-600 font-medium">
                {modules.filter(m => m.status === 'unlocked').length}
              </span>
              <span className="text-muted-foreground"> Unlocked</span>
            </div>
            <div>
              <span className="text-gray-600 font-medium">
                {modules.filter(m => m.status === 'locked').length}
              </span>
              <span className="text-muted-foreground"> Locked</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}