import JobApplicationsList from "@/features/job-applications/JobApplicationsList";

export default function JobApplicationsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Job Applications</h1>
        <p className="text-muted-foreground">Review and manage all job applications.</p>
      </div>
      <JobApplicationsList />
    </div>
  );
}
