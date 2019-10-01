import { Injectable } from '@angular/core';
import { Item } from '../types';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { BorrowedAppConstants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class LocalNotificationsManagerService {

  overDueItemPresent: boolean = false;
  itemNeedsAttention: boolean = false;

  constructor(
    private _localNotifications: LocalNotifications
  ) {
  }

  handleLocalNotifications(items: Item[]) {
    const today = new Date();
    let earliestExpectedDate: Date = new Date();

    items.forEach(item => {
      if (item.isActive) {
        const expectedReturnDate = new Date(item.expectedReturnDate);

        if (expectedReturnDate < today) {
          this.overDueItemPresent = true;
        } else {
          expectedReturnDate.setDate(expectedReturnDate.getDate() - 1);
          if (earliestExpectedDate > expectedReturnDate) {
            earliestExpectedDate = new Date(expectedReturnDate.getTime());
            this.itemNeedsAttention = true;
          }
        }
      }
    });

    earliestExpectedDate.setHours(10, 0, 0);

    if (this.itemNeedsAttention) {
      if (today >= earliestExpectedDate) {
        today.setTime(new Date().getTime() + 10 * 1000);
        this.createLocalNotification(BorrowedAppConstants.ITEM_ATTENTION_NOTIFICATION, today, "Return date is approaching for your items.");
      } else {
        this.createLocalNotification(BorrowedAppConstants.ITEM_ATTENTION_NOTIFICATION, earliestExpectedDate, "Return date is approaching for your items.");
      }
    } else {
      this.cancelNotification(BorrowedAppConstants.ITEM_ATTENTION_NOTIFICATION)
    }

    today.setTime(new Date().getTime() + 10 * 1000);
    if (this.overDueItemPresent) {
      this.createLocalNotification(BorrowedAppConstants.ITEM_OVERDUE_NOTIFICATION, today, "Oops.. You have Overdue items.");
    } else {
      this.cancelNotification(BorrowedAppConstants.ITEM_OVERDUE_NOTIFICATION)
    }
  }

  cancelNotification(notificationId: number) {
    this._localNotifications.cancel(notificationId);
    console.log("notification cancelled for", notificationId);
  }

  createLocalNotification(notificationId: number, scheduleAt: Date, text: string) {
    this._localNotifications.isScheduled(notificationId).then((isScheduled) => {
      if (isScheduled) {
        this._localNotifications.update({
          id: notificationId,
          title: 'Reminder from Borrowing',
          foreground: true,
          trigger: { at: scheduleAt },
          text: text,
        });
      } else {
        this._localNotifications.schedule({
          id: notificationId,
          title: 'Reminder from Borrowing',
          foreground: true,
          trigger: { at: scheduleAt },
          text: text,
        });
      }
      console.log("notification scheduled at :", scheduleAt.toISOString());
    }).catch(error => {
      console.error(error);
    });
  }
}
