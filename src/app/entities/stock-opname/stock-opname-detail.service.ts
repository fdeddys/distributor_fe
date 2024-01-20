import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { StockOpnameDetail, StockOpnameDetailPageDto } from './stock-opname.model';

export type EntityResponseType = HttpResponse<StockOpnameDetail>;

@Injectable({
  providedIn: 'root'
})
export class StockOpnameDetailService {

    private serverUrl = SERVER_PATH + 'stock-opname-detail';
    constructor(private http: HttpClient) { }

    findByStockOpnameId(req?: any): Observable<HttpResponse<StockOpnameDetailPageDto>> {
        let pageNumber = null;
        let pageCount = null;
        let newresourceUrl = null;
        let stockOpnameID = null;

        Object.keys(req).forEach((key) => {
            if (key === 'page') {
                pageNumber = req[key];
            }
            if (key === 'count') {
                pageCount = req[key];
            }
            if (key === 'stockOpnameId') {
                stockOpnameID = req[key];
            }
            console.log('service =>',req[key]);
        });

        const filter = {
            stockOpnameId : stockOpnameID,
        };
        
        newresourceUrl = this.serverUrl + `/page/${pageNumber}/count/${pageCount}`;

        return this.http.post<StockOpnameDetailPageDto>(`${newresourceUrl}`, filter, { observe: 'response' });
    }

    save(stockOpnameDetail: StockOpnameDetail): Observable<EntityResponseType> {
        const copy = this.convert(stockOpnameDetail);
        return this.http.post<StockOpnameDetail>(`${this.serverUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    updateQty(idDetail: number, qty: number): Observable<HttpResponse<StockOpnameDetail>> {

        let newresourceUrl = this.serverUrl + `/updateItemQty`;
        let copy = {
            "stockOpnameDetailId": idDetail,
            "qty": qty,
        }
        return this.http.post<StockOpnameDetail>(newresourceUrl, copy, { observe: 'response'});
    }

    deleteById(id: number): Observable<StockOpnameDetail> {

        const newresourceUrl = this.serverUrl + `/${id}`;
        return this.http.delete<StockOpnameDetail>(newresourceUrl );
    }

    private convert(stockOpnameDetail: StockOpnameDetail): StockOpnameDetail {
        const copy: StockOpnameDetail = Object.assign({}, stockOpnameDetail);
        return copy;
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: StockOpnameDetail = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertItemFromServer(stockOpnameDetail: StockOpnameDetail): StockOpnameDetail {
        const copyOb: StockOpnameDetail = Object.assign({}, stockOpnameDetail);
        return copyOb;
    }
}
