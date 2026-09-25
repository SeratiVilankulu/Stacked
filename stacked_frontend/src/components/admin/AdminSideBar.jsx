import React from "react";
import AdminSidebarLink from "./AdminSidebarLinks.jsx";
import AuthLogo from "../AuthLogo.jsx";
import Leaf from "@/assets/leaf_image.png";
import { House, BookOpen, User, Clock, Database } from "lucide-react";

function AdminSideBar() {
  return (
    <>
      <AuthLogo />
      {/* Navigation */}
      <nav className="flex-1">
        <div className="space-y-1.5 pt-4 ">
          <AdminSidebarLink to="/" icon={<House size={19} />} label="Home" />

          <AdminSidebarLink
            to="/admin/dashboard"
            icon={<House size={19} />}
            label="Dashboard"
          />

          <AdminSidebarLink
            to="/manage-books"
            icon={<BookOpen size={19} />}
            label="Manage Books"
          />

          <AdminSidebarLink
            to="/admin/users"
            icon={<User size={19} />}
            label="Manage Users"
          />

          <AdminSidebarLink
            to="/loans"
            icon={<Clock size={19} />}
            label="Manage Loans"
          />

          <AdminSidebarLink
            to="/fines"
            icon={<Database size={19} />}
            label="Manage Fines"
          />
        </div>

        <div className="my-7 border-t border-cream/15" />
      </nav>

      {/* Bottom section */}
      <div className="mt-auto">
        {/* Quote */}
        <div className="mx-4 rounded-2xl pt-10">
          <img
            src={Leaf}
            alt=""
            aria-hidden="true"
            className="pointer-events-none ml-12 mb-8 md:w-20"
          />

          <p className="font-quote italic text-2xl leading-tight text-cream">
            Books build <br />
            better futures.
          </p>

          <div className="mt-4 h-0.5 w-8 bg-orange" />
        </div>

        {/* Logout */}
        <div className="my-7 border-t border-cream/15" />
      </div>
    </>
  );
}
export default AdminSideBar;
