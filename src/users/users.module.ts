import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entity/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User])], // Registra la entidad User
    providers: [UsersService], // Proveedor del servicio
    exports: [UsersService], // Exporta el servicio para otros módulos
})
export class UsersModule { }
