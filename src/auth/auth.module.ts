import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[JwtModule.register({}), PrismaModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
