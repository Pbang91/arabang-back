import { Inject, Injectable } from '@nestjs/common';
import * as aws from 'aws-sdk';
import { ConfigType } from '@nestjs/config';
import s3Config from './s3.config';

@Injectable()
export class S3Service {
  private bucket: string;
  private s3: aws.S3;

  constructor(
    @Inject(s3Config.KEY)
    private config: ConfigType<typeof s3Config>,
  ) {
    this.bucket = this.config.bucket;

    aws.config.update({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKey,
        secretAccessKey: config.secretKey,
      },
    });

    this.s3 = new aws.S3({ signatureVersion: 'v4' });
  }

  async getObjectsList(prefix: string): Promise<aws.S3.ObjectList> {
    const params: aws.S3.ListObjectsV2Request = {
      Bucket: this.bucket,
      Delimiter: '/',
      Prefix: `${prefix}/`,
    };

    const objectsList = await this.s3.listObjectsV2(params).promise();

    return objectsList.Contents;
  }

  async generatePresignedUrl(objPath: string, prefix?: string): Promise<string | string[]> {
    if (!prefix) {
      const params = {
        Bucket: this.bucket,
        Key: objPath,
        Expires: 60 * 60,
      };

      const presigndUrl = await this.s3.getSignedUrlPromise('getObject', params);

      return presigndUrl;
    } else {
      const objectLists = await this.getObjectsList(prefix);
      const promiseArray = objectLists.map((metaData) => {
        const params = {
          Bucket: this.bucket,
          Key: metaData.Key,
          Expires: 60 * 60,
        };

        const url = this.s3.getSignedUrlPromise('getObject', params);
        return url;
      });

      return await Promise.all(promiseArray);
    }
  }
}
