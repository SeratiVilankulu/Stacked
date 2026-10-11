import api from "./api.js";

export const PAGE_SIZE = 8;

// Labels for the UserRole enum in the database
export const ROLE_LABELS = { USER: "Member", ADMIN: "Admin" };

export const ROLE_STYLES = {
  USER: "bg-sky text-teal",
  ADMIN: "bg-orange-soft text-orange-ink",
};

export const STATUS_LABELS = { ACTIVE: "Active", SUSPENDED: "Suspended" };

export const STATUS_STYLES = {
  ACTIVE: "bg-success/10 text-success",
  SUSPENDED: "bg-orange-soft text-orange-ink",
};

export const AVATAR_COLOURS = [
  "bg-teal text-cream",
  "bg-mocha text-cream",
  "bg-orange text-white",
  "bg-sky text-teal",
];

// User Endpoint calls (admin only)

export async function fetchUsers(params = {}) {
  const query = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== "" && v != null),
  );
  const res = await api.get("/users", { params: query });
  return res.data.data; // returns users and pagination
}

export async function fetchUserStats() {
  const res = await api.get("/users/stats");
  return res.data.data; // returns total, newThisMonth and active/suspended account
}

export async function createUser(data) {
  const res = await api.post("/users", data);
  return res.data.data.user;
}

export async function updateUser(id, data) {
  const res = await api.patch(`/users/${id}`, data);
  return res.data.data.user;
}

export async function deleteUser(id) {
  await api.delete(`/users/${id}`);
}
