import { container } from 'tsyringe';

import IStorageProvider from '@shared/providers/models/IStorageProvider';
import DiskStorageProvider from '@shared/providers/implementations/DiskStorageProvider';

import IMailProvider from '@shared/providers/models/IMailProvider';
import EtherealMailProvider from '@shared/providers/implementations/EtherealMailProvider';

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

container.registerInstance<IMailProvider>(
  'MailProvider',
  container.resolve(EtherealMailProvider),
);
