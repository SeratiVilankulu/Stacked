import jwt from "jsonwebtoken";

function generateToken(user) {
	const payload = { id: user.id, role: user.role };
	const token = jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN || "7d",
	});

	return token;
}

const sendTokenCookie = (user, statusCode, res, body = {}) => {
	const token = generateToken(user);
	res.cookie("token", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days, how long the browser keeps it in milliseconds.
	});

	res.status(statusCode).json(body);
};

export { generateToken, sendTokenCookie };
