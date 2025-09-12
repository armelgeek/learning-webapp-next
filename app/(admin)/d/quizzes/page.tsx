import { Metadata } from "next";
import { QuizzesManagement } from "@/features/admin/components/organisms/quizzes-management";

export const metadata: Metadata = {
  title: "Quizzes Management",
  description: "Manage quizzes and questions",
};

export default function QuizzesPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Quizzes Management</h1>
        <p className="text-muted-foreground">
          Create, edit, and manage quizzes and their questions
        </p>
      </div>
      <QuizzesManagement />
    </div>
  );
}