import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./App.jsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider.jsx";
import RequireRole from "./components/RequireRole.jsx";
import Register from "./pages/auth/Register.jsx";
import Login from "./pages/auth/Login.jsx";
import Dashboard from "./pages/user/Dashboard.jsx";
import AdminDashboard from "./pages/admin/Dashboard.jsx";
import ManageUsers from "./pages/admin/ManageUsers.jsx";
import About from "./pages/public/About.jsx";

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
	{ path: "/about", element: <About /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Outside the router so every route shares one signed-in user. */}
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
