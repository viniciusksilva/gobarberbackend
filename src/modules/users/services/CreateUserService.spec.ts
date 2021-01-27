import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUserRepository';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeUsersRespository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateUser', () => {

    beforeEach(() => {
        fakeUsersRespository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        fakeCacheProvider = new FakeCacheProvider();
        createUser = new CreateUserService(fakeUsersRespository, fakeHashProvider,fakeCacheProvider);
    });

    it('should be able to create a new user', async () => {

        const user = await createUser.execute({
         name: 'John Connor',
         email: 'johnconnor@example.com',
         password: '123456'
        });

        expect(user).toHaveProperty('id');
    });

    it('should not be able to create a new user with the same email from another', async () => {

       await createUser.execute({
         name: 'John Connor',
         email: 'johnconnor@example.com',
         password: '123456'
        });

        await expect(createUser.execute({
            name: 'John Connor',
            email: 'johnconnor@example.com',
            password: '123456'
           })).rejects.toBeInstanceOf(AppError);
    });

});
