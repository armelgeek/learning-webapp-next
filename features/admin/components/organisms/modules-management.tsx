'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AdminDataTable } from '../molecules/admin-data-table';
import { ModuleFormDialog } from '../molecules/module-form-dialog';
import { useAdminModules, useDeleteModule } from '../../hooks/use-admin-modules';
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);

  const handleAdd = () => {
    setEditingModule(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (module: Module) => {
    setEditingModule(module);
    setIsDialogOpen(true);
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

  const handleSave = (moduleData: any) => {
    // TODO: Implement save logic with API
    console.log('Save module:', moduleData);
    setIsDialogOpen(false);
    setEditingModule(null);
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
    </>
  );
}