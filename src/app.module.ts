import { ConsoleLogger, Module } from '@nestjs/common';

import { ApiModule } from './api/api.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { MessagingModule } from './messaging/messaging.module';

@Module({
  imports: [ConfigModule, MessagingModule, ApiModule],
  controllers: [AppController],
  providers: [AppService, ConsoleLogger]
})
export class AppModule {}
