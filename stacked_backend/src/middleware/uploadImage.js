import multer from "multer";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

// Keeps the file in memory (req.file.buffer) so it can go straight to Cloudinary without touching the disk
const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: MAX_SIZE },
	fileFilter: (req, file, cb) => {
		if (!ALLOWED_TYPES.includes(file.mimetype)) {
			return cb(new Error("Cover image must be a JPG, PNG or WEBP file"));
		}
		cb(null, true);
	},
});

// Reads one image from the given form field and turns upload errors into a 400 instead of a crash
function uploadImage(fieldName) {
	return (req, res, next) => {
		upload.single(fieldName)(req, res, (error) => {
			if (!error) return next();

			const message =
				error.code === "LIMIT_FILE_SIZE"
					? "Cover image must be 5 MB or smaller"
					: error.message;
			res.status(400).json({ error: message });
		});
	};
}

export { uploadImage };
