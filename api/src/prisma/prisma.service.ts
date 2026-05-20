import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

import {Pool} from 'pg'
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  
  constructor() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('Prisma connected');
  }

  async enableShutdownHooks() {
    (this as any).$on('beforeExit', async () => {
      await this.$disconnect();
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
