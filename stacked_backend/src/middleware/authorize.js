// middleware/authorize.js
function authorize(...roles) {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return res.status(403).json({ error: "Not allowed" });
		}
		next();
	};
}

export { authorize };
