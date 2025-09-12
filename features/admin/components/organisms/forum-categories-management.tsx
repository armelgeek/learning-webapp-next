'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2, MoreHorizontal, MessageSquare } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AdminDataTable } from '../molecules/admin-data-table';
import { ForumCategoryFormDialog } from '../molecules/forum-category-form-dialog';

// Mock data for demo
const mockCategories = [
  {
    id: '1',
    name: 'General Discussion',
    description: 'General topics about language learning',
    language: 'english',
    color: '#3B82F6',
    isActive: true,
    order: 1,
    topicsCount: 45,
    postsCount: 234,
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Spanish Help',
    description: 'Get help with Spanish language questions',
    language: 'spanish',
    color: '#EF4444',
    isActive: true,
    order: 2,
    topicsCount: 32,
    postsCount: 156,
    createdAt: '2024-01-10T09:00:00Z',
  },
  {
    id: '3',
    name: 'French Grammar',
    description: 'Discuss French grammar rules and exceptions',
    language: 'french',
    color: '#8B5CF6',
    isActive: true,
    order: 3,
    topicsCount: 28,
    postsCount: 178,
    createdAt: '2024-01-05T08:00:00Z',
  },
  {
    id: '4',
    name: 'Off Topic',
    description: 'Non-language related discussions',
    language: null,
    color: '#6B7280',
    isActive: false,
    order: 4,
    topicsCount: 12,
    postsCount: 67,
    createdAt: '2024-01-01T08:00:00Z',
  },
];

type ForumCategory = typeof mockCategories[0];

export function ForumCategoriesManagement() {
  const [categories, setCategories] = useState<ForumCategory[]>(mockCategories);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ForumCategory | null>(null);

  const handleAdd = () => {
    setEditingCategory(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (category: ForumCategory) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleDelete = (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category? All topics and posts will be lost.')) {
      setCategories(categories.filter(c => c.id !== categoryId));
    }
  };

  const handleSave = (categoryData: any) => {
    if (editingCategory) {
      // Update existing category
      setCategories(categories.map(c => 
        c.id === editingCategory.id 
          ? { ...c, ...categoryData }
          : c
      ));
    } else {
      // Add new category
      const newCategory = {
        ...categoryData,
        id: Date.now().toString(),
        topicsCount: 0,
        postsCount: 0,
        createdAt: new Date().toISOString(),
      };
      setCategories([...categories, newCategory]);
    }
    setIsDialogOpen(false);
    setEditingCategory(null);
  };

  const columns: ColumnDef<ForumCategory>[] = [
    {
      accessorKey: 'name',
      header: 'Category',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div 
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: row.original.color }}
          />
          <div>
            <div className="font-medium">{row.getValue('name')}</div>
            <div className="text-sm text-muted-foreground line-clamp-2">
              {row.original.description}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'language',
      header: 'Language',
      cell: ({ row }) => {
        const language = row.getValue('language') as string;
        return language ? (
          <Badge variant="outline" className="capitalize">
            {language}
          </Badge>
        ) : (
          <span className="text-muted-foreground">All</span>
        );
      },
    },
    {
      accessorKey: 'topicsCount',
      header: 'Topics',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          <span>{row.getValue('topicsCount')}</span>
        </div>
      ),
    },
    {
      accessorKey: 'postsCount',
      header: 'Posts',
      cell: ({ row }) => (
        <span className="text-center">{row.getValue('postsCount')}</span>
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
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.getValue('isActive') ? 'default' : 'secondary'}>
          {row.getValue('isActive') ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => {
        const date = new Date(row.getValue('createdAt'));
        return <span className="text-sm">{date.toLocaleDateString()}</span>;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const category = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => console.log('View category:', category.id)}>
                <Eye className="mr-2 h-4 w-4" />
                View Topics
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(category)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleDelete(category.id)}
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
        title="Forum Categories"
        description="Organize forum discussions by topic and language"
        data={categories}
        columns={columns}
        onAdd={handleAdd}
        searchColumn="name"
      />
      
      <ForumCategoryFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        category={editingCategory}
        onSave={handleSave}
      />
    </>
  );
}