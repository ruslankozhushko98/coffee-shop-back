import { CheckUserMiddleware } from './check-user.middleware';

describe('CheckUserMiddleware', () => {
  it('should be defined', () => {
    expect(new CheckUserMiddleware()).toBeDefined();
  });
});
