'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Mail, User, Calendar, Briefcase, Clock, CheckCircle, XCircle, AlertCircle, Plus, Pencil, Trash2, X } from 'lucide-react';

interface JobApplication {
  _id: string;
  jobId: string | null;
  name: string;
  email: string;
  resumeUrl: string;
  coverLetter: string;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected' | 'on-hold';
  notes?: string;
  processedBy: string | null;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
}

const statusVariant = {
  pending: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  reviewing: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  accepted: 'bg-green-500/10 text-green-600 dark:text-green-400',
  rejected: 'bg-red-500/10 text-red-600 dark:text-red-400',
  'on-hold': 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
};

export default function JobApplicationsList() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentApplication, setCurrentApplication] = useState<JobApplication | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    jobId: '',
    coverLetter: '',
    status: 'pending' as 'pending' | 'reviewing' | 'accepted' | 'rejected' | 'on-hold',
    notes: ''
  });

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'reviewing', label: 'Reviewing' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'on-hold', label: 'On Hold' },
  ];

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch('/api/applications');
        if (!response.ok) {
          throw new Error('Failed to fetch job applications');
        }
        const data = await response.json();
        setApplications(data);
      } catch (err) {
        console.error('Error fetching job applications:', err);
        setError('Failed to load job applications. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pending': { 
        class: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
        icon: <Clock className="h-4 w-4" />
      },
      'accepted': { 
        class: 'bg-green-500/10 text-green-600 dark:text-green-400',
        icon: <CheckCircle className="h-4 w-4" />
      },
      'rejected': { 
        class: 'bg-red-500/10 text-red-600 dark:text-red-400',
        icon: <XCircle className="h-4 w-4" />
      },
      'reviewing': { 
        class: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
        icon: <AlertCircle className="h-4 w-4" />
      },
      'on-hold': { 
        class: 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
        icon: <Clock className="h-4 w-4" />
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || 
                 { class: 'bg-gray-100 text-gray-800', icon: null };

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.class}`}>
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </span>
    );
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return <div className="text-center py-8">Loading job applications...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-8 space-y-4">
        <p className="text-muted-foreground">No job applications found.</p>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Application
        </Button>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: string) => {
    setFormData(prev => ({ ...prev, status: value as any }));
  };

  const handleEdit = (application: JobApplication) => {
    setCurrentApplication(application);
    setFormData({
      name: application.name,
      email: application.email,
      jobId: application.jobId || '',
      coverLetter: application.coverLetter,
      status: application.status,
      notes: application.notes || ''
    });
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setCurrentApplication(null);
    setFormData({
      name: '',
      email: '',
      jobId: '',
      coverLetter: '',
      status: 'pending',
      notes: ''
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = currentApplication 
        ? `/api/applications/${currentApplication._id}`
        : '/api/applications';
      
      const method = currentApplication ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save application');
      
      const savedApplication = await response.json();
      
      if (currentApplication) {
        setApplications(applications.map(app => 
          app._id === savedApplication._id ? savedApplication : app
        ));
      } else {
        setApplications([savedApplication, ...applications]);
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving application:', error);
      setError('Failed to save application. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application?')) return;
    
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/applications/${id}`, { method: 'DELETE' });
      
      if (!response.ok) throw new Error('Failed to delete application');
      
      setApplications(applications.filter(app => app._id !== id));
    } catch (error) {
      console.error('Error deleting application:', error);
      setError('Failed to delete application. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Job Applications</h2>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Application
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {applications.map((application) => (
        <Card 
          key={application._id} 
          className="border-border bg-card hover:border-primary/50 transition-colors shadow-sm hover:shadow-md"
        >
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  {application.name}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4" />
                  {application.email}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={statusVariant[application.status]}>
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1).replace('-', ' ')}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(application);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-foreground">
                <Briefcase className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">Position:</span>
                <span>{application.jobId || 'Not specified'}</span>
              </div>
              
              <div className="flex items-center gap-2 text-foreground">
                <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">Applied:</span>
                <span>{new Date(application.submittedAt).toLocaleDateString()}</span>
              </div>

              {(expandedId === application._id || application.coverLetter.length < 100) && (
                <div className="mt-2">
                  <p className="text-muted-foreground text-sm mb-1">Cover Letter:</p>
                  <p className="text-foreground text-sm bg-muted/30 p-3 rounded-md">
                    {application.coverLetter}
                  </p>
                </div>
              )}

              {expandedId === application._id && application.notes && (
                <div className="mt-2">
                  <p className="text-muted-foreground text-sm mb-1">Notes:</p>
                  <p className="text-foreground text-sm bg-muted/30 p-3 rounded-md">
                    {application.notes}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-0">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleExpand(application._id)}
                className="text-primary hover:text-primary/80"
              >
                {expandedId === application._id ? 'Show Less' : 'View Details'}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive/80"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm('Are you sure you want to delete this application?')) {
                    handleDelete(application._id);
                  }
                }}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              asChild
            >
              <a 
                href={application.resumeUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Resume</span>
              </a>
            </Button>
          </CardFooter>
        </Card>
      ))}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {currentApplication ? 'Edit Application' : 'Add New Application'}
            </DialogTitle>
            <DialogDescription>
              {currentApplication 
                ? 'Update the application details below.'
                : 'Fill in the details to create a new application.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="jobId">Job Position</Label>
                <Input
                  id="jobId"
                  name="jobId"
                  value={formData.jobId}
                  onChange={handleInputChange}
                  placeholder="e.g., Frontend Developer"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="coverLetter">Cover Letter</Label>
              <Textarea
                id="coverLetter"
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleInputChange}
                rows={4}
                className="min-h-[100px]"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="notes">Notes</Label>
                <span className="text-xs text-muted-foreground">Internal use only</span>
              </div>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                placeholder="Add any internal notes about this application..."
              />
            </div>
            
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              
              {currentApplication && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => handleDelete(currentApplication._id)}
                  disabled={isDeleting}
                  className="mr-auto"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              )}
              
              <Button type="submit" disabled={isDeleting}>
                {currentApplication ? 'Update Application' : 'Create Application'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}