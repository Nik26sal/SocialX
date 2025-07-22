import dotenv from 'dotenv';
dotenv.config();
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name:'dhnzzqzap',
    api_key: 642518419392335,
    api_secret:'mFSvO84Dwvvs3SX9g2d9JOBzloQ'
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
