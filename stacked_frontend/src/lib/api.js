import axios from "axios";

// One client for every backend call. The auth cookie is httpOnly, so `withCredentials` lets the browser attach it.
// By default calls go to "/api" on the page's own origin and Vite proxies them to Express,
// so CORS never applies in development whatever port Vite ends up on.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
});

// Turns an axios error into a message that can be shown to the user.
export function apiErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  if (!error?.response) return "Can't reach the server. Please try again later.";
  const { data } = error.response;
  if (typeof data === "string" && data) return data;
  return data?.error || data?.message || fallback;
}

export default api;
