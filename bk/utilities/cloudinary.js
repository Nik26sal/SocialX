import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';


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
