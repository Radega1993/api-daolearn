import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CoursesModule } from './courses/courses.module';
import { UsersModule } from './users/users.module';
import { SectionsModule } from './sections/sections.module';
import { FilesModule } from './files/files.module';
import { ConfigModule } from '@nestjs/config';
import { ProgressModule } from './progress/progress.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Asegúrate de que las variables de entorno estén cargadas
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'admin',
      password: process.env.DB_PASSWORD || 'admin',
      database: process.env.DB_NAME || 'plataforma',
      autoLoadEntities: true,
      synchronize: true, // Solo en desarrollo. Cambiar a false en producción.
    }),
    AuthModule, CoursesModule, UsersModule, SectionsModule, FilesModule, ProgressModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
