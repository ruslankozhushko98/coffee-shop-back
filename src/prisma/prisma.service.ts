import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

import { ENV_VARS } from 'src/shared/utils/constants';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get(ENV_VARS.DATABASE_URL),
        },
      },
    });
  }
}
