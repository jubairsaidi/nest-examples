import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { firstValueFrom, from } from 'rxjs';

import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';

import { MessagingConfigService } from './messaging.config';

@Injectable()
export class MessagingService {
  private eventsClient: ClientProxy;
  private reqClient: AxiosInstance;
  constructor(private readonly configService: MessagingConfigService) {
    this.eventsClient = ClientProxyFactory.create(this.configService.eventsConfig);
    this.reqClient = axios.create();
  }

  send<R, I = unknown>(pattern: string, data: I) {
    return this.eventsClient.send<R, I>(pattern, data);
  }

  async sendAsync<R, I = unknown>(pattern: string, payload: I) {
    return await firstValueFrom(this.send<R, I>(pattern, payload));
  }

  emit<R, I = unknown>(pattern: string, data: I) {
    return this.eventsClient.emit<R, I>(pattern, data);
  }

  async emitAsync<R, I = unknown>(pattern: string, data: I) {
    return await firstValueFrom(this.emit<R, I>(pattern, data));
  }

  sendHttp<R, I>(url: string, data: I) {
    return from(this.sendHttpAsync<R, I>(url, data));
  }

  async sendHttpAsync<R, I = unknown>(url: string, payload: I) {
    const { data } = await this.reqClient.post<I, AxiosResponse<R>>(url, payload);
    return data;
  }
}
