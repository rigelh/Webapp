import { Observable, from, map } from 'rxjs';
import { Createnotifications } from './dtos/ceate-notifications.dto';
import { notifications } from './notifications.entity';
import { notificationsService } from './notifications.servis';
import { Body, Controller, Get, Post, Res, Sse } from '@nestjs/common';

@Controller('notifications')
export class notificationsController {
  constructor(private readonly notificationsService: notificationsService) {}

  @Post()
  async create(@Body() dto: Createnotifications): Promise<notifications> {
    const generator = this.notificationsService.createWithGenerator(dto);
    for await (const notifications of generator) {
      return notifications;
    }
  }
  //
  @Sse() // sse dekorator => ndryshon route / addinbg auth / changing headers
  sse(): Observable<MessageEvent> {
    // sse method shtojm observable , eror handling etj
    // calling observable with the DOM API class that stimulates SSE
    const generator = this.notificationsService.getWithGenerator();

    return from(generator).pipe(
      map(function (notification) {
        return new MessageEvent('message', {
          data: JSON.stringify(notification),
        });
      }),
    );
  }
}
