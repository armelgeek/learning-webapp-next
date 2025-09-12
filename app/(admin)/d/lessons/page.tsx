import { Metadata } from "next";
import { LessonsManagement } from "@/features/admin/components/organisms/lessons-management";

export const metadata: Metadata = {
  title: "Lessons Management",
  description: "Manage module lessons and content",
};

export default function LessonsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Lessons Management</h1>
        <p className="text-muted-foreground">
          Manage lessons content, videos, and documents for each module
        </p>
      </div>
      <LessonsManagement />
    </div>
  );
}