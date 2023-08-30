import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from '../notification.service';
import { Notification } from "../notification";

@Component({
  selector: 'app-notification-layout',
  templateUrl: './notification-layout.component.html',
  styleUrls: ['./notification-layout.component.css']
})
export class NotificationLayoutComponent implements OnInit {

  notification?: Notification;
  private subscription!: Subscription;
  timer: any;

  constructor(private notificationService: NotificationService) { }

  private addNotification(notification: Notification) {
    this.notification = notification;

    if (notification.timeout !== 0) {
      this.timer = setTimeout(() => {
        this.close()
      }, notification.timeout);
    }
  }

  ngOnInit() {
    this.subscription = this.notificationService.getObservable().subscribe(notification => {
      clearTimeout(this.timer);
      this.addNotification(notification);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  close() {
    this.notification = undefined;
  }
}
