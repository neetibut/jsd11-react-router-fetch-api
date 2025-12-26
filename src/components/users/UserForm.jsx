import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Default roles available; can be overridden via props
const DEFAULT_ROLES = ["user", "admin"];

// Base Zod schema: trim strings, enforce sensible constraints
const BaseUserSchema = z.object({
  name: z.string().trim().min(2, "Username must be at least 2 characters"),
  email: z.email("Please enter a valid email address"),
  role: z.string().trim().min(2, "Role is required"),
});

/**
 * UserForm
 * - Reusable create/edit form with Zod validation via RHF
 * - Best practices: explicit labels, field errors, disabled while submitting
 *
 * Props:
 * - mode: "create" | "edit" (default: "create")
 * - defaultValues: { name, email, role }
 * - roles: string[] (default: DEFAULT_ROLES)
 * - submitLabel: string (default based on mode)
 * - onSubmit: async (values) => void | Promise<void>
 * - onCancel: () => void
 */
export default function UserForm({
  mode = "create",
  defaultValues = { name: "", email: "", role: "" },
  roles = DEFAULT_ROLES,
  submitLabel,
  onSubmit,
  onCancel,
}) {
  // Build schema based on mode: require password on create
  const Schema =
    mode === "create"
      ? BaseUserSchema.extend({
          password: z.string().min(8, "Password must be at least 8 characters"),
        })
      : BaseUserSchema;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(Schema),
    defaultValues,
    mode: "onTouched",
  });

  const label =
    submitLabel || (mode === "edit" ? "Save Changes" : "Create User");

  async function submit(values) {
    if (typeof onSubmit === "function") {
      await onSubmit(values);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="space-y-4 p-4 border rounded bg-white shadow-sm"
      noValidate
    >
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Username
        </label>
        <input
          id="name"
          type="text"
          className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          placeholder="janedoe"
          autoComplete="off"
          {...register("name")}
          aria-invalid={errors.name ? "true" : "false"}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {mode === "create" && (
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            placeholder="••••••••"
            autoComplete="new-password"
            {...register("password")}
            aria-invalid={errors.password ? "true" : "false"}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          placeholder="jane@example.com"
          autoComplete="off"
          {...register("email")}
          aria-invalid={errors.email ? "true" : "false"}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="role"
          className="block text-sm font-medium text-gray-700"
        >
          Role
        </label>
        <select
          id="role"
          className="mt-1 block w-full rounded border-gray-300 bg-white shadow-sm focus:border-teal-500 focus:ring-teal-500"
          {...register("role")}
          aria-invalid={errors.role ? "true" : "false"}
        >
          <option value="" disabled>
            Select a role
          </option>
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        {errors.role && (
          <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
        )}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          className="rounded bg-teal-600 text-white px-4 py-2 hover:bg-teal-700 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : label}
        </button>
        {onCancel && (
          <button
            type="button"
            className="rounded bg-gray-200 text-gray-800 px-4 py-2 hover:bg-gray-300"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
