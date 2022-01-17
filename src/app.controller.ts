import { ConsoleLogger, Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { AppService } from './app.service';
import { StatusResponse } from './app.status-response.dto';

@Controller()
export class AppController {
  constructor(private readonly logger: ConsoleLogger, private readonly appService: AppService) {
    this.logger.setContext(this.constructor.name);
  }

  @Get('status')
  @MessagePattern('status')
  getServiceStatus(): StatusResponse {
    return this.appService.getStatus();
  }
}
