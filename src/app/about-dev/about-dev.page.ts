import { Component, OnInit } from '@angular/core';

import { trigger, state, transition, style, animate } from '@angular/animations';
import { AdmobAdsService } from '../services/admob-ads.service';

@Component({
  selector: 'app-about-dev',
  templateUrl: './about-dev.page.html',
  styleUrls: ['./about-dev.page.scss'],
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
export class AboutDevPage implements OnInit {

  showAboutDevPage: boolean = false;

  constructor(
    private _admobService: AdmobAdsService
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.showAboutDevPage = true;
    this._admobService.showInterStitialAd();
  }

  ionViewWillLeave() {
    this.showAboutDevPage = false;
  }

}
