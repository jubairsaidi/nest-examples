import { useContainer } from 'class-validator';
import * as helmet from 'helmet';

import {
  ClassSerializerInterceptor,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { AppConfig, ConfigService } from './config/config.service';
import { MessagingConfigService } from './messaging/messaging.config';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const rateLimit = require('express-rate-limit');

Error.stackTraceLimit = Infinity;

async function createApp() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  return app;
}

function applyValidators(app: NestExpressApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]) => new UnprocessableEntityException(errors, 'Validation Error')
    })
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
}

function addSwaggerDocs(app: NestExpressApplication, serviceName: string) {
  const options = new DocumentBuilder()
    .setTitle('Nest.js Example Service')
    .setDescription('A microservice example using Nest.js')
    .setVersion('1.0')
    .addTag(serviceName)
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);
}

function applySecurity(app: NestExpressApplication, appConfig: AppConfig) {
  app.enableCors(appConfig.corsOptions);

  app.use(helmet.contentSecurityPolicy());
  app.use(helmet.crossOriginEmbedderPolicy());
  app.use(helmet.crossOriginOpenerPolicy());
  app.use(helmet.crossOriginResourcePolicy());
  app.use(helmet.dnsPrefetchControl());
  app.use(helmet.expectCt());
  app.use(helmet.frameguard());
  app.use(helmet.hidePoweredBy());
  app.use(helmet.hsts());
  app.use(helmet.ieNoOpen());
  app.use(helmet.noSniff());
  app.use(helmet.originAgentCluster());
  app.use(helmet.permittedCrossDomainPolicies());
  app.use(helmet.referrerPolicy());
  app.use(helmet.xssFilter());

  app.use(rateLimit(appConfig.rateLimit));
}

async function startApp(app: NestExpressApplication, servicePort: number) {
  const messagingConfigService = app.get(MessagingConfigService);

  app.connectMicroservice(messagingConfigService.eventsConfig);

  await app.startAllMicroservices();
  await app.listen(servicePort);
}

async function bootstrap() {
  const app = await createApp();
  const configService = app.get(ConfigService);
  const serviceName = configService.get('SERVICE_NAME');
  const appConfig = configService.get('APP_CONFIG');
  const servicePort = configService.get('SERVICE_PORT');

  applyValidators(app);
  addSwaggerDocs(app, serviceName);
  applySecurity(app, appConfig);

  await startApp(app, servicePort);
}

bootstrap();
