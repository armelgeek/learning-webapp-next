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

// Mock data for demo - in real app, this would come from API
const mockModules = [
  {
    id: '1',
    title: 'Spanish Basics',
    description: 'Learn fundamental Spanish vocabulary and grammar',
    language: 'spanish',
    difficultyLevel: 'beginner',
    imageUrl: '',
    estimatedDuration: 120,
    isActive: true,
    order: 1,
    lessonsCount: 15,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
  },
  {
    id: '2',
    title: 'French Conversation',
    description: 'Practice conversational French with real-world scenarios',
    language: 'french',
    difficultyLevel: 'intermediate',
    imageUrl: '',
    estimatedDuration: 180,
    isActive: true,
    order: 2,
    lessonsCount: 20,
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-18T14:20:00Z',
  },
  {
    id: '3',
    title: 'Advanced German Grammar',
    description: 'Master complex German grammar structures',
    language: 'german',
    difficultyLevel: 'advanced',
    imageUrl: '',
    estimatedDuration: 240,
    isActive: false,
    order: 3,
    lessonsCount: 25,
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-01-12T11:15:00Z',
  },
];

type Module = typeof mockModules[0];

export function ModulesManagement() {
  const [modules, setModules] = useState<Module[]>(mockModules);
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

  const handleDelete = (moduleId: string) => {
    if (confirm('Are you sure you want to delete this module?')) {
      setModules(modules.filter(m => m.id !== moduleId));
    }
  };

  const handleSave = (moduleData: any) => {
    if (editingModule) {
      // Update existing module
      setModules(modules.map(m => 
        m.id === editingModule.id 
          ? { ...m, ...moduleData, updatedAt: new Date().toISOString() }
          : m
      ));
    } else {
      // Add new module
      const newModule = {
        ...moduleData,
        id: Date.now().toString(),
        lessonsCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setModules([...modules, newModule]);
    }
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

  return (
    <>
      <AdminDataTable
        title="Learning Modules"
        description="Manage all learning modules in the platform"
        data={modules}
        columns={columns}
        onAdd={handleAdd}
        searchColumn="title"
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