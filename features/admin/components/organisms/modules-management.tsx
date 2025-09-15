'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2, MoreHorizontal, BookOpen, Link, Plus, HelpCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AdminDataTable } from '../molecules/admin-data-table';
import { ModuleFormDialog } from '../molecules/module-form-dialog';
import { LessonAssignmentDialog } from '../molecules/lesson-assignment-dialog';
import { LessonFormDialog } from '../molecules/lesson-form-dialog';
import { QuizAssignmentDialog } from '../molecules/quiz-assignment-dialog';
import { ModulePrerequisiteDialog } from '../molecules/module-prerequisite-dialog';
import { useAdminModules, useDeleteModule, useCreateModule, useUpdateModule } from '../../hooks/use-admin-modules';
import { useCreateLesson } from '../../hooks/use-admin-lessons';
import { toast } from 'sonner';

type Module = {
  id: string;
  title: string;
  description: string;
  language: string;
  difficultyLevel: string;
  imageUrl: string;
  estimatedDuration: number;
  isActive: boolean;
  order: number;
  lessonsCount: number;
  createdAt: string;
  updatedAt: string;
};

export function ModulesManagement() {
  const { data: modules = [], isLoading, error } = useAdminModules();
  const deleteModule = useDeleteModule();
  const createModule = useCreateModule();
  const updateModule = useUpdateModule();
  const createLesson = useCreateLesson();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [lessonAssignmentOpen, setLessonAssignmentOpen] = useState(false);
  const [quizAssignmentOpen, setQuizAssignmentOpen] = useState(false);
  const [prerequisiteDialogOpen, setPrerequisiteDialogOpen] = useState(false);
  const [lessonFormOpen, setLessonFormOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  const handleAdd = () => {
    setEditingModule(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (module: Module) => {
    setEditingModule(module);
    setIsDialogOpen(true);
  };

  const handleManageLessons = (module: Module) => {
    setSelectedModule(module);
    setLessonAssignmentOpen(true);
  };

  const handleManagePrerequisites = (module: Module) => {
    setSelectedModule(module);
    setPrerequisiteDialogOpen(true);
  };

  const handleManageQuizzes = (module: Module) => {
    setSelectedModule(module);
    setQuizAssignmentOpen(true);
  };

  const handleAddLesson = (module: Module) => {
    setSelectedModule(module);
    setLessonFormOpen(true);
  };

  const handleCreateLesson = async (lessonData: any) => {
    try {
      await createLesson.mutateAsync(lessonData);
      setLessonFormOpen(false);
      toast.success('Lesson created successfully');
    } catch (error) {
      toast.error('Failed to create lesson');
      console.error('Error creating lesson:', error);
    }
  };

  const handleDelete = async (moduleId: string) => {
    if (confirm('Are you sure you want to delete this module?')) {
      try {
        await deleteModule.mutateAsync(moduleId);
        toast.success('Module deleted successfully');
      } catch (error) {
        toast.error('Failed to delete module');
        console.error('Error deleting module:', error);
      }
    }
  };

  const handleSave = async (moduleData: any) => {
    try {
      if (editingModule) {
        // Update existing module
        await updateModule.mutateAsync({ id: editingModule.id, ...moduleData });
        toast.success('Module updated successfully');
      } else {
        // Create new module
        await createModule.mutateAsync(moduleData);
        toast.success('Module created successfully');
      }
      setIsDialogOpen(false);
      setEditingModule(null);
    } catch (error) {
      toast.error(editingModule ? 'Failed to update module' : 'Failed to create module');
      console.error('Error saving module:', error);
    }
  };

  const columns: ColumnDef<Module>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.getValue('title')}</span>
          <span className="text-sm text-muted-foreground line-clamp-2">
            {row.original.description}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'language',
      header: 'Language',
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.getValue('language')}
        </Badge>
      ),
    },
    {
      accessorKey: 'difficultyLevel',
      header: 'Difficulty',
      cell: ({ row }) => {
        const level = row.getValue('difficultyLevel') as string;
        const variant = level === 'beginner' ? 'default' : 
                      level === 'intermediate' ? 'secondary' : 'destructive';
        return (
          <Badge variant={variant} className="capitalize">
            {level}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'lessonsCount',
      header: 'Lessons',
      cell: ({ row }) => (
        <span className="text-center">{row.getValue('lessonsCount')}</span>
      ),
    },
    {
      accessorKey: 'estimatedDuration',
      header: 'Duration',
      cell: ({ row }) => {
        const duration = row.getValue('estimatedDuration') as number;
        return <span>{duration} min</span>;
      },
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.getValue('isActive') ? 'default' : 'secondary'}>
          {row.getValue('isActive') ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      accessorKey: 'order',
      header: 'Order',
      cell: ({ row }) => (
        <span className="text-center">{row.getValue('order')}</span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const module = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddLesson(module)}
              className="h-8 px-2 text-xs"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Lesson
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => console.log('View module:', module.id)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleManageLessons(module)}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Manage Lessons
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleManageQuizzes(module)}>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Manage Quizzes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleManagePrerequisites(module)}>
                  <Link className="mr-2 h-4 w-4" />
                  Prerequisites
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEdit(module)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => handleDelete(module.id)}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive mb-2">Failed to load modules</p>
          <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AdminDataTable
        title="Learning Modules"
        description="Manage all learning modules in the platform"
        data={modules}
        columns={columns}
        onAdd={handleAdd}
        searchColumn="title"
        isLoading={isLoading}
      />
      
      <ModuleFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        module={editingModule}
        onSave={handleSave}
      />

      {selectedModule && (
        <>
          <LessonAssignmentDialog
            moduleId={selectedModule.id}
            moduleName={selectedModule.title}
            open={lessonAssignmentOpen}
            onOpenChange={setLessonAssignmentOpen}
          />

          <ModulePrerequisiteDialog
            moduleId={selectedModule.id}
            moduleName={selectedModule.title}
            open={prerequisiteDialogOpen}
            onOpenChange={setPrerequisiteDialogOpen}
          />

          <QuizAssignmentDialog
            moduleId={selectedModule.id}
            moduleName={selectedModule.title}
            open={quizAssignmentOpen}
            onOpenChange={setQuizAssignmentOpen}
          />

          <LessonFormDialog
            open={lessonFormOpen}
            onOpenChange={setLessonFormOpen}
            lesson={null}
            onSave={handleCreateLesson}
            defaultModuleId={selectedModule.id}
          />
        </>
      )}
    </>
  );
}