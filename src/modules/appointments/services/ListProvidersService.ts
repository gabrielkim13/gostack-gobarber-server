import { injectable, inject } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import ICacheProvider from '@shared/providers/models/ICacheProvider';

interface IRequest {
  user_id: string;
}

@injectable()
class ListProvidersService {
  constructor(
    @inject('UsersRepository')
    private usersRespository: IUsersRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ user_id }: IRequest): Promise<User[]> {
    let providers = await this.cacheProvider.recover<User[]>(
      `list-providers:${user_id}`,
    );

    if (!providers) {
      providers = await this.usersRespository.findAllProviders({
        except_user_id: user_id,
      });

      await this.cacheProvider.save(`list-providers:${user_id}`, providers);
    }

    return providers;
  }
}

export default ListProvidersService;
