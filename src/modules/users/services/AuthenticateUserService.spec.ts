import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUserRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

let fakeUsersRespository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {

    beforeEach(() => {
        fakeUsersRespository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        authenticateUser = new AuthenticateUserService(
            fakeUsersRespository,
            fakeHashProvider);
    });

    it('should be able to authenticate', async () => {

        const user = await fakeUsersRespository.create({
         name: 'John Connor',
         email: 'johnconnor@example.com',
         password: '123456'
        });

        const response = await authenticateUser.execute({
            email: 'johnconnor@example.com',
            password: '123456'
        });

        expect(response).toHaveProperty('token');
        expect(response.user).toEqual(user);
    });

    it('should not be able to authenticate with non existing user', async () => {

        await expect(authenticateUser.execute({
            email: 'johnconnor@example.com',
            password: '123456'
        })).rejects.toBeInstanceOf(AppError);

    });

    it('should not be able to authenticate with wrong password', async () => {

        await fakeUsersRespository.create({
            name: 'John Connor',
            email: 'johnconnor@example.com',
            password: '123456'
           });

        await expect(authenticateUser.execute({
            email: 'johnconnor@example.com',
            password: 'wrong-password'
        })).rejects.toBeInstanceOf(AppError);

    });

});
