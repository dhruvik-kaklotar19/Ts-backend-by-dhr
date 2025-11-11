import express, { Request, Response, NextFunction } from "express";
import multer from 'multer';
import config from 'config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import sharp from "sharp";
import { sendApiResponse, STATUS_CODES, responseMessage } from "../common";
import { logger } from '../utils/logger';


const router = express.Router();
const aws: any = config.get("aws");

const S3 = new S3Client({
    region: aws.AWS_Bucket_Region,
    credentials: {
        accessKeyId: aws.AWS_Access_Key,
        secretAccessKey: aws.AWS_Secret_Key
    },
});

const bucket_name = aws.AWS_Bucket_Name;
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/media', upload.single('image'), async (req: any, res: Response, next: NextFunction) => {
    try {
     

        if (!req.file) {
            return sendApiResponse(
                res,
                STATUS_CODES.BAD_REQUEST,
                "No file uploaded",
                {}
            );
        }

        const compressImage = req.body?.compressImage === 'false';
        let fileBuffer = req.file.buffer;

        if (compressImage) {
            const fileType = req.file.originalname.split('.').pop()?.toLowerCase();
            if (fileType) {
                fileBuffer = await sharp(fileBuffer)
                    .resize(600)
                    .toFormat('jpeg', { quality: 60 })
                    .toBuffer();
            }
        }

        const file_type = req.file.originalname.split('.');
        const user: any = req.headers.user;
        const compressedKey = `image/${user?._id}/${Date.now().toString()}.${file_type[file_type.length - 1]}`;

        const uploadParams = {
            Bucket: bucket_name,
            Key: compressedKey,
            Body: fileBuffer,
            ContentType: 'image/jpeg',
            ACL: 'public-read' as const,
        };

        await S3.send(new PutObjectCommand(uploadParams));

        return sendApiResponse(
            res,
            STATUS_CODES.OK,
            responseMessage.fileUploadSuccess,
            { url: `https://${bucket_name}.s3.amazonaws.com/${compressedKey}` }
        );
    } catch (err) {
        logger.error({ message: 'File upload error', error: err });
        next(err);
    }
});

export const uploadRoutes = router;
