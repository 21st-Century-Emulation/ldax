import { Module } from '@nestjs/common';
import { ExecuteController } from './execute.controller';
import { HealthcheckController } from './healthcheck.controller';

@Module({
  imports: [],
  controllers: [ExecuteController, HealthcheckController],
})
export class AppModule {}
