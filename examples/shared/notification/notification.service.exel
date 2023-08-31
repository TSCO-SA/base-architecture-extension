import { Injectable } from '@angular/core';
import { Subject, Observable } from "rxjs";
import { Notification, NotificationType } from "./notification";

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

  private subject = new Subject<Notification>();
  private index = 0;

  constructor() { }

  getObservable(): Observable<Notification> {
    return this.subject.asObservable();
  }

  info(message: string, timeout = 3000) {
    this.subject.next(new Notification(this.index++, NotificationType.info, message, timeout, 'rgba(31, 100, 180, 0.9)', '#fff'));
  }

  success(message: string, timeout = 3000) {
    this.subject.next(new Notification(this.index++, NotificationType.success, message, timeout, 'rgba(60, 161, 107, 0.9)', '#fff'));
  }

  warning(message: string, timeout = 3000) {
    this.subject.next(new Notification(this.index++, NotificationType.warning, message, timeout, 'rgba(255, 153, 51, 0.9)', '#fff'));
  }

  error(message: string, timeout = 4000) {
    this.subject.next(new Notification(this.index++, NotificationType.error, message, timeout, 'rgba(217, 83, 79, 0.9)', '#fff'));
  }

  custom(message: string, timeout = 3000, bgColor: string, textColor: string){
    this.subject.next(new Notification(this.index++, NotificationType.error, message, timeout, bgColor, textColor));
  }

}