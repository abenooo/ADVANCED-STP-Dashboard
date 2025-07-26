'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Mail, User, Calendar, Briefcase, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

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

export default function JobApplicationsList() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
    return <div className="text-center py-8 text-muted-foreground">No job applications found.</div>;
  }

  return (
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
              {getStatusBadge(application.status)}
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleExpand(application._id)}
              className="text-primary hover:text-primary/80"
            >
              {expandedId === application._id ? 'Show Less' : 'View Details'}
            </Button>
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
  );
}