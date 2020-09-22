import fs from 'fs';
import path from 'path';
import aws, { S3 } from 'aws-sdk';
import { getType } from 'mime';

import uploadConfig from '@config/upload';

import IStorageProvider from '../models/IStorageProvider';

class S3StorageProvider implements IStorageProvider {
  private s3: S3;

  constructor() {
    this.s3 = new aws.S3({
      region: process.env.AWS_DEFAULT_REGION || 'us-east-2',
    });
  }

  public async saveFile(file: string): Promise<string> {
    const tmpFilePath = path.resolve(uploadConfig.tmpFolder, file);

    const type = getType(tmpFilePath);

    if (!type) {
      throw new Error('File not found');
    }

    const fileContent = await fs.promises.readFile(tmpFilePath);

    await this.s3
      .putObject({
        Bucket: 'gobarber-gabrielkim13',
        Key: file,
        ACL: 'public-read',
        Body: fileContent,
        ContentType: type,
      })
      .promise();

    await fs.promises.unlink(tmpFilePath);

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    await this.s3
      .deleteObject({
        Bucket: 'gobarber-gabrielkim13',
        Key: file,
      })
      .promise();
  }
}

export default S3StorageProvider;
