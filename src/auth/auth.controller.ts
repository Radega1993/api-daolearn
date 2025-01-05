import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @ApiResponse({ status: 200, description: 'Inicio de sesión exitoso.' })
    @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
    @ApiBody({ schema: { example: { email: 'user@example.com', password: 'password123' } } })
    async login(@Body() body: { email: string; password: string }) {
        const user = await this.authService.validateUser(body.email, body.password);
        return this.authService.login(user);
    }

    @Post('register')
    @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente.' })
    @ApiResponse({ status: 400, description: 'El usuario ya existe.' })
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
        return this.authService.register(body.email, body.password, body.role);
    }

    @Post('forgot-password')
    @ApiResponse({ status: 200, description: 'Instrucciones de recuperación enviadas.' })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
    @ApiBody({ schema: { example: { email: 'user@example.com' } } })
    async forgotPassword(@Body() body: { email: string }) {
        return this.authService.forgotPassword(body.email);
    }
}
