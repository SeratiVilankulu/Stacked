import React from "react";
import { useMemo, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout.jsx";
import FilterSelect from "./FilterSelect.jsx";
import Checkbox from "./Checkbox.jsx";
import Pill from "./Pill.jsx";
import IconButton from "./IconButton.jsx";
import PageButton from "./PageButton.jsx";
import UserActivity from "./UserActivity.jsx";
import UserQuickActions from "./UserQuickActions.jsx";
import QuoteCard from "./QuoteCard.jsx";
import {
  AVATAR_COLOURS,
  PAGE_SIZE,
  ROLE_LABELS,
  ROLE_STYLES,
  SAMPLE_USERS,
  STATUS_STYLES,
} from "./userData.js";
import HeroBooks from "@/assets/books.jpg";
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

function ManageUsers() {
  const [users, setUsers] = useState(SAMPLE_USERS);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(() => new Set());

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter(
      (u) =>
        (status === "ALL" || u.status === status) &&
        (!q ||
          `${u.name} ${u.surname} ${u.email} ${u.username}`
            .toLowerCase()
            .includes(q)),
    );
  }, [users, query, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageUsers = filtered.slice(start, start + PAGE_SIZE);

  const allOnPageSelected =
    pageUsers.length > 0 && pageUsers.every((u) => selected.has(u.id));

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
      pageUsers.forEach((u) =>
        allOnPageSelected ? next.delete(u.id) : next.add(u.id),
      );
      return next;
    });

  return (
    <AdminLayout>
      <div className="grid gap-8 px-6 py-8 sm:px-4 lg:px-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-6">
          {/* Heading */}
          <section className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="animate-rise">
              <p className="text-eyebrow text-orange">Admin Management</p>
              <h1 className="mt-3 text-4xl xl:text-5xl">Manage Users</h1>
              <p className="mt-3 text-muted">
                View, add, edit and manage library members accounts.
              </p>
            </div>

            <div className="relative hidden h-40 w-72 shrink-0 md:block">
              <div className="absolute inset-y-2 left-0 w-3/4 rounded-[50%] bg-sky/70" />
              <img
                src={HeroBooks}
                alt="Books laid out on a library table"
                className="absolute top-0 right-4 h-full w-4/5 rounded-tl-[5rem] rounded-br-[var(--radius-lg)] rounded object-cover shadow-card"
              />
            </div>
          </section>

          {/* Filters */}
          <section className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-sky bg-surface/60  p-5 lg:flex-row lg:items-end">
            <label className="flex-1">
              <span className="text-sm font-medium text-teal">Search Users</span>
              <span className="relative mt-2 block">
                <Search
                  size={18}
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-teal"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => filterReset(setQuery)(e.target.value)}
                  placeholder="Search by name, email or username..."
                  className="w-full rounded-pill border border-sky py-2.5 pr-4 pl-11 text-sm text-ink placeholder:text-muted focus:outline-none!"
                />
              </span>
            </label>

            <div className="grid grid-cols-2 gap-4 lg:flex">
              <FilterSelect
                label="User"
                value={status}
                onChange={filterReset(setStatus)}
                options={[
                  ["ALL", "All Roles"],
                  ["Member", "Member"],
                  ["Admin", "Admin"],
                ]}
              />
              <FilterSelect
                label="Status"
                value={status}
                onChange={filterReset(setStatus)}
                options={[
                  ["ALL", "All Statuses"],
                  ["Active", "Active"],
                  ["Suspended", "Suspended"],
                ]}
              />
            </div>

            <button
              type="button"
              className="flex cursor-pointer items-center justify-center gap-2 rounded-[var(--radius-md)] bg-teal px-6 py-3 text-sm font-semibold text-cream transition-colors duration-200 hover:bg-teal-deep"
            >
              <Plus size={18} />
              Add User
            </button>
          </section>

          {/* Users table */}
          <section className="overflow-hidden rounded-[var(--radius-lg)] border border-sky bg-surface shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[48rem] text-left text-[13px]">
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
                <tbody className="divide-y divide-border">
                  {pageUsers.map((u, i) => (
              <tr key={u.id} className="transition-colors hover:bg-sky/10">
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
                        AVATAR_COLOURS[(start + i) % AVATAR_COLOURS.length]
                      }`}
                    >
                      {u.name[0]}
                      {u.surname[0]}
                    </span>
                    <span className="font-medium whitespace-nowrap text-ink">
                      {u.name} {u.surname}
                    </span>
                  </div>
                </td>
                <td className="px-2.5 py-3 text-muted">{u.email}</td>
                <td className="px-2.5 py-3">
                  <Pill className={ROLE_STYLES[u.role]}>{ROLE_LABELS[u.role]}</Pill>
                </td>
                <td className="px-2.5 py-3 text-muted">{u.username}</td>
                <td className="px-2.5 py-3">
                  <Pill className={STATUS_STYLES[u.status]}>{u.status}</Pill>
                </td>
                <td className="px-2.5 py-3 whitespace-nowrap text-muted">
                  {u.createdAt}
                </td>
                <td className="px-2.5 py-3 pr-5">
                  <div className="flex gap-2">
                    <IconButton label={`Edit ${u.name}`}>
                      <Pencil size={16} />
                    </IconButton>
                    <IconButton label={`Delete ${u.name}`} danger>
                      <Trash2 size={16} />
                    </IconButton>
                  </div>
                </td>
              </tr>
                  ))}

                  {pageUsers.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-muted">
                        No users match your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col items-center justify-between gap-3 border-t border-sky px-5 py-4 text-sm text-muted sm:flex-row">
              <p>
                {filtered.length === 0
                  ? "No users"
                  : `Showing ${start + 1} – ${start + pageUsers.length} of ${filtered.length} users`}
              </p>
              <nav aria-label="Pagination" className="flex items-center gap-2">
                <PageButton
                  label="Previous page"
                  disabled={currentPage === 1}
                  onClick={() => setPage(currentPage - 1)}
                >
                  <ChevronLeft size={16} />
                </PageButton>
                {Array.from({ length: pageCount }, (_, n) => n + 1).map((n) => (
                  <PageButton
                    key={n}
                    label={`Page ${n}`}
                    active={n === currentPage}
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </PageButton>
                ))}
                <PageButton
                  label="Next page"
                  disabled={currentPage === pageCount}
                  onClick={() => setPage(currentPage + 1)}
                >
                  <ChevronRight size={16} />
                </PageButton>
              </nav>
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <UserActivity users={users} />
          <UserQuickActions />
          <QuoteCard />
        </div>
      </div>
    </AdminLayout>
  );
}

export default ManageUsers;
