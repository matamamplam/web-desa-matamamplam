import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width?: number;
  height?: number;
  format?: string;
  resource_type?: string;
}

/**
 * Upload file to Cloudinary from buffer or base64
 */
export async function uploadToCloudinary(
  file: Buffer | string,
  folder: string = 'sid-mata-mamplam',
  options?: {
    resourceType?: 'image' | 'video' | 'raw' | 'auto';
    transformation?: any;
  }
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder,
      resource_type: options?.resourceType || 'auto',
      transformation: options?.transformation,
    };

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            public_id: result.public_id,
            secure_url: result.secure_url,
            width: result.width,
            height: result.height,
            format: result.format,
            resource_type: result.resource_type,
          });
        }
      }
    );

    if (typeof file === 'string') {
      // Base64 string
      uploadStream.end(Buffer.from(file, 'base64'));
    } else {
      // Buffer
      uploadStream.end(file);
    }
  });
}

/**
 * Delete file from Cloudinary
 */
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: 'image' | 'video' | 'raw' = 'image'
): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
}

/**
 * Get optimized image URL
 */
export function getOptimizedImageUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number | 'auto';
    format?: string;
  }
): string {
  return cloudinary.url(publicId, {
    transformation: [
      {
        width: options?.width,
        height: options?.height,
        crop: 'fill',
        quality: options?.quality || 'auto',
        fetch_format: options?.format || 'auto',
      },
    ],
  });
}

export default cloudinary;
