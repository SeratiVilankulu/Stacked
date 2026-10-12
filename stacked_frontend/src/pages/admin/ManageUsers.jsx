import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import AdminLayout from "../../components/admin/AdminLayout.jsx";
import FilterSelect from "../../components/FilterSelect.jsx";
import Checkbox from "../../components/Checkbox.jsx";
import Pill from "../../components/Pill.jsx";
import IconButton from "../../components/IconButton.jsx";
import PageHeading from "../../components/admin/PageHeading.jsx";
import FilterBar from "../../components/admin/FilterBar.jsx";
import Pagination from "../../components/admin/Pagination.jsx";
import UserFormModal from "../../components/admin/UserFormModal.jsx";
import UserActivity from "./UserActivity.jsx";
import QuoteCard from "../../components/QuoteCard.jsx";
import {
  AVATAR_COLOURS,
  PAGE_SIZE,
  ROLE_LABELS,
  ROLE_STYLES,
  STATUS_LABELS,
  STATUS_STYLES,
  deleteUser,
  fetchUsers,
  fetchUserStats,
} from "../../lib/users.js";
import { formatDate } from "../user/loanData.js";
import { apiErrorMessage } from "../../lib/api.js";
import useRequest from "../../hooks/useRequest.js";
import { Pencil, Trash2 } from "lucide-react";

const SEARCH_DELAY_MS = 300;

function ManageUsers() {
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(() => new Set());
  const [editing, setEditing] = useState(null); // null, "new" or the user being edited
  const [reloadKey, setReloadKey] = useState(0); // Refetch after a change

  // Wait for typing to pause so every keystroke isn't a request
  useEffect(() => {
    const timer = setTimeout(() => setSearch(query.trim()), SEARCH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: stats } = useRequest(fetchUserStats, `stats-${reloadKey}`);

  const params = {
    search,
    role: role === "ALL" ? "" : role,
    status: status === "ALL" ? "" : status,
    page,
    limit: PAGE_SIZE,
  };
  const request = useRequest(
    () => fetchUsers(params),
    `${JSON.stringify(params)}-${reloadKey}`,
  );
  const users = request.data?.users ?? [];
  const total = request.data?.pagination.total ?? 0;
  const { isLoading } = request;
  const error = request.error && apiErrorMessage(request.error);

  const reload = () => setReloadKey((k) => k + 1);
  const closeForm = useCallback(() => setEditing(null), []);

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;

  const allOnPageSelected =
    users.length > 0 && users.every((u) => selected.has(u.id));

  // Any filter change starts back on page 1.
  const filterReset = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const toggleOne = (id) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleAllOnPage = () =>
    setSelected((prev) => {
      const next = new Set(prev);
      users.forEach((u) =>
        allOnPageSelected ? next.delete(u.id) : next.add(u.id),
      );
      return next;
    });

  const handleSaved = (saved) => {
    toast.success(
      editing === "new"
        ? `${saved.name} ${saved.surname} was added`
        : `${saved.name} ${saved.surname} was updated`,
    );
    setEditing(null);
    reload();
  };

  const handleDelete = async (user) => {
    const name = `${user.name} ${user.surname}`;
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;

    try {
      await deleteUser(user.id);
      toast.success(`${name} was deleted`);
      // Removing the only user on a page steps back to the previous one
      if (users.length === 1 && page > 1) setPage(page - 1);
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(user.id);
        return next;
      });
      reload();
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not delete the user"));
    }
  };

  return (
    <AdminLayout>
      <div className="grid gap-8 px-6 py-8 sm:px-4 lg:px-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-6">
          <PageHeading
            title="Manage Users"
            description="View, add, edit and manage library members accounts."
          />

          <FilterBar
            searchLabel="Search Users"
            query={query}
            onQueryChange={filterReset(setQuery)}
            placeholder="Search by name, email or username..."
            actionLabel="Add User"
            onAction={() => setEditing("new")}
          >
            <FilterSelect
              label="Role"
              value={role}
              onChange={filterReset(setRole)}
              options={[["ALL", "All Roles"], ...Object.entries(ROLE_LABELS)]}
            />
            <FilterSelect
              label="Status"
              value={status}
              onChange={filterReset(setStatus)}
              options={[
                ["ALL", "All Statuses"],
                ...Object.entries(STATUS_LABELS),
              ]}
            />
          </FilterBar>

          {/* Users table */}
          <section className="overflow-hidden rounded-lg border border-sky bg-surface shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full min-w-3xl text-left text-[13px]">
                <thead className="bg-sky/40 text-teal">
                  <tr>
                    <th className="w-12 py-4 pl-5">
                      <Checkbox
                        checked={allOnPageSelected}
                        onChange={toggleAllOnPage}
                        label="Select all users on this page"
                      />
                    </th>
                    <th className="px-2.5 py-4 font-semibold">Name</th>
                    <th className="px-2.5 py-4 font-semibold">Email</th>
                    <th className="px-2.5 py-4 font-semibold">Role</th>
                    <th className="px-2.5 py-4 font-semibold">Username</th>
                    <th className="px-2.5 py-4 font-semibold">Status</th>
                    <th className="px-2.5 py-4 font-semibold">Joined</th>
                    <th className="px-2.5 py-4 pr-5 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody
                  aria-busy={isLoading}
                  className={`divide-y divide-border transition-opacity ${isLoading ? "opacity-60" : ""}`}
                >
                  {!error &&
                    users.map((u, i) => (
                      <tr
                        key={u.id}
                        className="transition-colors hover:bg-sky/10"
                      >
                        <td className="py-3 pl-5">
                          <Checkbox
                            checked={selected.has(u.id)}
                            onChange={() => toggleOne(u.id)}
                            label={`Select ${u.name} ${u.surname}`}
                          />
                        </td>
                        <td className="px-2.5 py-3">
                          <div className="flex items-center gap-3">
                            <span
                              className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-semibold ${
                                AVATAR_COLOURS[
                                  (start + i) % AVATAR_COLOURS.length
                                ]
                              }`}
                            >
                              {u.name[0]}
                              {u.surname[0]}
                            </span>
                            <span className="font-medium whitespace-nowrap text-teal">
                              {u.name} {u.surname}
                            </span>
                          </div>
                        </td>
                        <td className="px-2.5 py-3 text-teal">{u.email}</td>
                        <td className="px-2.5 py-3">
                          <Pill className={ROLE_STYLES[u.role]}>
                            {ROLE_LABELS[u.role]}
                          </Pill>
                        </td>
                        <td className="px-2.5 py-3 text-teal">{u.username}</td>
                        <td className="px-2.5 py-3">
                          <Pill className={STATUS_STYLES[u.status] ?? "bg-sand text-muted"}>
                            {STATUS_LABELS[u.status] ?? u.status}
                          </Pill>
                        </td>
                        <td className="px-2.5 py-3 whitespace-nowrap text-muted">
                          {formatDate(u.createdAt.slice(0, 10))}
                        </td>
                        <td className="px-2.5 py-3 pr-5">
                          <div className="flex gap-2">
                            <IconButton
                              label={`Edit ${u.name}`}
                              onClick={() => setEditing(u)}
                            >
                              <Pencil size={16} />
                            </IconButton>
                            <IconButton
                              label={`Delete ${u.name}`}
                              onClick={() => handleDelete(u)}
                              danger
                            >
                              <Trash2 size={16} />
                            </IconButton>
                          </div>
                        </td>
                      </tr>
                    ))}

                  {(error || users.length === 0) && (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-muted">
                        {error ||
                          (isLoading
                            ? "Loading users..."
                            : "No users match your filters.")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={page}
              pageCount={pageCount}
              pageSize={PAGE_SIZE}
              total={total}
              noun="users"
              onPageChange={setPage}
            />
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <UserActivity stats={stats} />
          <QuoteCard quote="A library card is a passport to new worlds." />
        </div>
      </div>

      {editing && (
        <UserFormModal
          user={editing === "new" ? null : editing}
          onClose={closeForm}
          onSaved={handleSaved}
        />
      )}
    </AdminLayout>
  );
}

export default ManageUsers;
