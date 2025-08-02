"use client";
import React, { useEffect, useState, FormEvent } from "react";
import {
  getCareerJobs,
  createCareerJob,
  updateCareerJob,
  deleteCareerJob,
} from "@/lib/api/careerJobs";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, X, Calendar, Briefcase, MapPin, DollarSign, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type JobType = 'full-time' | 'part-time' | 'contract' | 'internship';
type JobStatus = 'draft' | 'published' | 'closed';

interface Job {
  _id: string;
  title: string;
  description: string;
  location?: string;
  salary?: string;
  status: JobStatus;
  jobType?: JobType;
  postedAt?: string;
  closingAt?: string;
  requirements?: string[];
}

export default function CareerJobsCrud() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Job, '_id' | 'id' | 'postedAt' | 'closingAt'>>({
    title: "",
    description: "",
    location: "",
    salary: "",
    jobType: "full-time" as JobType,
    status: "draft" as JobStatus,
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    setLoading(true);
    try {
      const data = await getCareerJobs();
      setJobs(data);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      alert("Failed to fetch jobs: " + errorMessage);
    }
    setLoading(false);
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    try {
      await createCareerJob({ 
        ...formData,
        postedAt: new Date().toISOString()
      });
      setIsDialogOpen(false);
      resetForm();
      await fetchJobs();
    } catch (error) {
      console.error('Error creating job:', error);
      alert("Failed to create job");
    }
  }

  async function handleUpdate(e: FormEvent) {
    e.preventDefault();
    if (!editId) return;
    try {
      await updateCareerJob(editId, formData);
      setIsDialogOpen(false);
      resetForm();
      await fetchJobs();
    } catch (error) {
      console.error('Error updating job:', error);
      alert("Failed to update job");
    }
  }

  async function handleDelete(id: string) {
    setIsDeleting(true);
    try {
      await deleteCareerJob(id);
      await fetchJobs();
      setIsDeleteDialogOpen(false);
      setJobToDelete(null);
    } catch (error) {
      console.error('Error deleting job:', error);
      alert("Failed to delete job");
    } finally {
      setIsDeleting(false);
    }
  }

  const handleDeleteClick = (job: Job) => {
    setJobToDelete(job);
    setIsDeleteDialogOpen(true);
  };

  function resetForm() {
    setEditId(null);
    setFormData({
      title: "",
      description: "",
      location: "",
      salary: "",
      jobType: "full-time" as JobType,
      status: "draft" as JobStatus,
    });
  }

  const handleAddNew = () => {
    setEditId(null);
    setFormData({
      title: "",
      description: "",
      location: "",
      salary: "",
      jobType: "full-time" as JobType,
      status: "draft" as JobStatus,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (job: Job) => {
    setEditId(job._id);
    setFormData({
      title: job.title,
      description: job.description,
      location: job.location || "",
      salary: job.salary || "",
      jobType: job.jobType || "full-time" as JobType,
      status: job.status || "draft" as JobStatus,
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Career Jobs</h1>
          <p className="text-sm text-muted-foreground">
            {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} found
          </p>
        </div>
        <Button onClick={() => {
          resetForm();
          setEditId(null);
          setIsDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          New Job
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        if (!open) {
          resetForm();
          setEditId(null);
        }
        setIsDialogOpen(open);
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editId ? 'Edit Job Posting' : 'Create New Job Posting'}</DialogTitle>
            <DialogDescription>
              {editId ? 'Update the job details below' : 'Fill in the job details to create a new posting'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={editId ? handleUpdate : handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Job Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g. Senior Software Engineer"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">
                  Location
                </Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="e.g. Remote, New York, etc."
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary">
                  Salary Range
                </Label>
                <Input
                  id="salary"
                  name="salary"
                  placeholder="e.g. $80,000 - $120,000"
                  value={formData.salary}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobType">
                  Job Type
                </Label>
                <Select
                  value={formData.jobType}
                  onValueChange={(value) => handleSelectChange('jobType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">
                Job Description
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter detailed job description, responsibilities, and requirements..."
                value={formData.description}
                onChange={handleInputChange}
                className="min-h-[120px]"
                required
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
                  setEditId(null);
                  setIsDialogOpen(false);
                }}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button type="submit">
                {editId ? (
                  <>
                    <Pencil className="mr-2 h-4 w-4" />
                    Update Job
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Job
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Job Posting</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{jobToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setJobToDelete(null);
              }}
              disabled={isDeleting}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => jobToDelete && handleDelete(jobToDelete._id)}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Job
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-4">

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-1">No job postings yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get started by creating a new job posting.
            </p>
            <Button 
              onClick={() => {
                resetForm();
                setEditId(null);
                setIsDialogOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Job
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job: Job) => (
              <Card key={job._id} className="border-border bg-card hover:border-primary/50 transition-colors shadow-sm hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-foreground">{job.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          <Briefcase className="mr-1 h-3 w-3" />
                          {job.jobType ? job.jobType.replace('-', ' ') : 'Full-time'}
                        </Badge>
                        {job.location && (
                          <Badge variant="outline" className="text-xs">
                            <MapPin className="mr-1 h-3 w-3" />
                            {job.location}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(job);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(job);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                    {job.description}
                  </p>
                  {job.salary && (
                    <div className="flex items-center text-sm mb-3">
                      <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{job.salary}</span>
                    </div>
                  )}
                  {job.requirements && job.requirements.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">Requirements:</p>
                      <ul className="space-y-1">
                        {job.requirements.slice(0, 3).map((req, idx) => (
                          <li key={idx} className="flex items-center text-sm">
                            <span className="h-1 w-1 rounded-full bg-muted-foreground mr-2"></span>
                            <span className="line-clamp-1">{req}</span>
                          </li>
                        ))}
                        {job.requirements.length > 3 && (
                          <li className="text-xs text-muted-foreground">
                            +{job.requirements.length - 3} more
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex items-center justify-between pt-0 text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="mr-1.5 h-3.5 w-3.5" />
                    <span>Posted {job.postedAt ? new Date(job.postedAt).toLocaleDateString() : 'recently'}</span>
                  </div>
                  {job.closingAt && (
                    <div className="flex items-center">
                      <Clock className="mr-1.5 h-3.5 w-3.5" />
                      <span>Closes {new Date(job.closingAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
