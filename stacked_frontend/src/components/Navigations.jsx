import React from "react";
import { useNavigate } from "react-router-dom";

function Navigations() {
  const navigate = useNavigate();

  return (
    <ul className="flex gap-x-16 list-none place-content-center">
      <li
        className="cursor-pointer hover:border-b-2 border-orange hover:pb-2 duration-300 ease-in"
        onClick={() => navigate("/dashboard")}
      >
        <a>Dashboard</a>
      </li>
      <li
        className="cursor-pointer hover:border-b-2 border-orange hover:pb-2 duration-300 ease-in"
        onClick={() => navigate("/")}
      >
        <a>Books</a>
      </li>
      <li
        className="cursor-pointer hover:border-b-2 border-orange hover:pb-2 duration-300 ease-in"
        onClick={() => navigate("/about")}
      >
        <a>About</a>
      </li>
    </ul>
  );
}

export default Navigations;
