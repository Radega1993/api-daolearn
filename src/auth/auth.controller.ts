import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @ApiResponse({ status: 200, description: 'Login successful.' })
    @ApiResponse({ status: 401, description: 'Invalid credentials.' })
    @ApiBody({ schema: { example: { email: 'user@example.com', password: 'password123' } } })
    async login(@Body() body: { email: string; password: string }) {
        const user = await this.authService.validateUser(body.email, body.password);
        const token = await this.authService.generateToken(user);
        return {
            message: 'Login successful',
            user: { id: user.id, email: user.email, role: user.role },
            token,
        };
    }

    @Post('register')
    @ApiResponse({ status: 201, description: 'User registered successfully.' })
    @ApiResponse({ status: 400, description: 'User already exists.' })
    @ApiBody({
        schema: {
            example: {
                email: 'user@example.com',
                password: 'password123',
                role: 'Student',
            },
        },
    })
    async register(@Body() body: { email: string; password: string; role: string }) {
        const newUser = await this.authService.register(body.email, body.password, body.role);
        const token = await this.authService.generateToken(newUser);
        return {
            message: 'User registered successfully',
            user: { id: newUser.id, email: newUser.email, role: newUser.role },
            token,
        };
    }

    @Post('forgot-password')
    @ApiResponse({ status: 200, description: 'Instrucciones de recuperación enviadas.' })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
    @ApiBody({ schema: { example: { email: 'user@example.com' } } })
    async forgotPassword(@Body() body: { email: string }) {
        return this.authService.forgotPassword(body.email);
    }

}
