import { Metadata } from "next";
import { ModulesManagement } from "@/features/admin/components/organisms/modules-management";

export const metadata: Metadata = {
  title: "Modules Management",
  description: "Manage learning modules",
};

export default function ModulesPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Modules Management</h1>
        <p className="text-muted-foreground">
          Create, edit, and manage learning modules
        </p>
      </div>
      <ModulesManagement />
    </div>
  );
}