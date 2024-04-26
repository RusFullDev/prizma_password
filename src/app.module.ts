import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [ ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }), PrismaModule, AuthModule,],
  controllers: [],
  providers: [],
})
export class AppModule {}
