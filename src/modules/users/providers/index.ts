import { container } from 'tsyringe';

import IHashProvider from '@modules/users/providers/models/IHashProvider';
import BCryptHashProvider from '@modules/users/providers/implementations/BCryptHashProvider';

container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);
