import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthenticationService } from './authentication.service';
import { BorrowedAppConstants, UserActivityType } from '../constants';
import { Activity, Item } from '../types';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Utils } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {

  collectionRef: AngularFirestoreCollection;

  constructor(
    private _angularFirestore: AngularFirestore,
    private _authenticationService: AuthenticationService,
    private _utils: Utils
  ) {
    this.collectionRef = this._angularFirestore
      .collection(BorrowedAppConstants.ACTIVITIES_COLLECTION)
      .doc(this._authenticationService.getCurrentUserId())
      .collection(BorrowedAppConstants.ACTIVITIES_COLLECTION);
  }

  constructMessage(itemDetails: Item, activityType: UserActivityType): string {
    switch (activityType) {
      case UserActivityType.ITEM_ADD:
        return "You " + (itemDetails.transactionType === "lent" ? "lent " : "borrowed ") + itemDetails.itemName.toUpperCase() + (itemDetails.transactionType === "lent" ? " to " : " from ") + itemDetails.personName.toUpperCase() + this.getFormattedDateExpression() + " which is of " + itemDetails.importance.toUpperCase() + " importance.";
      case UserActivityType.ITEM_UPDATE:
        return "You updated details for " + itemDetails.itemName.toUpperCase() + this.getFormattedDateExpression() + ".";
      case UserActivityType.ITEM_TRANSACTION_COMPLETE:
        return "You " + (itemDetails.transactionType === "lent" ? "got back " : "returned ") + itemDetails.itemName.toUpperCase() + (itemDetails.transactionType === "lent" ? " from " : " to ") + itemDetails.personName.toUpperCase() + this.getFormattedDateExpression() + " which was of " + itemDetails.importance.toUpperCase() + " importance.";
      case UserActivityType.ITEM_DELETE:
        return "You permanently deleted " + itemDetails.itemName.toUpperCase() + this.getFormattedDateExpression() + " from Borrowing.";
    }
  }

  getFormattedDateExpression(): string {
    const eventDate = new Date();
    return " on " + eventDate.getDate() + " " + this._utils.getMonthString(eventDate) + ", " + eventDate.getFullYear() + " at " + eventDate.getHours() + ":" + eventDate.getMinutes();
  }

  addActivity(itemDetails: Item, activityType: UserActivityType): Promise<any> {
    const activity: Activity = {
      activityDetails: this.constructMessage(itemDetails, activityType),
      activityDate: this._utils.today()
    }
    return this.collectionRef.add(activity);
  }

  getActivities(): Observable<any> {
    return this.collectionRef.snapshotChanges().pipe(
      map(actions => {
        const activities = actions.map(action => ({ activityId: action.payload.doc.id, ...action.payload.doc.data() }));

        return activities.sort(
          (activity1, activity2) => {
            return new Date(activity2["activityDate"]).getTime() - new Date(activity1["activityDate"]).getTime();
          }
        );
      })
    );
  }
}
