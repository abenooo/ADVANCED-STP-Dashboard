const BASE_URL = "/api/user";

// No client-side token needed; cookies are sent automatically

export async function getAdminUsers() {
  const res = await fetch(BASE_URL);

  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export async function createAdminUser(data: any) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to create user");
  return res.json();
}

export async function updateAdminUser(id: any, data: any) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to update user");
  return res.json();
}

export async function deleteAdminUser(id: any) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete user");
  return res.json();
}
