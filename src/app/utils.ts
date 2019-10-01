import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class Utils {

    months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    constructor() {
    }

    getMonthString(date: Date) {
        return this.months[date.getMonth()];
    }

    getMonthlyTimeline(date: Date): string {
        return this.months[date.getMonth()] + " "+ date.getFullYear();
    }

    getDateOfOneMonthLater(dateStr: string): string {
        const date = new Date(dateStr);
        const laterDate = new Date(dateStr);
        laterDate.setMonth(date.getMonth() + 1);
        return this.dateToLocalISO(laterDate);
    }


    today(): string {
        return this.dateToLocalISO(new Date());
    }

    dateToLocalISO(date: Date): string {
        var tzo = -date.getTimezoneOffset(),
            dif = tzo >= 0 ? '+' : '-',
            pad = function (num) {
                var norm = Math.floor(Math.abs(num));
                return (norm < 10 ? '0' : '') + norm;
            };
        return date.getFullYear() +
            '-' + pad(date.getMonth() + 1) +
            '-' + pad(date.getDate()) +
            'T' + pad(date.getHours()) +
            ':' + pad(date.getMinutes()) +
            ':' + pad(date.getSeconds()) +
            '.' + pad(date.getMilliseconds()) +
            dif + pad(tzo / 60) +
            ':' + pad(tzo % 60);
    }

}