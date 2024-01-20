import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { StockPageDto } from './stock.model';

@Injectable({
  providedIn: 'root'
})
export class StockService {


    private serverUrl = SERVER_PATH + 'stock';
    constructor(private http: HttpClient) { }

    filter(req?: any): Observable<HttpResponse<StockPageDto[]>> {
        let pageNumber = null;
        let pageCount = null;
        let productId = null;
        let newresourceUrl = null;

        Object.keys(req).forEach((key) => {
            if (key === 'page') {
                pageNumber = req[key];
            }
            if (key === 'count') {
                pageCount = req[key];
            }
            if (key === 'productId') {
                productId = req[key];
            }
        });

        newresourceUrl = this.serverUrl + `/${productId}/page/${pageNumber}/count/${pageCount}`;

        return this.http.get<StockPageDto[]>(newresourceUrl,  { observe: 'response' });
    }

}
