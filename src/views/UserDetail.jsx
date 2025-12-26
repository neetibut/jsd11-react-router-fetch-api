import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useUserDetail, updateUser, deleteUser } from "../hooks/useUsers";
import UserForm from "../components/users/UserForm";
import { getErrorMessage } from "../api/client";

export default function UserDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { data: user, loading, error, refetch } = useUserDetail(userId);
  const [showEdit, setShowEdit] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState("");
  // saving state not needed; UserForm manages its own submitting state

  async function handleUpdate(values) {
    setSubmitError(null);
    setSubmitSuccess("");
    try {
      await updateUser(userId, values);
      setSubmitSuccess("Changes saved.");
      setShowEdit(false);
      await refetch();
    } catch (err) {
      setSubmitError(getErrorMessage(err));
    }
  }

  async function handleDelete() {
    setPendingDelete(true);
    setSubmitError(null);
    setSubmitSuccess("");
    try {
      await deleteUser(userId);
      navigate("/users");
    } catch (err) {
      setSubmitError(getErrorMessage(err));
      setPendingDelete(false);
    }
  }

  const defaultValues = {
    name: user?.username ?? user?.name ?? "",
    email: user?.email ?? "",
    role: user?.role ?? "user",
  };

  const id = user?.id ?? user?._id ?? userId;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">User Detail</h1>
        <Link
          to="/users"
          className="text-teal-700 hover:text-teal-800 underline"
        >
          Back to Users
        </Link>
      </div>

      <div className="mt-2 text-gray-600">
        {loading && <p>Loading user…</p>}
        {error && !loading && <p className="text-red-600">{error}</p>}
        {!loading && !error && (
          <p>
            Viewing user ID: <span className="font-mono">{id}</span>
          </p>
        )}
      </div>

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

      <div className="mt-6 space-x-3">
        <button
          type="button"
          className="rounded bg-teal-600 text-white px-4 py-2 hover:bg-teal-700 disabled:opacity-50"
          onClick={() => setShowEdit((s) => !s)}
          disabled={loading}
        >
          {showEdit ? "Close" : "Edit"}
        </button>
        <button
          type="button"
          className="rounded bg-red-600 text-white px-4 py-2 hover:bg-red-700 disabled:opacity-50"
          onClick={handleDelete}
          disabled={pendingDelete || loading}
        >
          {pendingDelete ? "Deleting…" : "Delete"}
        </button>
      </div>

      <div className="mt-6 border rounded p-4 bg-gray-50">
        <h2 className="text-xl font-semibold">Details</h2>
        {!loading && !error && user ? (
          <div className="mt-2 text-gray-700">
            <p>
              <span className="font-medium">Username:</span>{" "}
              {user.username ?? user.name ?? "—"}
            </p>
            <p>
              <span className="font-medium">Email:</span> {user.email ?? "—"}
            </p>
            <p>
              <span className="font-medium">Role:</span> {user.role ?? "—"}
            </p>
          </div>
        ) : (
          <p className="mt-2 text-gray-600">No details available.</p>
        )}
      </div>

      {showEdit && (
        <div className="mt-6">
          <UserForm
            mode="edit"
            defaultValues={defaultValues}
            onSubmit={handleUpdate}
            onCancel={() => setShowEdit(false)}
          />
        </div>
      )}
    </div>
  );
}
