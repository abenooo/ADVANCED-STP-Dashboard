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
  

  // Fetch jobs on mount
  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    setLoading(true);
    try {
      const data = await getCareerJobs();
      setJobs(data);
    } catch (e) {
      alert("Failed to fetch jobs");
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
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Career Jobs</h2>
      <form onSubmit={editId ? handleUpdate : handleCreate} className="mb-4 space-y-2">
        <input
          className="border p-2 w-full"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <textarea
          className="border p-2 w-full"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
          {editId ? "Update" : "Create"}
        </button>
        {editId && (
          <button
            type="button"
            className="ml-2 px-4 py-2 rounded border"
            onClick={() => {
              setEditId(null);
              setTitle("");
              setDescription("");
            }}
          >
            Cancel
          </button>
        )}
      </form>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul className="space-y-2">
          {jobs.map(job => (
            <li key={job._id} className="border p-2 flex justify-between items-center">
              <div>
                <div className="font-semibold">{job.title}</div>
                <div className="text-sm text-gray-600">{job.description}</div>
              </div>
              <div className="flex gap-2">
                <button
                  className="text-blue-600"
                  onClick={() => startEdit(job)}
                >
                  Edit
                </button>
                <button
                  className="text-red-600"
                  onClick={() => handleDelete(job._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
