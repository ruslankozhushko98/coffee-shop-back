import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from 'src/auth/entities';
import { Beverage } from './entities';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';

@Module({
  imports: [TypeOrmModule.forFeature([Beverage, User])],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
