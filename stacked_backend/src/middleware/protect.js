import jwt from "jsonwebtoken";
import { db } from "../prisma/db.ts";

/* Gate for any route that needs a signed-in user. Reads the httpOnly cookie
 the browser sends automatically, verifies it, and loads the account it
 belongs to. */
async function protect(req, res, next) {
	const token = req.cookies?.token;

	if (!token) {
		return res.status(401).json({ message: "Not signed in" });
	}

	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET);

		/* Look the user up rather than trusting the token's contents: the
		 account may have been deleted or had its role changed since the
		 token was issued. */
		const user = await db.orm.public.User.where({ id: payload.id }).first();

		if (!user) {
			return res.status(401).json({ message: "Not signed in" });
		}

		// The password hash must never travel any further than this.
		const { password: _password, ...safeUser } = user;
		req.user = safeUser;

		next();
	} catch {
		// Expired, malformed, or signed with the wrong secret.
		return res.status(401).json({ message: "Not signed in" });
	}
}

export { protect };
