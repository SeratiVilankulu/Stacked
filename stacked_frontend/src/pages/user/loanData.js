import AtomicHabitsCover from "@/assets/Atomic_Habits.jpg";
import MidnightLibraryCover from "@/assets/Midnight_Library.jpg";
import ThinkingCover from "@/assets/Thinking.jpg";
import EducatedCover from "@/assets/Educateds.jpg";
import SapiensCover from "@/assets/Sapiens.jpg";
import ProjectHailMaryCover from "@/assets/Project_Hail_Mary.jpg";
import SilentPatientCover from "@/assets/Silent_Patient.jpg";
import CirceCover from "@/assets/Circe .jpg";

export const LOAN_PERIOD_DAYS = 14;
export const MAX_RENEWALS = 2;
export const FINE_PER_DAY = 5; // Rands

export const LOAN_STATUS_LABELS = {
  ON_LOAN: "On Loan",
  DUE_SOON: "Due Soon",
  OVERDUE: "Overdue",
  RETURNED: "Returned",
};

export const LOAN_STATUS_STYLES = {
  ON_LOAN: "bg-success/10 text-success",
  DUE_SOON: "bg-sky text-teal",
  OVERDUE: "bg-orange-soft text-orange-ink",
  RETURNED: "bg-sand text-muted",
};

const DAY_MS = 24 * 60 * 60 * 1000;

// Whole days from today until `date` (negative once it has passed).
export function daysUntil(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return Math.round((target - today) / DAY_MS);
}

export function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Status is derived from the dates so it never goes stale.
export function loanStatus(loan) {
  if (loan.returnedOn) return "RETURNED";
  const days = daysUntil(loan.dueDate);
  if (days < 0) return "OVERDUE";
  if (days <= 3) return "DUE_SOON";
  return "ON_LOAN";
}

export function loanFine(loan) {
  if (loan.returnedOn) return 0;
  return Math.max(0, -daysUntil(loan.dueDate)) * FINE_PER_DAY;
}

// TODO: Remove with SAMPLE_LOANS once loans come from the backend
const SAMPLE_LOAN_BOOKS = [
  ["Atomic Habits", "James Clear", "Self-Help", AtomicHabitsCover],
  ["The Midnight Library", "Matt Haig", "Fiction", MidnightLibraryCover],
  ["Thinking, Fast and Slow", "Daniel Kahneman", "Psychology", ThinkingCover],
  ["Educated", "Tara Westover", "Memoir", EducatedCover],
  ["Sapiens", "Yuval Noah Harari", "Non-Fiction", SapiensCover],
  ["Project Hail Mary", "Andy Weir", "Sci-Fi", ProjectHailMaryCover],
  ["The Silent Patient", "Alex Michaelides", "Psychological Thriller", SilentPatientCover],
  ["Circe", "Madeline Miller", "Fantasy", CirceCover],
].map(([title, author, genre, coverImageUrl]) => ({
  title,
  author,
  genre,
  coverImageUrl,
}));

const book = (title) => SAMPLE_LOAN_BOOKS.find((b) => b.title === title);

// Dates are relative to today so the sample always shows every status.
const daysFromNow = (n) => addDays(new Date(), n).toISOString();

// TODO: Will remove once endpoint call is made in the frontend
export const SAMPLE_LOANS = [
  {
    id: 1,
    book: book("Atomic Habits"),
    borrowedOn: daysFromNow(-9),
    dueDate: daysFromNow(5),
    renewals: 0,
  },
  {
    id: 2,
    book: book("The Midnight Library"),
    borrowedOn: daysFromNow(-12),
    dueDate: daysFromNow(2),
    renewals: 0,
  },
  {
    id: 3,
    book: book("Thinking, Fast and Slow"),
    borrowedOn: daysFromNow(-4),
    dueDate: daysFromNow(10),
    renewals: 1,
  },
  {
    id: 4,
    book: book("Educated"),
    borrowedOn: daysFromNow(-2),
    dueDate: daysFromNow(12),
    renewals: 0,
  },
  {
    id: 5,
    book: book("Sapiens"),
    borrowedOn: daysFromNow(-24),
    dueDate: daysFromNow(-10),
    renewals: 2,
  },
  {
    id: 6,
    book: book("Project Hail Mary"),
    borrowedOn: daysFromNow(-40),
    dueDate: daysFromNow(-26),
    returnedOn: daysFromNow(-28),
    renewals: 0,
  },
  {
    id: 7,
    book: book("The Silent Patient"),
    borrowedOn: daysFromNow(-60),
    dueDate: daysFromNow(-46),
    returnedOn: daysFromNow(-47),
    renewals: 1,
  },
  {
    id: 8,
    book: book("Circe"),
    borrowedOn: daysFromNow(-90),
    dueDate: daysFromNow(-76),
    returnedOn: daysFromNow(-80),
    renewals: 0,
  },
];
