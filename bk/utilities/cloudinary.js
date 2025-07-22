import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API,
    api_secret: process.env.CLOUD_SECRET
});

const uploadCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        fs.existsSync(localFilePath) && fs.unlinkSync(localFilePath);
        console.log("Cloudinary Upload Success:", response.secure_url);
        return response;

    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        fs.existsSync(localFilePath) && fs.unlinkSync(localFilePath);
        throw new Error("Failed to upload to Cloudinary");
    }
};

export { uploadCloudinary, cloudinary };
