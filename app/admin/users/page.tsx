"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminUsersCrud from "@/features/admin-users/AdminUsersCrud";

export default function AdminUsersPage() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin Users Management</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminUsersCrud />
        </CardContent>
      </Card>
    </div>
  );
}
