import { Metadata } from "next";
import { UserStatsManagement } from "@/features/admin/components/organisms/user-stats-management";

export const metadata: Metadata = {
  title: "User Statistics Management",
  description: "View and manage user statistics",
};

export default function UserStatsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">User Statistics Management</h1>
        <p className="text-muted-foreground">
          View and manage global user statistics and performance metrics
        </p>
      </div>
      <UserStatsManagement />
    </div>
  );
}