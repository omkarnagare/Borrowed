import { Injectable } from '@angular/core';
import { Contacts, IContactFindOptions, ContactFieldType, Contact } from '@ionic-native/contacts/ngx';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  showFields: ContactFieldType[];
  searchOption: IContactFindOptions;

  constructor(
    private _contacts: Contacts
  ) {

    this.showFields = ["displayName", "phoneNumbers"];
    this.searchOption = {
      filter: "",
      hasPhoneNumber: true,
      multiple: true
    };
  }

  getContacts(searchQuery: string): Promise<Contact[]> {
    if (searchQuery) {
      this.searchOption.filter = searchQuery;

      const contactPromise: Promise<Contact[]> = this._contacts.find(this.showFields, this.searchOption);
      if (contactPromise) {
        return contactPromise;
      }
    }
    return new Promise((resolve, reject) => {
      resolve([]);
    });
  }
}
