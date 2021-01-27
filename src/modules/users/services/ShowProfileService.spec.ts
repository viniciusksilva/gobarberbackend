import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUserRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRespository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('UpdateProfile', () => {

    beforeEach(() => {
        fakeUsersRespository = new FakeUsersRepository();

        showProfile = new ShowProfileService(
            fakeUsersRespository,
        );
    });

    it('should be able show the profile', async () => {
        const user = await fakeUsersRespository.create({
         name: 'John Connor',
         email: 'johnconnor@example.com',
         password: '123456'
        });

        const profile = await showProfile.execute({
            user_id: user.id,
        });

        expect(profile.name).toBe('John Connor');
        expect(profile.email).toBe('johnconnor@example.com');
    });

    it('should not be able show the profile from non-existing user', async () => {
        expect(showProfile.execute({
            user_id: 'non-existing-id',
        })).rejects.toBeInstanceOf(AppError);
    });

});
