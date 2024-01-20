import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { StockMutationDetail, StockMutationDetailPageDto } from './stock-mutation.model';

export type EntityResponseType = HttpResponse<StockMutationDetail>;

@Injectable({
  providedIn: 'root'
})

export class StockMutationDetailService {

    private serverUrl = SERVER_PATH + 'stock-mutation-detail';
    constructor(private http: HttpClient) { }

    findByStockMutationId(req?: any): Observable<HttpResponse<StockMutationDetailPageDto>> {
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
        newresourceUrl = this.serverUrl + `/page/${pageNumber}/count/${pageCount}`;

        return this.http.post<StockMutationDetailPageDto>(`${newresourceUrl}`, req['filter'], { observe: 'response' });
    }

    save(stockMutationDetail: StockMutationDetail): Observable<EntityResponseType> {
        const copy = this.convert(stockMutationDetail);
        return this.http.post<StockMutationDetail>(`${this.serverUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    updateQty(idDetail: number, qty: number): Observable<HttpResponse<StockMutationDetail>> {

        let newresourceUrl = this.serverUrl + `/updateItemQty`;
        let copy = {
            "stockMutationDetailId": idDetail,
            "qty": qty,
        }
        return this.http.post<StockMutationDetail>(newresourceUrl, copy, { observe: 'response'});
    }

    deleteById(id: number): Observable<StockMutationDetail> {

        const newresourceUrl = this.serverUrl + `/${id}`;
        return this.http.delete<StockMutationDetail>(newresourceUrl );
    }

    private convert(stockMutationDetail: StockMutationDetail): StockMutationDetail {
        const copy: StockMutationDetail = Object.assign({}, stockMutationDetail);
        return copy;
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: StockMutationDetail = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertItemFromServer(stockMutationDetail: StockMutationDetail): StockMutationDetail {
        const copyOb: StockMutationDetail = Object.assign({}, stockMutationDetail);
        return copyOb;
    }

}
