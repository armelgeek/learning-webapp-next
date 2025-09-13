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
import { useForumCategories, useDeleteForumCategory } from '../../hooks/use-forum-categories';
import { toast } from 'sonner';

type ForumCategory = {
  id: string;
  name: string;
  description: string;
  language: string | null;
  color: string;
  isActive: boolean;
  order: number;
  topicsCount: number;
  postsCount: number;
  createdAt: string;
};

export function ForumCategoriesManagement() {
  const { data: categories = [], isLoading, error } = useForumCategories();
  const deleteForumCategory = useDeleteForumCategory();
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

  const handleDelete = async (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category? All topics and posts will be lost.')) {
      try {
        await deleteForumCategory.mutateAsync(categoryId);
        toast.success('Forum category deleted successfully');
      } catch (error) {
        toast.error('Failed to delete forum category');
        console.error('Error deleting forum category:', error);
      }
    }
  };

  const handleSave = (categoryData: any) => {
    // TODO: Implement save logic with API
    console.log('Save forum category:', categoryData);
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

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive mb-2">Failed to load forum categories</p>
          <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AdminDataTable
        title="Forum Categories"
        description="Organize forum discussions by topic and language"
        data={categories}
        columns={columns}
        onAdd={handleAdd}
        searchColumn="name"
        isLoading={isLoading}
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