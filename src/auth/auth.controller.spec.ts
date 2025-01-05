import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: Partial<AuthService>;

  beforeEach(async () => {
    authService = {
      validateUser: jest.fn().mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        role: 'Student',
        createdAt: new Date(),
      }),
      login: jest.fn().mockResolvedValue({ access_token: 'mocked-jwt-token' }),
      register: jest.fn().mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        role: 'Student',
        createdAt: new Date(),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should call authService.login and return a token', async () => {
      const body = { email: 'test@example.com', password: 'password' };

      const result = await authController.login(body);

      expect(authService.validateUser).toHaveBeenCalledWith(body.email, body.password);
      expect(authService.login).toHaveBeenCalledWith({
        id: 1,
        email: 'test@example.com',
        role: 'Student',
        createdAt: expect.any(Date),
      });
      expect(result).toEqual({ access_token: 'mocked-jwt-token' });
    });
  });

  describe('register', () => {
    it('should call authService.register and return user data', async () => {
      const body = { email: 'test@example.com', password: 'password', role: 'Student' };

      const result = await authController.register(body);

      expect(authService.register).toHaveBeenCalledWith(body.email, body.password, body.role);
      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
        role: 'Student',
        createdAt: expect.any(Date),
      });
    });
  });
});
