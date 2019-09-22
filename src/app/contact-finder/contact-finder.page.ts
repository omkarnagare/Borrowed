import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ContactsService } from '../services/contacts.service';

import { trigger, state, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-contact-finder',
  templateUrl: './contact-finder.page.html',
  styleUrls: ['./contact-finder.page.scss'],
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
export class ContactFinderPage implements OnInit {

  contactsFound: any = null;

  constructor(
    private _contactsService: ContactsService,
    private _modalController: ModalController
  ) {

    // this.contactsFound = [
    //   {
    //     displayName: 'Temp ABCD 123',
    //     phoneNumbers: [{
    //       value: '+91 1312313234'
    //     },
    //     {
    //       value: '+91 3456234 892'
    //     },
    //     {
    //       value: '+91 3456234 891'
    //     },
    //     {
    //       value: '+91 3456234 832'
    //     }
    //     ],
    //     emails: [
    //       {
    //         value: 'abc@def.com'
    //       },
    //       {
    //         value: 'abc@def'
    //       },
    //       {
    //         value: 'abc'
    //       }
    //     ]
    //   },
    //   {
    //     displayName: 'Temp DEF',
    //     phoneNumbers: [{
    //       value: '+91 1312313234'
    //     },
    //     {
    //       value: '+91 3456234 892'
    //     },
    //     {
    //       value: '+91 3456234 891'
    //     },
    //     {
    //       value: '+91 3456234 832'
    //     }
    //     ],
    //     emails: [
    //       {
    //         value: 'abc@def.com'
    //       },
    //       {
    //         value: 'abc@def'
    //       },
    //       {
    //         value: 'abc'
    //       }
    //     ]
    //   }
    // ];

  }

  ngOnInit() {
  }

  searchForContacts(event: any) {
    const searchQuery = event.detail.value;
    console.log(searchQuery);
    this._contactsService.getContacts(searchQuery).then(
      contacts => {
        console.log('contacts list', JSON.stringify(contacts));
        this.contactsFound = contacts;
      }
    ).catch((error) => {
      console.log(error);
    });
  }

  assignContactDetails(contactName: any, contactNumber: any) {
    this._modalController.dismiss({
      contactName: contactName,
      contactNumber: contactNumber
    });
  }

  dissmissModal() {
    this._modalController.dismiss();
  }

}
