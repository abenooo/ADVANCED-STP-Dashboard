"use client";
import React, { useEffect, useState } from "react";
import {
  getCareerJobs,
  createCareerJob,
  updateCareerJob,
  deleteCareerJob,
} from "@/lib/api/careerJobs";

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
      <h2 className="text-4xl font-extrabold text-orange-500 mb-2 text-center">Career Jobs</h2>
      <p className="text-gray-400 text-lg mb-10 text-center">
        Manage your job postings. Add, edit, or remove jobs below.
      </p>
      <form
        onSubmit={editId ? handleUpdate : handleCreate}
        className="w-full max-w-xl mb-8 bg-neutral-800 rounded-2xl shadow p-6 space-y-3"
      >
        <input
          className="border border-neutral-700 bg-neutral-900 text-white rounded px-3 py-2 w-full"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <textarea
          className="border border-neutral-700 bg-neutral-900 text-white rounded px-3 py-2 w-full"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
        <div className="flex gap-2">
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded" type="submit">
            {editId ? "Update" : "Create"}
          </button>
          {editId && (
            <button
              type="button"
              className="px-4 py-2 rounded border border-neutral-700 text-gray-300"
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
      <div className="w-full max-w-2xl flex flex-col gap-6">
        {loading ? (
          <div className="text-gray-300 text-center">Loading...</div>
        ) : jobs.length === 0 ? (
          <div className="text-gray-400 text-center">No jobs found.</div>
        ) : (
          jobs.map(job => (
            <div
              key={job._id}
              className="bg-neutral-800 rounded-2xl shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div>
                <div className="text-2xl font-bold text-white mb-1">{job.title}</div>
                <div className="text-gray-300">{job.description}</div>
              </div>
              <div className="flex gap-4 mt-4 md:mt-0">
                <button
                  className="text-blue-400 hover:underline"
                  onClick={() => startEdit(job)}
                >
                  Edit
                </button>
                <button
                  className="text-red-400 hover:underline"
                  onClick={() => handleDelete(job._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
