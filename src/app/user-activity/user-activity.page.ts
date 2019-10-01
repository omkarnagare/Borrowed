import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { trigger, state, transition, style, animate } from '@angular/animations';
import { ActivitiesService } from '../services/activities.service';
import { Activity, MonthlyActivities } from '../types';
import { Utils } from '../utils';

@Component({
  selector: 'app-user-activity',
  templateUrl: './user-activity.page.html',
  styleUrls: ['./user-activity.page.scss'],
  animations: [
    trigger('fadein', [
      state('void', style({ opacity: 0 })),
      transition('void => *', [
        style({ opacity: 0 }),
        animate('600ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('slidelefttitle', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateX(-150%)' }),
        animate('600ms 200ms ease-out', style({ transform: 'translateX(0%)', opacity: 1 }))
      ])
    ]),
    trigger('sliderighttitle', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateX(+150%)' }),
        animate('600ms 200ms ease-out', style({ transform: 'translateX(0%)', opacity: 1 }))
      ])
    ]),
    trigger('slidetoptitle', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(-150%)' }),
        animate('600ms 200ms ease-out', style({ transform: 'translateY(0%)', opacity: 1 }))
      ])
    ]),
    trigger('slidebottomtitle', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(+150%)' }),
        animate('600ms 200ms ease-out', style({ transform: 'translateY(0%)', opacity: 1 }))
      ])
    ])
  ]
})
export class UserActivityPage implements OnInit, OnDestroy {

  monthlyActivities: MonthlyActivities[] = null;
  activities$: Subscription;

  icons: string[] = ["american-football", "baseball", "basketball", "football", "tennisball"];

  constructor(
    private _activitiesService: ActivitiesService,
    private _utils: Utils
  ) {
  }

  fetchIcon(index: number): string {
    return this.icons[index % this.icons.length];
  }

  ngOnInit() {
    this.activities$ = this._activitiesService.getActivities().subscribe((data) => {
      console.log("activities", data);
      this.processActivities([...data]);
    });
  }

  processActivities(activities: Activity[]) {
    this.monthlyActivities = [];
    activities.forEach(activity => {
      const monthlyTimeline = this._utils.getMonthlyTimeline(new Date(activity.activityDate));
      const monthlyActivity = this.monthlyActivities.find((monthlyActivity) => {
        return monthlyActivity.monthlyTimeline === monthlyTimeline;
      });
      if (monthlyActivity) {
        monthlyActivity.activities.push(activity);
      } else {
        const newMonthlyActivity = {
          monthlyTimeline: monthlyTimeline,
          activities: [
            activity
          ]
        }
        this.monthlyActivities.push(newMonthlyActivity);
      }
    });

  }

  ionViewDidEnter() {
  }

  ngOnDestroy() {
    if (this.activities$) {
      this.activities$.unsubscribe();
      this.activities$ = null;
    }
    this.monthlyActivities = null;
  }

}
