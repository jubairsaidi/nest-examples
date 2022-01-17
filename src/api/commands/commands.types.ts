export enum ExampleCommandArguments {
  plain = 'plain',
  nats = 'nats',
  http = 'http'
}

export interface CommandOptions {
  timestamp: number;
  verbose?: boolean;
}
