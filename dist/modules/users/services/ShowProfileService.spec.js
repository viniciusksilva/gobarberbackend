"use strict";

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _FakeUserRepository = _interopRequireDefault(require("../repositories/fakes/FakeUserRepository"));

var _ShowProfileService = _interopRequireDefault(require("./ShowProfileService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeUsersRespository;
let showProfile;
describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRespository = new _FakeUserRepository.default();
    showProfile = new _ShowProfileService.default(fakeUsersRespository);
  });
  it('should be able show the profile', async () => {
    const user = await fakeUsersRespository.create({
      name: 'John Connor',
      email: 'johnconnor@example.com',
      password: '123456'
    });
    const profile = await showProfile.execute({
      user_id: user.id
    });
    expect(profile.name).toBe('John Connor');
    expect(profile.email).toBe('johnconnor@example.com');
  });
  it('should not be able show the profile from non-existing user', async () => {
    expect(showProfile.execute({
      user_id: 'non-existing-id'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});