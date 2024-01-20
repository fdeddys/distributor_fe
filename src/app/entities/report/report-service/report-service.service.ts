import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';

@Injectable({
  providedIn: 'root'
})
export class ReportServiceService {

    private serverUrl = SERVER_PATH + 'report';
    constructor(
        private http: HttpClient,
    ) { }

    reportMasterProduct(): Observable<Blob> {

        return this.http.get(`${this.serverUrl}/master-barang`, { responseType: 'blob' });
    }
}
