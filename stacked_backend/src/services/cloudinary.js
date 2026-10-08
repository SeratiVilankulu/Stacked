import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

// Configuration from .env file
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
	secure: true,
});

// All book covers are kept together in one Cloudinary folder
const COVER_FOLDER = "stacked/book-covers";

// Sends an image to Cloudinary and resolves with the upload result (secure_url, public_id, ...)
function uploadCoverImage(buffer) {
	return new Promise((resolve, reject) => {
		const stream = cloudinary.uploader.upload_stream(
			{ folder: COVER_FOLDER, resource_type: "image" },
			(error, result) => (error ? reject(error) : resolve(result)),
		);
		stream.end(buffer);
	});
}

// Removes an uploaded cover, used when the book could not be saved
function deleteCoverImage(publicId) {
	return cloudinary.uploader.destroy(publicId);
}

export { uploadCoverImage, deleteCoverImage };
