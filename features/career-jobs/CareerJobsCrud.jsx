"use client";
import React, { useEffect, useState } from "react";
import {
  getCareerJobs,
  createCareerJob,
  updateCareerJob,
  deleteCareerJob,
} from "@/lib/api/careerJobs";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CareerJobsCrud() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    setLoading(true);
    try {
      const data = await getCareerJobs();
      setJobs(data);
    } catch (e) {
      alert("Failed to fetch jobs: " + (e.message || e));
    }
    setLoading(false);
  }

  async function handleCreate(e) {
    e.preventDefault();
    try {
      await createCareerJob({ title, description });
      setTitle("");
      setDescription("");
      fetchJobs();
    } catch {
      alert("Failed to create job");
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    if (!editId) return;
    try {
      await updateCareerJob(editId, { title, description });
      setEditId(null);
      setTitle("");
      setDescription("");
      fetchJobs();
    } catch {
      alert("Failed to update job");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this job?")) return;
    try {
      await deleteCareerJob(id);
      fetchJobs();
    } catch {
      alert("Failed to delete job");
    }
  }

  function startEdit(job) {
    setEditId(job._id);
    setTitle(job.title);
    setDescription(job.description);
  }

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-start py-16 px-4">
      {/* <h2 className="text-4xl font-extrabold text-orange-500 mb-2 text-center">Career Jobs</h2> */}
      <p className="text-gray-400 text-lg mb-10 text-center">
        Manage your job postings. Add, edit, or remove jobs below.
      </p>
      <form
        onSubmit={editId ? handleUpdate : handleCreate}
        className="w-full max-w-xl mb-8 bg-neutral-800 rounded-2xl shadow p-8 space-y-6"
      >
        <div>
          <h2 className="text-3xl font-extrabold text-orange-500 mb-1">Career Jobs</h2>
          <p className="text-gray-400 text-base mb-4">
            Manage your job postings. Add, edit, or remove jobs below.
          </p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="job-title">
              Title
            </label>
            <input
              id="job-title"
              className="border border-neutral-700 bg-neutral-900 text-white rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter job title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="job-description">
              Description
            </label>
            <textarea
              id="job-description"
              className="border border-neutral-700 bg-neutral-900 text-white rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter job description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded font-semibold transition"
            type="submit"
          >
            {editId ? "Update" : "Create"}
          </button>
          {editId && (
            <button
              type="button"
              className="px-6 py-2 rounded border border-neutral-700 text-gray-300 font-semibold transition"
              onClick={() => {
                setEditId(null);
                setTitle("");
                setDescription("");
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 ">
        {loading ? (
          <div className="col-span-full text-gray-300 text-center">Loading...</div>
        ) : jobs.length === 0 ? (
          <div className="col-span-full text-gray-400 text-center">No jobs found.</div>
        ) : (
          jobs.map(job => (
            <Card
              key={job._id}
              className="border border-neutral-800 bg-neutral-900 rounded-xl shadow p-0 mb-5 flex flex-col h-full transition-colors hover:border-orange-500/50"
            >
              <CardHeader>
                <div className="text-xs text-gray-400 mb-2">
                  Posted: {job.postedAt ? new Date(job.postedAt).toLocaleDateString() : "N/A"}
                </div>
                <div className="text-2xl font-bold text-white mb-1">{job.title}</div>
                <div className="text-sm text-white mb-2">Slug: {job.slug}</div>
              </CardHeader>
              <div className="px-6 pb-6 flex flex-col flex-1">
                <div className="text-white text-base mb-4">{job.description}</div>
                {/* Requirements as tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.requirements && job.requirements.map((req, idx) => (
                    <span
                      key={idx}
                      className="text-white rounded-full px-3 py-1 text-xs"
                    >
                      {req}
                    </span>
                  ))}
                </div>
                {/* Dates */}
                <div className="flex flex-wrap gap-4 text-xs text-gray-400 mb-4">
                  <span>
                    <span className="font-semibold text-gray-300">Posted:</span>{" "}
                    {job.postedAt ? new Date(job.postedAt).toLocaleDateString() : "-"}
                  </span>
                  <span>
                    <span className="font-semibold text-gray-300">Closing:</span>{" "}
                    {job.closingAt ? new Date(job.closingAt).toLocaleDateString() : "-"}
                  </span>
                </div>
                {/* Actions */}
                <div className="flex gap-3 mt-auto justify-end">
                  <Button
                    variant="outline"
                    className="mt-4 w-full border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    className="mt-4 w-full border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
