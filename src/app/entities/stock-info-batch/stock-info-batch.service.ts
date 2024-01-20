import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { ReceivingDetailPageDto } from '../receiving/receiving.model';

@Injectable({
  providedIn: 'root'
})
export class StockInfoBatchService {

    private serverUrl = SERVER_PATH + 'receive-detail';
    constructor(private http: HttpClient) { }

    filter(req?: any): Observable<HttpResponse<ReceivingDetailPageDto>> {
        let pageNumber = null;
        let pageCount = null;
        let newresourceUrl = null;

        Object.keys(req).forEach((key) => {
            if (key === 'page') {
                pageNumber = req[key];
            }
            if (key === 'count') {
                pageCount = req[key];
            }
        });

        newresourceUrl = this.serverUrl + `/search-batch-expired/page/${pageNumber}/count/${pageCount}`;

        return this.http.post<ReceivingDetailPageDto>(newresourceUrl, req['filter'], { observe: 'response' });
    }
}
