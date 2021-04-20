import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthcheckController {
  @Get('/status')
  status(): string {
    return 'Healthy';
  }
}
