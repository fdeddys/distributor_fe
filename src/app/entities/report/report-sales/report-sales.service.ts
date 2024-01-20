import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';

@Injectable({
  providedIn: 'root'
})
export class ReportSalesService {

    private serverUrl = SERVER_PATH + 'report';
    constructor(
        private http: HttpClient,
    ) { }

    reportSales(tgl1: any, tgl2:any): Observable<Blob> {

        const filter = {
            startDate : tgl1,
            endDate: tgl2,
        };
        return this.http.post(`${this.serverUrl}/payment-sales`, filter, { responseType: 'blob' });
    }
}
