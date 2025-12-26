import { useState } from "react";
import { Link } from "react-router-dom";
import UserForm from "../components/users/UserForm";
import { useUsersList, createUser, deleteUser } from "../hooks/useUsers";
import { getErrorMessage } from "../api/client";

export default function Users() {
  const { data, loading, error, refetch } = useUsersList();
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState("");

  async function handleCreate(values) {
    setCreating(true);
    setSubmitError(null);
    setSubmitSuccess("");
    try {
      await createUser(values);
      setSubmitSuccess("User created successfully.");
      setShowCreate(false);
      await refetch();
    } catch (err) {
      setSubmitError(getErrorMessage(err));
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id) {
    setPendingDeleteId(id);
    setSubmitError(null);
    setSubmitSuccess("");
    try {
      await deleteUser(id);
      setSubmitSuccess("User deleted.");
      await refetch();
    } catch (err) {
      setSubmitError(getErrorMessage(err));
    } finally {
      setPendingDeleteId(null);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Users</h1>
        <button
          type="button"
          className="rounded bg-teal-600 text-white px-4 py-2 hover:bg-teal-700"
          onClick={() => setShowCreate((s) => !s)}
        >
          {showCreate ? "Close" : "Add User"}
        </button>
      </div>

      <p className="mt-2 text-gray-600">
        Manage your users: list, create, update, and delete.
      </p>

      {submitError && (
        <div className="mt-4 rounded border border-red-300 bg-red-50 p-3 text-red-700">
          {submitError}
        </div>
      )}
      {submitSuccess && (
        <div className="mt-4 rounded border border-green-300 bg-green-50 p-3 text-green-700">
          {submitSuccess}
        </div>
      )}

      {showCreate && (
        <div className="mt-6">
          <UserForm
            mode="create"
            onSubmit={handleCreate}
            onCancel={() => setShowCreate(false)}
          />
        </div>
      )}

      <div className="mt-6">
        {loading && <p className="text-gray-600">Loading users…</p>}
        {error && !loading && <p className="text-red-600">{error}</p>}
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3 border-b">Username</th>
              <th className="text-left p-3 border-b">Email</th>
              <th className="text-left p-3 border-b">Role</th>
              <th className="text-left p-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && Array.isArray(data) && data.length === 0 && (
              <tr>
                <td className="p-3 text-gray-500" colSpan={4}>
                  No users found.
                </td>
              </tr>
            )}
            {Array.isArray(data) &&
              data.map((u) => {
                const id = u?._id ?? u?.id ?? u?.uuid ?? "";
                const name = u?.username ?? u?.name ?? "—";
                const email = u?.email ?? "—";
                const role = u?.role ?? "—";
                const deleting = pendingDeleteId === id;
                return (
                  <tr
                    key={id || name + email}
                    className="odd:bg-white even:bg-gray-50"
                  >
                    <td className="p-3 border-b">{name}</td>
                    <td className="p-3 border-b">{email}</td>
                    <td className="p-3 border-b">{role}</td>
                    <td className="p-3 border-b">
                      <div className="flex gap-3">
                        {id ? (
                          <Link
                            to={`/users/${id}`}
                            className="text-teal-700 hover:text-teal-800 underline"
                          >
                            View
                          </Link>
                        ) : (
                          <span className="text-gray-400">View</span>
                        )}
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => id && handleDelete(id)}
                          disabled={deleting || creating}
                        >
                          {deleting ? "Deleting…" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
