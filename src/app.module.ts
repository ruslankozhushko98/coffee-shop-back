import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { config } from 'dotenv';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { EmailModule } from './email/email.module';
import { AccountModule } from './account/account.module';
import { MenuModule } from './menu/menu.module';
import { CheckUserMiddleware } from './check-user/check-user.middleware';
import { ProfileModule } from './profile/profile.module';
import { AppDataSource } from './data-source';

config();

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
    OrdersModule,
    EmailModule,
    AccountModule,
    MenuModule,
    ProfileModule,
    TypeOrmModule.forRoot({
      ...AppDataSource.options,
      autoLoadEntities: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CheckUserMiddleware).forRoutes('menu/:beverageId');
  }
}
