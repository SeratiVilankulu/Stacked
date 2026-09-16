import React from "react";
import { GiBookCover } from "react-icons/gi";

const Logo = () => {
	return (
		<div className="flex items-center gap-2 place-content-center">
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
