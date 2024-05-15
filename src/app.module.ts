// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WorkyNotificationsModule } from './worky-notifications/worky-notifications.module';
import * as cors from 'cors';

@Module({
  imports: [WorkyNotificationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cors()).forRoutes('*');
  }
}
