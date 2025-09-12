import { Metadata } from "next";
import { DailyChallengesManagement } from "@/features/admin/components/organisms/daily-challenges-management";

export const metadata: Metadata = {
  title: "Daily Challenges Management",
  description: "Manage daily challenges for users",
};

export default function DailyChallengesPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Daily Challenges Management</h1>
        <p className="text-muted-foreground">
          Create and manage daily challenges to engage users
        </p>
      </div>
      <DailyChallengesManagement />
    </div>
  );
}