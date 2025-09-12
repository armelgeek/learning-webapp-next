import { Metadata } from "next";
import { UserProgressManagement } from "@/features/admin/components/organisms/user-progress-management";

export const metadata: Metadata = {
  title: "User Progress Management",
  description: "Track and manage user learning progress",
};

export default function UserProgressPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">User Progress Management</h1>
        <p className="text-muted-foreground">
          Monitor and manage user learning progress across all lessons
        </p>
      </div>
      <UserProgressManagement />
    </div>
  );
}