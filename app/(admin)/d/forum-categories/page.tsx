import { Metadata } from "next";
import { ForumCategoriesManagement } from "@/features/admin/components/organisms/forum-categories-management";

export const metadata: Metadata = {
  title: "Forum Categories Management",
  description: "Manage forum categories",
};

export default function ForumCategoriesPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Forum Categories Management</h1>
        <p className="text-muted-foreground">
          Organize forum discussions by creating and managing categories
        </p>
      </div>
      <ForumCategoriesManagement />
    </div>
  );
}