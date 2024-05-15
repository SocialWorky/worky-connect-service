import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WorkyNotificationsModule } from './worky-notifications/worky-notifications.module';

@Module({
  imports: [WorkyNotificationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
