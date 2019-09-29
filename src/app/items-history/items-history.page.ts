import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { trigger, state, transition, style, animate } from '@angular/animations';
import { ActivitiesService } from '../services/activities.service';
import { Activity } from '../types';

@Component({
  selector: 'app-items-history',
  templateUrl: './items-history.page.html',
  styleUrls: ['./items-history.page.scss'],
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
export class ItemsHistoryPage implements OnInit, OnDestroy {

  activities: Activity[] = null;
  activities$: Subscription;

  icons: string[] = ["american-football", "baseball", "basketball", "football", "tennisball"];

  constructor(
    private _activitiesService: ActivitiesService
  ) {
  }

  fetchIcon(index: number): string {
    return this.icons[index % this.icons.length];
  }

  ngOnInit() {
    this.activities$ = this._activitiesService.getActivities().subscribe((data) => {
      console.log("activities", data);
      this.activities = [...data];
    });
  }

  ionViewDidEnter() {
  }

  ngOnDestroy() {
    if (this.activities$) {
      this.activities$.unsubscribe();
      this.activities$ = null;
    }
    this.activities = null;
  }

}
