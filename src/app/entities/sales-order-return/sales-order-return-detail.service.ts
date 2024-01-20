import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { SalesOrderReturnDetail, SalesOrderReturnDetailPageDto } from './sales-order-return.model';

export type EntityResponseType = HttpResponse<SalesOrderReturnDetail>;

@Injectable({
  providedIn: 'root'
})
export class SalesOrderReturnDetailService {

    private serverUrl = SERVER_PATH + 'return-sales-order-detail';
    constructor(private http: HttpClient) { }

    findBySalesOrderReturnId(req?: any): Observable<HttpResponse<SalesOrderReturnDetailPageDto>> {
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

        return this.http.post<SalesOrderReturnDetailPageDto>(`${newresourceUrl}`, req['filter'], { observe: 'response' });
    }

    save(salesOrderDetail: SalesOrderReturnDetail): Observable<EntityResponseType> {
        const copy = this.convert(salesOrderDetail);
        return this.http.post<SalesOrderReturnDetail>(`${this.serverUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    updateQty(idDetail: number, qtyReceive: number): Observable<HttpResponse<SalesOrderReturnDetail>> {

        let newresourceUrl = this.serverUrl + `/updateQty`;
        let copy = {
            "orderReturnDetailId":idDetail,
            "QtyReturn":qtyReceive,
        }
        return this.http.post<SalesOrderReturnDetail>(newresourceUrl, copy, { observe: 'response'});
    }

    deleteById(id: number): Observable<SalesOrderReturnDetail> {

        const newresourceUrl = this.serverUrl + `/${id}`;
        return this.http.delete<SalesOrderReturnDetail>(newresourceUrl );
    }

    private convert(salesOrderReturnDetail: SalesOrderReturnDetail): SalesOrderReturnDetail {
        const copy: SalesOrderReturnDetail = Object.assign({}, salesOrderReturnDetail);
        return copy;
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: SalesOrderReturnDetail = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertItemFromServer(salesOrderReturnDetail: SalesOrderReturnDetail): SalesOrderReturnDetail {
        const copyOb: SalesOrderReturnDetail = Object.assign({}, salesOrderReturnDetail);
        return copyOb;
    }

}
