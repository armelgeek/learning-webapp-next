import { Metadata } from "next";
import { AchievementsManagement } from "@/features/admin/components/organisms/achievements-management";

export const metadata: Metadata = {
  title: "Achievements Management",
  description: "Manage badges and rewards",
};

export default function AchievementsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Achievements Management</h1>
        <p className="text-muted-foreground">
          Create and manage badges, rewards, and achievements for users
        </p>
      </div>
      <AchievementsManagement />
    </div>
  );
}