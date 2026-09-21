import React from "react";
import { useNavigate } from "react-router-dom";
import { GiBookCover } from "react-icons/gi";

const Logo = () => {
  const navigate = useNavigate();
  return (
    <div
      className="flex items-center gap-2 place-content-center"
      onClick={() => navigate("/")}
    >
      <GiBookCover className="size-14 text-teal" />
      <div className="flex flex-col">
        <span className="text-teal capitalize md:uppercase text-3xl leading-none font-heading tracking-wider">
          Stacked
        </span>
        <span className="text-teal text-sm font-semibold">
          Community Library
        </span>
      </div>
    </div>
  );
};

export default Logo;
