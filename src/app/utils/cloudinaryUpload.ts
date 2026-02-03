import { cloudinaryUpload } from "../config/cloudinary.config";

export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  folder: string = "evo-tech"
): Promise<string> => {
  const UPLOAD_TIMEOUT = 60000; // 60 seconds timeout
  
  console.log(`[Cloudinary] Starting upload to folder: ${folder}, size: ${fileBuffer.length} bytes`);
  
  return new Promise((resolve, reject) => {
    // Set a timeout to prevent hanging
    const timeoutId = setTimeout(() => {
      console.error(`[Cloudinary] Upload timeout after ${UPLOAD_TIMEOUT}ms`);
      reject(new Error(`Cloudinary upload timeout after ${UPLOAD_TIMEOUT}ms`));
    }, UPLOAD_TIMEOUT);
    
    const uploadStream = cloudinaryUpload.uploader.upload_stream(
      {
        folder: folder,
        resource_type: "auto",
        timeout: 60000, // Cloudinary API timeout
      },
      (error, result) => {
        clearTimeout(timeoutId); // Clear timeout on completion
        if (error) {
          console.error(`[Cloudinary] Upload error:`, error);
          reject(error);
        } else {
          console.log(`[Cloudinary] Upload successful: ${result?.secure_url}`);
          resolve(result?.secure_url || "");
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    cloudinaryUpload.uploader.destroy(publicId, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};
