import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ImageService {
    constructor() {
        this.uploadsDir = path.join(__dirname, '../uploads');
        this.optimizedDir = path.join(this.uploadsDir, 'optimized');

        // Create directories if they don't exist
        if (!fs.existsSync(this.optimizedDir)) {
            fs.mkdirSync(this.optimizedDir, { recursive: true });
        }
    }

    async optimizeImage(inputPath, options = {}) {
        try {
            const {
                width = 1200,
                height = null,
                quality = 80,
                format = 'webp'
            } = options;

            const filename = path.basename(inputPath, path.extname(inputPath));
            const outputPath = path.join(this.optimizedDir, `${filename}.${format}`);

            let sharpInstance = sharp(inputPath);

            // Resize if dimensions provided
            if (width || height) {
                sharpInstance = sharpInstance.resize(width, height, {
                    fit: 'inside',
                    withoutEnlargement: true
                });
            }

            // Convert and optimize
            switch (format) {
                case 'webp':
                    await sharpInstance.webp({ quality }).toFile(outputPath);
                    break;
                case 'jpeg':
                case 'jpg':
                    await sharpInstance.jpeg({ quality }).toFile(outputPath);
                    break;
                case 'png':
                    await sharpInstance.png({ quality }).toFile(outputPath);
                    break;
                default:
                    await sharpInstance.toFile(outputPath);
            }

            return {
                success: true,
                originalPath: inputPath,
                optimizedPath: outputPath,
                filename: `${filename}.${format}`
            };
        } catch (error) {
            console.error('Image optimization error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async createThumbnail(inputPath, size = 300) {
        try {
            const filename = path.basename(inputPath, path.extname(inputPath));
            const outputPath = path.join(this.optimizedDir, `${filename}-thumb.webp`);

            await sharp(inputPath)
                .resize(size, size, {
                    fit: 'cover',
                    position: 'center'
                })
                .webp({ quality: 70 })
                .toFile(outputPath);

            return {
                success: true,
                thumbnailPath: outputPath,
                filename: `${filename}-thumb.webp`
            };
        } catch (error) {
            console.error('Thumbnail creation error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async deleteImage(filename) {
        try {
            const originalPath = path.join(this.uploadsDir, filename);
            const optimizedPath = path.join(this.optimizedDir, filename);

            // Delete original if exists
            if (fs.existsSync(originalPath)) {
                fs.unlinkSync(originalPath);
            }

            // Delete optimized if exists
            if (fs.existsSync(optimizedPath)) {
                fs.unlinkSync(optimizedPath);
            }

            return { success: true };
        } catch (error) {
            console.error('Image deletion error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    getImageUrl(filename, optimized = true) {
        const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
        const folder = optimized ? 'optimized' : '';
        return `${baseUrl}/uploads/${folder}/${filename}`.replace('//', '/');
    }
}

export default new ImageService();
