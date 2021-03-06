import { container } from 'tsyringe';

import mailConfig from '@config/mail';
import uploadConfig from '@config/upload';

import IStorageProvider from '@shared/providers/models/IStorageProvider';
import DiskStorageProvider from '@shared/providers/implementations/DiskStorageProvider';
import S3StorageProvider from '@shared/providers/implementations/S3StorageProvider';

import IMailProvider from '@shared/providers/models/IMailProvider';
import EtherealMailProvider from '@shared/providers/implementations/EtherealMailProvider';
import SESMailProvider from '@shared/providers/implementations/SESMailProvider';

import IMailTemplateProvider from '@shared/providers/models/IMailTemplateProvider';
import HandlebarsMailTemplateProvider from '@shared/providers/implementations/HandlebarsMailTemplateProvider';

import ICacheProvider from '@shared/providers/models/ICacheProvider';
import RedisCacheProvider from '@shared/providers/implementations/RedisCacheProvider';

const storageProviders = {
  disk: DiskStorageProvider,
  s3: S3StorageProvider,
};

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  storageProviders[uploadConfig.driver],
);

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  HandlebarsMailTemplateProvider,
);

const mailProviders = {
  ethereal: container.resolve(EtherealMailProvider),
  ses: container.resolve(SESMailProvider),
};

container.registerInstance<IMailProvider>(
  'MailProvider',
  mailProviders[mailConfig.driver],
);

container.registerSingleton<ICacheProvider>(
  'CacheProvider',
  RedisCacheProvider,
);
