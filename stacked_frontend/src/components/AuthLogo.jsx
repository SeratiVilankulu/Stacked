import React from "react";
import { GiBookCover } from "react-icons/gi";

const AuthLogo = () => {
  return (
    <div className="flex items-center gap-2">
      <GiBookCover className="size-14 text-cream" />
      <div className="flex flex-col">
        <span className="text-cream capitalize md:uppercase text-3xl leading-none font-heading tracking-wider">
          Stacked
        </span>
        <span className="text-cream text-sm font-semibold">
          Community Library
        </span>
      </div>
    </div>
  );
};

export default AuthLogo;
