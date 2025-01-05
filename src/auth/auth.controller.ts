// src/auth/auth.controller.ts
import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() body: { email: string; password: string }) {
        const user = await this.authService.validateUser(body.email, body.password);
        return this.authService.login(user);
    }

    @Post('register')
    async register(@Body() body: { email: string; password: string; role: string }) {
        return this.authService.register(body.email, body.password, body.role);
    }

    @Post('forgot-password')
    async forgotPassword(@Body() body: { email: string }) {
        // Implementar lógica para envío de correo electrónico
        return { message: 'Password recovery instructions sent to your email' };
    }
}
