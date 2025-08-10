import { Module } from '@nestjs/common';

import { SpinModule } from './spin/spin.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    SpinModule,
    PrismaModule,
  ],
})
export class AppModule {}
