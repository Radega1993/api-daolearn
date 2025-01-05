// src/auth/auth.service.ts
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        throw new UnauthorizedException('Invalid credentials');
    }

    async login(user: any) {
        const payload = { email: user.email, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(email: string, password: string, role: string) {
        const existingUser = await this.usersService.findByEmail(email);
        if (existingUser) {
            throw new UnauthorizedException('User already exists');
        }
        return this.usersService.createUser(email, password, role);
    }

    async forgotPassword(email: string): Promise<{ message: string }> {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Lógica para enviar correo (simulado por ahora)
        console.log(`Enviar correo de recuperación a ${email}`);
        return { message: 'Password recovery instructions sent to your email' };
    }
}
