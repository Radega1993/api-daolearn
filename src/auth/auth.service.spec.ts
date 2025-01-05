import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(),
      createUser: jest.fn(),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('mocked-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should validate and return user data when credentials are valid', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'Student',
        createdAt: new Date(),
      }; // Mock completo
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await authService.validateUser('test@example.com', 'password');
      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
        role: 'Student',
        createdAt: expect.any(Date),
      });
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);

      await expect(authService.validateUser('test@example.com', 'password')).rejects.toThrow(
        'Invalid credentials',
      );
    });
  });

  describe('login', () => {
    it('should return a JWT token', async () => {
      const mockUser = { email: 'test@example.com', role: 'Student' };
      const result = await authService.login(mockUser);

      expect(result).toEqual({ access_token: 'mocked-jwt-token' });
      expect(jwtService.sign).toHaveBeenCalledWith({ email: mockUser.email, role: mockUser.role });
    });
  });

  describe('register', () => {
    it('should create a new user if email is not taken', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(usersService, 'createUser').mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'Student',
        createdAt: new Date(),
      });

      const result = await authService.register('test@example.com', 'password', 'Student');

      expect(result.email).toEqual('test@example.com');
      expect(usersService.createUser).toHaveBeenCalledWith('test@example.com', expect.any(String), 'Student');
    });

    it('should throw an error if the user already exists', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'Student',
        createdAt: new Date(),
      });

      await expect(authService.register('test@example.com', 'password', 'Student')).rejects.toThrow(
        'User already exists',
      );
    });
  });
});
