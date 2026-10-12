import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./App.jsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthProvider.jsx";
import RequireRole from "./components/RequireRole.jsx";
import Register from "./pages/auth/Register.jsx";
import Login from "./pages/auth/Login.jsx";
import Dashboard from "./pages/user/Dashboard.jsx";
import AdminDashboard from "./pages/admin/Dashboard.jsx";
import ManageUsers from "./pages/admin/ManageUsers.jsx";
import About from "./pages/public/About.jsx";
import ManageBooks from "./pages/admin/ManageBooks.jsx";
import ManageLoans from "./pages/admin/ManageLoans.jsx";
import ManageFines from "./pages/admin/ManageFines.jsx";
import BrowseBooks from "./pages/user/BrowseBooks.jsx";
import BookDetails from "./pages/user/BookDetails.jsx";
import MyLoans from "./pages/user/MyLoans.jsx";
import PayFine from "./pages/user/PayFine.jsx";
import MyLibrary from "./pages/user/MyLibrary.jsx";

// Add page routes
const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/register", element: <Register /> },
  { path: "/login", element: <Login /> },
  {
    path: "/dashboard",
    element: (
      <RequireRole role="USER">
        <Dashboard />
      </RequireRole>
    ),
  },
  {
    path: "/books",
    element: (
      <RequireRole role="USER">
        <BrowseBooks />
      </RequireRole>
    ),
  },
  {
    path: "/books/:id",
    element: (
      <RequireRole role="USER">
        <BookDetails />
      </RequireRole>
    ),
  },
  {
    path: "/my-library",
    element: (
      <RequireRole role="USER">
        <MyLibrary />
      </RequireRole>
    ),
  },
  {
    path: "/loans",
    element: (
      <RequireRole role="USER">
        <MyLoans />
      </RequireRole>
    ),
  },
  {
    path: "/loans/:loanId/pay",
    element: (
      <RequireRole role="USER">
        <PayFine />
      </RequireRole>
    ),
  },
  {
    path: "/admin/dashboard",
    element: (
      <RequireRole role="ADMIN">
        <AdminDashboard />
      </RequireRole>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <RequireRole role="ADMIN">
        <ManageUsers />
      </RequireRole>
    ),
  },
  {
    path: "/admin/books",
    element: (
      <RequireRole role="ADMIN">
        <ManageBooks />
      </RequireRole>
    ),
  },
  {
    path: "/admin/loans",
    element: (
      <RequireRole role="ADMIN">
        <ManageLoans />
      </RequireRole>
    ),
  },
  {
    path: "/admin/fines",
    element: (
      <RequireRole role="ADMIN">
        <ManageFines />
      </RequireRole>
    ),
  },
  { path: "/about", element: <About /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Outside the router so every route shares one signed-in user. */}
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </AuthProvider>
  </StrictMode>,
);
