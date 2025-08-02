'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, UserPlus, Pencil, Trash2, Calendar, Clock } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { UserForm, type UserFormData } from './UserForm';
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { X } from 'lucide-react';

interface StaffUser {
  _id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'marketing';
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
      const response = await fetch('/api/admin-users');
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch staff users');
      }
      
      setUsers(result.data || result || []);
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
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin-users/${selectedUser._id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete user');
      }
      
      await fetchStaffUsers();
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (data: UserFormData) => {
    try {
      setIsSubmitting(true);
      const isEdit = !!selectedUser;
      const url = isEdit ? `/api/admin-users/${selectedUser._id}` : '/api/admin-users';
      const method = isEdit ? 'PUT' : 'POST';
      
      // Prepare the payload based on whether it's an edit or create
      const payload: Partial<StaffUser> & { password?: string } = {
        name: data.name,
        email: data.email,
        role: data.role as 'super_admin' | 'admin' | 'marketing',
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

      const result = await response.json();
      
      // Check if there's an email warning
      if (result.emailWarning) {
        alert(`⚠️ ${result.emailWarning}\n\nPlease manually share the login credentials with the user.`);
      } else {
        alert(`✅ User ${isEdit ? 'updated' : 'created'} successfully${!isEdit ? ' and welcome email sent!' : ''}`);
      }

      setIsFormOpen(false);
      await fetchStaffUsers();
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => {
            const getRoleBadgeVariant = (role: string) => {
              switch (role) {
                case 'super_admin': return 'destructive';
                case 'admin': return 'default';
                case 'marketing': return 'secondary';
                default: return 'outline';
              }
            };
            
            const getRoleDisplayName = (role: string) => {
              switch (role) {
                case 'super_admin': return 'Super Admin';
                case 'admin': return 'Admin';
                case 'marketing': return 'Marketing';
                default: return role;
              }
            };
            
            return (
              <Card key={user._id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary/20">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl flex items-center gap-2 mb-2">
                        <User className="h-5 w-5 text-primary" />
                        {user.name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4" />
                        {user.email}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 hover:bg-primary/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditUser(user);
                        }}
                        title="Edit user"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(user);
                        }}
                        title="Delete user"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Role Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Role:</span>
                    <Badge 
                      variant={getRoleBadgeVariant(user.role)} 
                      className="font-medium"
                    >
                      {getRoleDisplayName(user.role)}
                    </Badge>
                  </div>
                  
                  {/* User ID */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">User ID:</span>
                    <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                      {user._id.slice(-8)}
                    </code>
                  </div>
                  
                  {/* Timestamps */}
                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Created:
                      </span>
                      <span className="font-medium">
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Updated:
                      </span>
                      <span className="font-medium">
                        {new Date(user.updatedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <UserForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmit}
        initialData={selectedUser || undefined}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedUser?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedUser(null);
              }}
              disabled={isSubmitting}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete User
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
