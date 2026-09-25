export const PAGE_SIZE = 8;

// Labels for the UserRole enum in the database.
export const ROLE_LABELS = { USER: "Member", ADMIN: "Admin" };

export const ROLE_STYLES = {
  USER: "bg-sky text-teal",
  ADMIN: "bg-orange-soft text-orange-ink",
};

export const STATUS_STYLES = {
  Active: "bg-success/10 text-success",
  Suspended: "bg-orange-soft text-orange-ink",
};

export const AVATAR_COLOURS = [
  "bg-teal text-cream",
  "bg-mocha text-cream",
  "bg-orange text-white",
  "bg-sky text-teal",
];

// Placeholder members
// the User model; `status` has no column yet.
export const SAMPLE_USERS = [
  {
    id: "2",
    name: "Thabo",
    surname: "Mkhize",
    username: "thabo_m",
    email: "thabo@example.com",
    role: "USER",
    status: "Active",
    createdAt: "2025-06-03",
  },
  {
    id: "3",
    name: "Lerato",
    surname: "Ndlovu",
    username: "lerato",
    email: "lerato@example.com",
    role: "USER",
    status: "Active",
    createdAt: "2025-06-15",
  },
  {
    id: "4",
    name: "Kgothatso",
    surname: "Phiri",
    username: "kgothatso",
    email: "kgothatso@example.com",
    role: "USER",
    status: "Active",
    createdAt: "2025-06-28",
  },
  {
    id: "5",
    name: "Busisiwe",
    surname: "Fakude",
    username: "busi_f",
    email: "busisiwe@example.com",
    role: "USER",
    status: "Suspended",
    createdAt: "2025-07-10",
  },
  {
    id: "6",
    name: "Mpho",
    surname: "Jacobs",
    username: "mpho_j",
    email: "mpho@example.com",
    role: "ADMIN",
    status: "Active",
    createdAt: "2025-07-18",
  },
  {
    id: "7",
    name: "Sophie",
    surname: "Rampa",
    username: "sophie_r",
    email: "sophie@example.com",
    role: "USER",
    status: "Active",
    createdAt: "2025-08-02",
  },
  {
    id: "8",
    name: "David",
    surname: "Tshabalala",
    username: "david_t",
    email: "david@example.com",
    role: "USER",
    status: "Active",
    createdAt: "2025-08-15",
  },
  {
    id: "9",
    name: "Naledi",
    surname: "Mokoena",
    username: "naledi",
    email: "naledi@example.com",
    role: "USER",
    status: "Active",
    createdAt: "2025-09-04",
  },
  {
    id: "10",
    name: "Sipho",
    surname: "Dlamini",
    username: "sipho_d",
    email: "sipho@example.com",
    role: "USER",
    status: "Active",
    createdAt: "2025-09-11",
  },
];
