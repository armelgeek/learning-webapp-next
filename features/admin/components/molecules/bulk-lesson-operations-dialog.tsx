'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Trash2, Edit, Eye, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface Lesson {
  id: string;
  title: string;
  type: string;
  difficultyLevel: string;
  language: string;
  isActive: boolean;
  estimatedDuration: number;
}

interface BulkLessonOperationsProps {
  lessons: Lesson[];
  selectedLessonIds: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type BulkOperation = 'delete' | 'activate' | 'deactivate' | 'change-difficulty' | 'change-language' | 'duplicate';

export function BulkLessonOperationsDialog({ 
  lessons,
  selectedLessonIds,
  onSelectionChange,
  open, 
  onOpenChange 
}: BulkLessonOperationsProps) {
  const queryClient = useQueryClient();
  const [operation, setOperation] = useState<BulkOperation>('activate');
  const [newDifficulty, setNewDifficulty] = useState<string>('');
  const [newLanguage, setNewLanguage] = useState<string>('');

  const selectedLessons = lessons.filter(lesson => selectedLessonIds.includes(lesson.id));

  // Bulk operations mutation
  const bulkOperationMutation = useMutation({
    mutationFn: async (operationData: any) => {
      // For now, we'll handle operations one by one
      // In a real app, you'd want a proper bulk API endpoint
      const promises = selectedLessonIds.map(async lessonId => {
        switch (operation) {
          case 'delete':
            return axios.delete(`/api/lessons/${lessonId}`);
          
          case 'activate':
          case 'deactivate':
            return axios.put(`/api/lessons/${lessonId}`, {
              isActive: operation === 'activate'
            });
          
          case 'change-difficulty':
            return axios.put(`/api/lessons/${lessonId}`, {
              difficultyLevel: newDifficulty
            });
          
          case 'change-language':
            return axios.put(`/api/lessons/${lessonId}`, {
              language: newLanguage
            });
          
          case 'duplicate':
            const lesson = lessons.find(l => l.id === lessonId);
            if (lesson) {
              return axios.post('/api/lessons', {
                ...lesson,
                title: `${lesson.title} (Copy)`,
                id: undefined // Let the server generate a new ID
              });
            }
            break;
        }
      });

      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-lessons'] });
      const operationNames = {
        delete: 'deleted',
        activate: 'activated',
        deactivate: 'deactivated',
        'change-difficulty': 'updated',
        'change-language': 'updated',
        duplicate: 'duplicated'
      };
      toast.success(`${selectedLessonIds.length} lessons ${operationNames[operation]} successfully`);
      onSelectionChange([]);
      onOpenChange(false);
    },
    onError: () => {
      toast.error(`Failed to ${operation} lessons`);
    },
  });

  const handleExecute = () => {
    if (selectedLessonIds.length === 0) return;

    // Validation
    if ((operation === 'change-difficulty' && !newDifficulty) ||
        (operation === 'change-language' && !newLanguage)) {
      toast.error('Please select a value for the operation');
      return;
    }

    if (operation === 'delete') {
      const confirmed = confirm(
        `Are you sure you want to delete ${selectedLessonIds.length} lessons? This action cannot be undone.`
      );
      if (!confirmed) return;
    }

    bulkOperationMutation.mutate({});
  };

  const operationRequiresValue = operation === 'change-difficulty' || operation === 'change-language';
  const isExecuteDisabled = bulkOperationMutation.isPending || 
                           selectedLessonIds.length === 0 ||
                           (operationRequiresValue && 
                            ((operation === 'change-difficulty' && !newDifficulty) ||
                             (operation === 'change-language' && !newLanguage)));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Bulk Operations</DialogTitle>
          <DialogDescription>
            Perform operations on {selectedLessonIds.length} selected lessons
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Selected Lessons Preview */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Selected Lessons ({selectedLessonIds.length})
            </Label>
            <div className="max-h-40 overflow-y-auto border rounded-lg p-3 space-y-2">
              {selectedLessons.map((lesson) => (
                <div key={lesson.id} className="flex items-center gap-2 text-sm">
                  <div className="flex-1 truncate">{lesson.title}</div>
                  <Badge variant="outline" className="text-xs">
                    {lesson.type}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {lesson.difficultyLevel}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Operation Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Operation</Label>
            <Select value={operation} onValueChange={(value) => setOperation(value as BulkOperation)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activate">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Activate Lessons
                  </div>
                </SelectItem>
                <SelectItem value="deactivate">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 opacity-50" />
                    Deactivate Lessons
                  </div>
                </SelectItem>
                <SelectItem value="change-difficulty">
                  <div className="flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Change Difficulty Level
                  </div>
                </SelectItem>
                <SelectItem value="change-language">
                  <div className="flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Change Language
                  </div>
                </SelectItem>
                <SelectItem value="duplicate">
                  <div className="flex items-center gap-2">
                    <Copy className="h-4 w-4" />
                    Duplicate Lessons
                  </div>
                </SelectItem>
                <SelectItem value="delete">
                  <div className="flex items-center gap-2 text-destructive">
                    <Trash2 className="h-4 w-4" />
                    Delete Lessons
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Additional Options */}
          {operation === 'change-difficulty' && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">New Difficulty Level</Label>
              <Select value={newDifficulty} onValueChange={setNewDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {operation === 'change-language' && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">New Language</Label>
              <Select value={newLanguage} onValueChange={setNewLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spanish">Spanish</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                  <SelectItem value="german">German</SelectItem>
                  <SelectItem value="italian">Italian</SelectItem>
                  <SelectItem value="portuguese">Portuguese</SelectItem>
                  <SelectItem value="japanese">Japanese</SelectItem>
                  <SelectItem value="chinese">Chinese</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Warning for destructive operations */}
          {operation === 'delete' && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Trash2 className="h-4 w-4 text-red-600 mt-0.5" />
                <div className="text-sm text-red-800">
                  <strong>Warning:</strong> This operation will permanently delete {selectedLessonIds.length} lessons.
                  This action cannot be undone.
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleExecute}
            disabled={isExecuteDisabled}
            variant={operation === 'delete' ? 'destructive' : 'default'}
          >
            {bulkOperationMutation.isPending ? 'Processing...' : 'Execute Operation'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}