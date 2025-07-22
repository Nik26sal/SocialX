import dotenv from 'dotenv';
dotenv.config({
    path: './.env'
});
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
// CLOUD_NAME = dhnzzqzap
// CLOUD_API = 642518419392335
// CLOUD_SECRET = mFSvO84Dwvvs3SX9g2d9JOBzloQ


try {
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_API,
        api_secret: process.env.CLOUD_SECRET
    });
} catch (error) {
    console.error("Cloudinary configuration failed:", error);
    throw new Error("Cloudinary configuration failed");
}

const uploadCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"  
        });
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        console.log(response)
        return response;

    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath); 
        }

        throw new Error("Failed to upload to Cloudinary");
    }
};
export { uploadCloudinary, cloudinary };
