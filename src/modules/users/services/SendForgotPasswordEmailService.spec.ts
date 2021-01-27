import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUserRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';

let fakeUsersRespository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;
let fakeUserTokensRepository: FakeUserTokensRepository;

describe('SendForgotPasswordEmail', () => {

    beforeEach(() => {
        fakeUsersRespository = new FakeUsersRepository();
        fakeMailProvider = new FakeMailProvider();
        fakeUserTokensRepository = new FakeUserTokensRepository();

        sendForgotPasswordEmail = new SendForgotPasswordEmailService(
            fakeUsersRespository,
            fakeMailProvider,
            fakeUserTokensRepository
        );
    });

    it('should be able to recorver the password using the email', async () => {

        const sendEmail = jest.spyOn(fakeMailProvider, 'sendMail');

        await fakeUsersRespository.create({
         name: 'John Connor',
         email: 'johnconnor@example.com',
         password: '123456'
        });

        await sendForgotPasswordEmail.execute({
            email: 'johnconnor@example.com',
        })

        expect(sendEmail).toHaveBeenCalled();
    });

    it('should be able to recorver a non-existing user password', async () => {

        await expect(sendForgotPasswordEmail.execute({
            email: 'johnconnor@example.com',
        })).rejects.toBeInstanceOf(AppError);

    });

    it('should generate a forgot password token', async () => {

        const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

        const user = await fakeUsersRespository.create({
         name: 'John Connor',
         email: 'johnconnor@example.com',
         password: '123456'
        });

        await sendForgotPasswordEmail.execute({
            email: 'johnconnor@example.com',
        })

        expect(generateToken).toHaveBeenCalledWith(user.id);
    });
});
