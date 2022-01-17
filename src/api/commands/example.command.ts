import * as Joi from 'joi';
import { Command, CommandRunner, Option } from 'nest-commander';
import { ConfigService } from 'src/config/config.service';

import { ConsoleLogger } from '@nestjs/common';

import { MessagingService } from '../../messaging/messaging.service';
import { CommandOptions, ExampleCommandArguments } from './commands.types';

@Command({
  name: 'example',
  arguments: '<action>',
  description: 'Example command usage'
})
export class ExampleCommand implements CommandRunner {
  constructor(
    private readonly logger: ConsoleLogger,
    private readonly configService: ConfigService,
    private readonly messagingService: MessagingService
  ) {}

  private schema: Joi.ArraySchema = Joi.array()
    .length(1)
    .items(Joi.string().valid(...Object.values(ExampleCommandArguments)))
    .options({ stripUnknown: { arrays: true, objects: true } });

  async run(inputs: string[], options: CommandOptions) {
    options.timestamp = Date.now();
    this.logger.setContext(this.constructor.name);

    const action = this.validate(inputs);
    const servicePort = this.configService.get('SERVICE_PORT');
    let result = 'action not specified';

    try {
      switch (action) {
        case ExampleCommandArguments.plain:
          this.logger.log({ test: 'simple response' });
          break;

        case ExampleCommandArguments.nats:
          result = await this.messagingService.sendAsync('basic-response', {
            test: 'response from nats request'
          });
          break;

        case ExampleCommandArguments.http:
          result = await this.messagingService.sendHttpAsync(`http://localhost:${servicePort}/basic-response`, {
            test: 'response from http request'
          });
          break;

        default:
          this.logger.error('action not specified');
          break;
      }
      this.logger.log(result);
    } catch (error) {
      this.logger.error(error);
    }
  }

  @Option({
    flags: '-v, --verbose',
    description: 'verbose logging output'
  })
  parseVerbose(val: boolean): boolean {
    return val;
  }

  private validate(config: string[]): ExampleCommandArguments {
    const { error, value } = this.schema.validate(config);
    if (error) {
      const errorMessage = `Arguments validation error: ${error.message}`;
      this.logger.error(errorMessage);
      throw new Error(errorMessage);
    }
    const [action] = value;
    return action;
  }
}
