"use client";
import React, { useEffect, useState, FormEvent } from "react";
import {
  getCareerJobs,
  createCareerJob,
  updateCareerJob,
  deleteCareerJob,
} from "@/lib/api/careerJobs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, X, Calendar, Briefcase, MapPin, DollarSign, Clock } from 'lucide-react';

type JobType = 'full-time' | 'part-time' | 'contract' | 'internship';

interface Job {
  _id: string;
  title: string;
  description: string;
  location?: string;
  salary?: string;
  jobType?: JobType;
  postedAt?: string;
  closingAt?: string;
  requirements?: string[];
}

export default function CareerJobsCrud() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [jobType, setJobType] = useState("full-time");
  const [editId, setEditId] = useState<string | null>(null);

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
        title, 
        description, 
        location, 
        salary,
        jobType: jobType as JobType,
        postedAt: new Date().toISOString()
      });
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
      await updateCareerJob(editId, { 
        title, 
        description, 
        location, 
        salary,
        jobType: jobType as JobType
      });
      resetForm();
      await fetchJobs();
    } catch (error) {
      console.error('Error updating job:', error);
      alert("Failed to update job");
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this job?")) return;
    try {
      await deleteCareerJob(id);
      await fetchJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
      alert("Failed to delete job");
    }
  }

  function resetForm() {
    setEditId(null);
    setTitle("");
    setDescription("");
    setLocation("");
    setSalary("");
    setJobType("full-time");
  }

  function startEdit(job: Job) {
    setEditId(job._id);
    setTitle(job.title);
    setDescription(job.description);
    setLocation(job.location || "");
    setSalary(job.salary || "");
    setJobType(job.jobType || "full-time");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Career Jobs</h1>
        <p className="text-muted-foreground">Manage all career job postings and applications.</p>
      </div>
      
      {/* Create/Edit Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{editId ? 'Edit Job Posting' : 'Create New Job Posting'}</CardTitle>
          <CardDescription>
            {editId ? 'Update the job details below' : 'Fill in the job details to create a new posting'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={editId ? handleUpdate : handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="job-title">
                  Job Title
                </label>
                <input
                  id="job-title"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="e.g. Senior Software Engineer"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="job-location">
                  Location
                </label>
                <input
                  id="job-location"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="e.g. Remote, New York, etc."
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="job-salary">
                  Salary Range
                </label>
                <input
                  id="job-salary"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="e.g. $80,000 - $120,000"
                  value={salary}
                  onChange={e => setSalary(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="job-type">
                  Job Type
                </label>
                <select
                  id="job-type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={jobType}
                  onChange={e => setJobType(e.target.value)}
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="job-description">
                Job Description
              </label>
              <textarea
                id="job-description"
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter detailed job description, responsibilities, and requirements..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              {editId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditId(null);
                    setTitle("");
                    setDescription("");
                    setLocation("");
                    setSalary("");
                    setJobType("full-time");
                  }}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              )}
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
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Jobs List */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Job Postings</h2>
            <p className="text-sm text-muted-foreground">
              {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} found
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => {
                setEditId(null);
                setTitle("");
                setDescription("");
                setLocation("");
                setSalary("");
                setJobType("full-time");
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Job
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : jobs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-1">No job postings yet</h3>
              <p className="text-sm text-muted-foreground">
                Get started by creating a new job posting.
              </p>
              <Button className="mt-4" onClick={() => {
                setEditId(null);
                setTitle("");
                setDescription("");
                setLocation("");
                setSalary("");
                setJobType("full-time");
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Create Job
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {jobs.map((job: Job) => (
              <Card key={job._id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Briefcase className="mr-1.5 h-4 w-4" />
                          {job.jobType || 'Full-time'}
                        </div>
                        {job.location && (
                          <div className="flex items-center">
                            <MapPin className="mr-1.5 h-4 w-4" />
                            {job.location}
                          </div>
                        )}
                        {job.salary && (
                          <div className="flex items-center">
                            <DollarSign className="mr-1.5 h-4 w-4" />
                            {job.salary}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => startEdit(job)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(job._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="line-clamp-2 text-sm text-muted-foreground mb-4">
                    {job.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {job.requirements?.map((req: string, idx: number) => (
                      <span
                        key={idx}
                        className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between pt-0 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="mr-1.5 h-4 w-4" />
                    Posted {job.postedAt ? new Date(job.postedAt).toLocaleDateString() : 'recently'}
                  </div>
                  {job.closingAt && (
                    <div className="flex items-center">
                      <Clock className="mr-1.5 h-4 w-4" />
                      Closes {new Date(job.closingAt).toLocaleDateString()}
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
