import { ConsoleLogger, Module } from '@nestjs/common';

import { MessagingModule } from '../messaging/messaging.module';
import { ExampleCommand } from './commands/example.command';
import { ServiceController } from './controllers/service.controller';

@Module({
  imports: [MessagingModule],
  controllers: [ServiceController],
  providers: [ConsoleLogger, ExampleCommand],
  exports: []
})
export class ApiModule {}
