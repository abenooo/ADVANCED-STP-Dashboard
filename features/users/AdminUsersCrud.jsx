"use client";

import React, { useEffect, useState } from "react";
import {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
} from "@/lib/api/adminUser";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminUsersCrud() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "" });
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    try {
      const data = await getAdminUsers();
      setUsers(data);
    } catch (e) {
      alert("Failed to fetch users: " + (e.message || e));
    }
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editId) {
        await updateAdminUser(editId, form);
      } else {
        await createAdminUser(form);
      }
      resetForm();
      fetchUsers();
    } catch {
      alert("Failed to submit form");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this user?")) return;
    try {
      await deleteAdminUser(id);
      fetchUsers();
    } catch {
      alert("Failed to delete user");
    }
  }

  function startEdit(user) {
    setEditId(user._id);
    setForm({ name: user.name, email: user.email });
    setShowModal(true);
  }

  function resetForm() {
    setEditId(null);
    setForm({ name: "", email: "" });
    setShowModal(false);
  }

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-start py-16 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">ADMIN USERS</h1>
          <p className="text-sm text-neutral-400">Manage admin users. Add, edit, or remove users below.</p>
        </div>
      </div>

      <Button
        className="mb-8 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded font-semibold"
        onClick={() => setShowModal(true)}
      >
        Add New User
      </Button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-700 rounded-2xl shadow-xl p-8 animate-fade-in">
            <button
              onClick={resetForm}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
              aria-label="Close"
            >
              &times;
            </button>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold text-orange-500 mb-1">
                  {editId ? "Edit User" : "Create User"}
                </h2>
                <p className="text-gray-400 text-base mb-4">Fill in the details below.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="user-name">
                    Name
                  </label>
                  <input
                    id="user-name"
                    className="border border-neutral-700 bg-neutral-800 text-white rounded px-3 py-2 w-full"
                    placeholder="Enter name"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="user-email">
                    Email
                  </label>
                  <input
                    id="user-email"
                    className="border border-neutral-700 bg-neutral-800 text-white rounded px-3 py-2 w-full"
                    placeholder="Enter email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded font-semibold"
                  type="submit"
                >
                  {editId ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  className="px-6 py-2 rounded border border-neutral-700 text-gray-300 font-semibold"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full text-gray-300 text-center">Loading...</div>
        ) : users.length === 0 ? (
          <div className="col-span-full text-gray-400 text-center">No users found.</div>
        ) : (
          users.map(user => (
            <Card
              key={user._id}
              className="border border-neutral-800 bg-neutral-900 rounded-xl shadow p-0 mb-5 flex flex-col h-full transition-colors hover:border-orange-500/50"
            >
              <CardHeader>
                <div className="text-sm text-gray-400 mb-1">ID: {user._id}</div>
                <div className="text-xl font-bold text-white mb-1">{user.name}</div>
                <div className="text-sm text-white mb-2">{user.email}</div>
              </CardHeader>
              <div className="px-6 pb-6 flex flex-col flex-1">
                <div className="flex gap-3 justify-end pb-6">
                  <Button
                    onClick={() => startEdit(user)}
                    variant="outline"
                    className="w-full border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(user._id)}
                    variant="outline"
                    className="w-full border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
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
