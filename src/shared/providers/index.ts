import { container } from 'tsyringe';

import mailConfig from '@config/mail';

import IStorageProvider from '@shared/providers/models/IStorageProvider';
import DiskStorageProvider from '@shared/providers/implementations/DiskStorageProvider';

import IMailProvider from '@shared/providers/models/IMailProvider';
import EtherealMailProvider from '@shared/providers/implementations/EtherealMailProvider';
import SESMailProvider from '@shared/providers/implementations/SESMailProvider';

import IMailTemplateProvider from '@shared/providers/models/IMailTemplateProvider';
import HandlebarsMailTemplateProvider from '@shared/providers/implementations/HandlebarsMailTemplateProvider';

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  DiskStorageProvider,
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
