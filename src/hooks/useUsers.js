import { useEffect, useState, useCallback } from "react";
import client, { getErrorMessage } from "../api/client";

// REST endpoints:
// GET    /users            -> list all users
// GET    /users/:id        -> get one user
// POST   /users            -> create user
// PATCH  /users/:id        -> update user
// DELETE /users/:id        -> delete user

export async function getUsers() {
  const res = await client.get("/users");
  const body = res.data;
  // Support envelope shape: { success, data: [...] }
  if (body && typeof body === "object" && Array.isArray(body.data)) {
    return body.data;
  }
  // Or plain array
  return Array.isArray(body) ? body : [];
}

export async function getUser(userId) {
  if (!userId) throw new Error("userId is required");
  const res = await client.get(`/users/${userId}`);
  const body = res.data;
  return body && typeof body === "object" && "data" in body ? body.data : body;
}

export async function createUser(payload) {
  if (!payload || typeof payload !== "object") {
    throw new Error("payload must be an object");
  }
  // Map form fields to API contract (username on backend)
  const apiPayload = {
    username: payload.name,
    email: payload.email,
    role: payload.role,
    password: payload.password,
  };
  const res = await client.post("/users", apiPayload);
  const body = res.data;
  return body && typeof body === "object" && "data" in body ? body.data : body;
}

export async function updateUser(userId, payload) {
  if (!userId) throw new Error("userId is required");
  if (!payload || typeof payload !== "object") {
    throw new Error("payload must be an object");
  }
  const apiPayload = {
    username: payload.name,
    email: payload.email,
    role: payload.role,
  };
  const res = await client.patch(`/users/${userId}`, apiPayload);
  const body = res.data;
  return body && typeof body === "object" && "data" in body ? body.data : body;
}

export async function deleteUser(userId) {
  if (!userId) throw new Error("userId is required");
  const res = await client.delete(`/users/${userId}`);
  const body = res.data;
  return body && typeof body === "object" && "data" in body ? body.data : body;
}

// Hook: Users list with loading/error/refetch
export function useUsersList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const users = await getUsers();
      setData(Array.isArray(users) ? users : []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { data, loading, error, refetch: fetchUsers };
}

// Hook: Single user detail with loading/error/refetch
export function useUserDetail(userId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUser = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const user = await getUser(userId);
      setData(user ?? null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { data, loading, error, refetch: fetchUser };
}
