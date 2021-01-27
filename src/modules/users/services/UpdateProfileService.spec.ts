import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUserRepository';
import UpdateProfileService from './UpdateProfileService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';


let fakeUsersRespository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {

    beforeEach(() => {
        fakeUsersRespository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        updateProfile = new UpdateProfileService(
            fakeUsersRespository,
            fakeHashProvider
        );
    });

    it('should be able update the profile', async () => {
        const user = await fakeUsersRespository.create({
         name: 'John Connor',
         email: 'johnconnor@example.com',
         password: '123456'
        });

        const updateUser = await updateProfile.execute({
            user_id: user.id,
            name: 'John Carpenter',
            email: 'johncarpenter@example.com',
        });

        expect(updateUser.name).toBe('John Carpenter');
        expect(updateUser.email).toBe('johncarpenter@example.com');
    });

    it('should not be able to change to another user email', async () => {
        await fakeUsersRespository.create({
            name: 'John Connor',
            email: 'johnconnor@example.com',
            password: '123456'
        });

        const user = await fakeUsersRespository.create({
            name: 'Test',
            email: 'test@example.com',
            password: '123456'
        });

        await expect(updateProfile.execute({
            user_id: user.id,
            name: 'John Connor',
            email: 'johnconnor@example.com',
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should be able update the password', async () => {
        const user = await fakeUsersRespository.create({
         name: 'John Connor',
         email: 'johnconnor@example.com',
         password: '123456'
        });

        const updateUser = await updateProfile.execute({
            user_id: user.id,
            name: 'John Carpenter',
            email: 'johncarpenter@example.com',
            old_password: '123456',
            password: '123123'
        });

        expect(updateUser.password).toBe('123123');
    });

    it('should not be able to update the password without old password', async () => {
        const user = await fakeUsersRespository.create({
         name: 'John Connor',
         email: 'johnconnor@example.com',
         password: '123456'
        });

        await expect(updateProfile.execute({
            user_id: user.id,
            name: 'John Carpenter',
            email: 'johncarpenter@example.com',
            password: '123123'
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update the password with wrong old password', async () => {
        const user = await fakeUsersRespository.create({
         name: 'John Connor',
         email: 'johnconnor@example.com',
         password: '123456'
        });

        await expect(updateProfile.execute({
            user_id: user.id,
            name: 'John Carpenter',
            email: 'johncarpenter@example.com',
            old_password: 'wrong_old_password',
            password: '123123'
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able update the profile from non-existing user', async () => {
        expect(updateProfile.execute({
            user_id: 'non-existing-id',
            name: 'Test',
            email: 'test@example.com',
        })).rejects.toBeInstanceOf(AppError);
    });

});
