import { ConsoleLogger, Controller, Post } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class ServiceController {
  constructor(private readonly logger: ConsoleLogger) {
    this.logger.setContext(this.constructor.name);
  }
  @Post('basic-response')
  @MessagePattern('basic-response')
  async actionMethod(@Payload() payload) {
    return payload;
  }
}
