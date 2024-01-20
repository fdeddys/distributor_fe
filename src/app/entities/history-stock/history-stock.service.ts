import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { HistoryStock, HistoryStockPageDto } from './history-stock.model';

@Injectable({
  providedIn: 'root'
})
export class HistoryStockService {


    private serverUrl = SERVER_PATH + 'history-stock';
    constructor(private http: HttpClient) { }

    filter(req?: any): Observable<HttpResponse<HistoryStockPageDto[]>> {
        let pageNumber = null;
        let pageCount = null;
        let newresourceUrl = null;
        let filterParam = null;
        
        Object.keys(req).forEach((key) => {
            if (key === 'page') {
                pageNumber = req[key];
            }
            if (key === 'count') {
                pageCount = req[key];
            }

            if (key === 'filter') {
                filterParam = req[key];
            }

        });

        newresourceUrl = this.serverUrl + `/page/${pageNumber}/count/${pageCount}`;

        return this.http.post<HistoryStockPageDto[]>(newresourceUrl,  filterParam, { observe: 'response' });
    }
    

}
