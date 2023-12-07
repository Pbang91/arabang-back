import { registerAs } from '@nestjs/config';

export default registerAs('s3', () => ({
  bucket: process.env.AWS_BUCKET_NAME,
  region: process.env.AWS_REGION,
  accessKey: process.env.AWS_ACCESS_KEY,
  secretKey: process.env.AWS_SECRET_KEY,
}));
