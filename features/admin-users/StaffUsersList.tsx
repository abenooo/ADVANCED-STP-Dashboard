'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, UserPlus, Pencil, Trash2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { UserForm, type UserFormData } from './UserForm';
import { toast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface StaffUser {
  _id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function StaffUsersList() {
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<StaffUser | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchStaffUsers();
  }, []);

  const fetchStaffUsers = async () => {
    try {
      const response = await fetch('/api/user');
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch staff users');
      }
      
      setUsers(result.data || []);
    } catch (err) {
      console.error('Error fetching staff users:', err);
      setError('Failed to load staff users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading staff users...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleEditUser = (user: StaffUser) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (user: StaffUser) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/user/${selectedUser._id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete user');
      }
      
      toast({
        title: 'Success',
        description: 'User deleted successfully',
      });
      
      fetchStaffUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete user',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const handleSubmit = async (data: UserFormData) => {
    try {
      setIsSubmitting(true);
      const isEdit = !!selectedUser;
      const url = isEdit ? `/api/user/${selectedUser._id}` : '/api/user';
      const method = isEdit ? 'PUT' : 'POST';
      
      // Prepare the payload based on whether it's an edit or create
      const payload: Partial<StaffUser> & { password?: string } = {
        name: data.name,
        email: data.email,
        role: data.role,
      };
      
      // Only include password for new users or when it's provided during edit
      if (!isEdit || data.password) {
        payload.password = data.password;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Failed to ${isEdit ? 'update' : 'create'} user`);
      }

      toast({
        title: 'Success',
        description: `User ${isEdit ? 'updated' : 'created'} successfully`,
      });

      setIsFormOpen(false);
      fetchStaffUsers();
    } catch (error) {
      console.error(`Error ${selectedUser ? 'updating' : 'creating'} user:`, error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : `Failed to ${selectedUser ? 'update' : 'create'} user`,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Staff Users</h1>
          <p className="text-muted-foreground">List of all staff members</p>
        </div>
        <Button onClick={handleAddUser}>
          <UserPlus className="mr-2 h-4 w-4" /> Add Staff
        </Button>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <User className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-medium">No staff users found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Get started by adding a new staff member.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <Card key={user._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {user.username}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Mail className="h-4 w-4" />
                      {user.email}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditUser(user);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(user);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Badge variant="outline" className="capitalize">
                      {user.role}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="text-sm text-muted-foreground">
                  <p>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
                  <p>Last updated: {new Date(user.updatedAt).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <UserForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmit}
        initialData={selectedUser || undefined}
        isSubmitting={isSubmitting}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {selectedUser?.name || 'this user'}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={isSubmitting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
