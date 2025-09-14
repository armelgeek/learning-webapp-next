'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { X, Plus, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface Module {
  id: string;
  title: string;
  language: string;
  difficultyLevel: string;
  order: number;
}

interface ModulePrerequisiteProps {
  moduleId: string;
  moduleName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ModulePrerequisiteDialog({ 
  moduleId, 
  moduleName, 
  open, 
  onOpenChange 
}: ModulePrerequisiteProps) {
  const queryClient = useQueryClient();
  const [selectedPrerequisiteId, setSelectedPrerequisiteId] = useState<string>('');

  // Fetch module details with prerequisites
  const { data: moduleData, isLoading } = useQuery({
    queryKey: ['module-prerequisites', moduleId],
    queryFn: async () => {
      const response = await axios.get(`/api/modules/${moduleId}`);
      return response.data.data;
    },
    enabled: open && !!moduleId,
  });

  // Fetch all modules for prerequisite selection
  const { data: allModules } = useQuery({
    queryKey: ['admin-modules-for-prerequisites'],
    queryFn: async () => {
      const response = await axios.get('/api/v1/admin/modules');
      return response.data;
    },
    enabled: open,
  });

  // Update module prerequisites mutation
  const updatePrerequisitesMutation = useMutation({
    mutationFn: async (prerequisites: string[]) => {
      const response = await axios.put(`/api/modules/${moduleId}`, {
        prerequisites,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['module-prerequisites', moduleId] });
      queryClient.invalidateQueries({ queryKey: ['admin-modules'] });
      toast.success('Prerequisites updated successfully');
    },
    onError: () => {
      toast.error('Failed to update prerequisites');
    },
  });

  const currentPrerequisites: string[] = moduleData?.prerequisites || [];
  const availableModules: Module[] = (allModules || [])
    .filter((module: Module) => 
      module.id !== moduleId && 
      !currentPrerequisites.includes(module.id)
    )
    .sort((a: Module, b: Module) => a.order - b.order);

  const prerequisiteModules: Module[] = (allModules || [])
    .filter((module: Module) => currentPrerequisites.includes(module.id))
    .sort((a: Module, b: Module) => a.order - b.order);

  const handleAddPrerequisite = () => {
    if (!selectedPrerequisiteId) return;
    
    const newPrerequisites = [...currentPrerequisites, selectedPrerequisiteId];
    updatePrerequisitesMutation.mutate(newPrerequisites);
    setSelectedPrerequisiteId('');
  };

  const handleRemovePrerequisite = (prerequisiteId: string) => {
    const newPrerequisites = currentPrerequisites.filter(id => id !== prerequisiteId);
    updatePrerequisitesMutation.mutate(newPrerequisites);
  };

  // Check for circular dependencies
  const wouldCreateCircularDependency = (prerequisiteId: string): boolean => {
    // TODO: Implement proper circular dependency check
    // For now, just prevent adding modules with higher order
    const prerequisiteModule = allModules?.find((m: Module) => m.id === prerequisiteId);
    return prerequisiteModule && moduleData && prerequisiteModule.order >= moduleData.order;
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
              <p>Loading prerequisites...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Prerequisites - {moduleName}</DialogTitle>
          <DialogDescription>
            Configure which modules must be completed before this module becomes available.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Prerequisites */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">
                Required Prerequisites ({currentPrerequisites.length})
              </h3>
            </div>
            
            {currentPrerequisites.length === 0 ? (
              <div className="text-center text-gray-500 py-6 border-2 border-dashed border-gray-200 rounded-lg">
                No prerequisites required - this module is available immediately
              </div>
            ) : (
              <div className="space-y-2">
                {prerequisiteModules.map((module) => (
                  <div
                    key={module.id}
                    className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm">{module.title}</div>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {module.language}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {module.difficultyLevel}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          Order: {module.order}
                        </span>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemovePrerequisite(module.id)}
                      disabled={updatePrerequisitesMutation.isPending}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add New Prerequisite */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Add Prerequisite</h3>
            
            <div className="flex gap-2">
              <Select value={selectedPrerequisiteId} onValueChange={setSelectedPrerequisiteId}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a module as prerequisite" />
                </SelectTrigger>
                <SelectContent>
                  {availableModules.map((module) => {
                    const wouldCauseCircular = wouldCreateCircularDependency(module.id);
                    return (
                      <SelectItem 
                        key={module.id} 
                        value={module.id}
                        disabled={wouldCauseCircular}
                      >
                        <div className="flex items-center gap-2">
                          <span className={wouldCauseCircular ? 'text-gray-400' : ''}>
                            {module.title}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            Order: {module.order}
                          </Badge>
                          {wouldCauseCircular && (
                            <AlertTriangle className="h-3 w-3 text-yellow-500" />
                          )}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <Button
                onClick={handleAddPrerequisite}
                disabled={!selectedPrerequisiteId || updatePrerequisitesMutation.isPending}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>

            {selectedPrerequisiteId && wouldCreateCircularDependency(selectedPrerequisiteId) && (
              <div className="flex items-center gap-2 p-2 text-sm text-yellow-800 bg-yellow-50 border border-yellow-200 rounded">
                <AlertTriangle className="h-4 w-4" />
                This prerequisite might create ordering issues. Consider adjusting module order.
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="p-4 bg-gray-50 border rounded-lg">
            <h4 className="text-sm font-medium mb-2">How Prerequisites Work</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Users must complete all prerequisite modules before accessing this module</li>
              <li>• Prerequisites are checked in real-time as users progress</li>
              <li>• Modules are automatically unlocked when prerequisites are met</li>
              <li>• Consider module order when setting prerequisites</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}