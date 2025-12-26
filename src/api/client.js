import axios from "axios";

const baseURL = "http://localhost:3001/api/v1";

// Shared axios client
export const client = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  // You can tune timeouts if desired
  timeout: 15000,
});

// Response interceptor: pass data through; unify error objects
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const data = error?.response?.data;
    const message =
      (typeof data === "string" && data) ||
      data?.message ||
      error?.message ||
      "Unexpected error";

    // Attach a consistent shape for consumers
    return Promise.reject({
      isAxiosError: true,
      status,
      message,
      data,
      original: error,
    });
  }
);

export function getErrorMessage(err) {
  if (!err) return "Unknown error";
  if (typeof err === "string") return err;
  if (err?.message) return err.message;
  const data = err?.data;
  if (typeof data === "string") return data;
  if (data?.message) return data.message;
  return "Unexpected error";
}

export default client;
