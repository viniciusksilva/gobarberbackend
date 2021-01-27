import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import ListProvidersService from './ListProvidersService';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeUsersRespository: FakeUsersRepository;
let listProviders: ListProvidersService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviders', () => {

    beforeEach(() => {
        fakeUsersRespository = new FakeUsersRepository();
        fakeCacheProvider = new FakeCacheProvider();

        listProviders = new ListProvidersService(
            fakeUsersRespository, fakeCacheProvider
        );
    });

    it('should be able to list providers', async () => {
        const user1 = await fakeUsersRespository.create({
         name: 'John Connor',
         email: 'johnconnor@example.com',
         password: '123456'
        });

        const user2 = await fakeUsersRespository.create({
            name: 'John Tche',
            email: 'johntche@example.com',
            password: '123456'
        });

        const loggedUser = await fakeUsersRespository.create({
            name: 'John Qua',
            email: 'johnqua@example.com',
            password: '123456'
        });

        const providers = await listProviders.execute({
            user_id: loggedUser.id,
        });

        expect(providers).toEqual([user1, user2]);

    });

});
