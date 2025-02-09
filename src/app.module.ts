import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { JwtService } from '@nestjs/jwt';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { OrdersModule } from './modules/orders/orders.module';
import { EmailModule } from './email/email.module';
import { AccountModule } from './modules/account/account.module';
import { MenuModule } from './modules/menu/menu.module';
import { CheckUserMiddleware } from './common/middlewares/check-user/check-user.middleware';
import { ProfileModule } from './modules/profile/profile.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'assets'),
      serveRoot: '/assets',
    }),
    AuthModule,
    PrismaModule,
    OrdersModule,
    EmailModule,
    AccountModule,
    MenuModule,
    ProfileModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CheckUserMiddleware).forRoutes('menu/:beverageId');
  }
}
