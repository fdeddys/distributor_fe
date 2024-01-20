import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { SalesOrderDetail, SalesOrderDetailPageDto } from './sales-order.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';

export type EntityResponseType = HttpResponse<SalesOrderDetail>;

@Injectable({
    providedIn: 'root'
})


export class SalesOrderDetailService {

    private serverUrl = SERVER_PATH + 'sales-order-detail';
    constructor(private http: HttpClient) { }

    findByOrderId(req?: any): Observable<HttpResponse<SalesOrderDetailPageDto>> {
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

        return this.http.post<SalesOrderDetailPageDto>(`${newresourceUrl}`, req['filter'], { observe: 'response' });
        // .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    save(salesOrderDetail: SalesOrderDetail): Observable<EntityResponseType> {
        const copy = this.convert(salesOrderDetail);
        return this.http.post<SalesOrderDetail>(`${this.serverUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    updateQtyRecvItem(idDetail: number, qtyReceive: number): Observable<HttpResponse<SalesOrderDetail>> {

        let newresourceUrl = this.serverUrl + `/updateItemRecv`;
        let copy = {
            "orderDetailId":idDetail,
            "qtyReceive":qtyReceive,
        }
        return this.http.post<SalesOrderDetail>(newresourceUrl, copy, { observe: 'response'});
    }

    updateQtyDetailByID(idDetail: number, qtyOrder: number): Observable<HttpResponse<SalesOrderDetail>> {

        let newresourceUrl = this.serverUrl + `/updateQtyOrder`;
        let copy = {
            "orderDetailId":idDetail,
            "qtyOrder":qtyOrder,
        }
        return this.http.post<SalesOrderDetail>(newresourceUrl, copy, { observe: 'response'});
    }


    deleteById(id: number): Observable<SalesOrderDetail> {

        const newresourceUrl = this.serverUrl + `/${id}`;

        return this.http.delete<SalesOrderDetail>(newresourceUrl );
    }

    private convert(salesOrderDetail: SalesOrderDetail): SalesOrderDetail {
        const copy: SalesOrderDetail = Object.assign({}, salesOrderDetail);
        return copy;
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: SalesOrderDetail = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertItemFromServer(salesOrderDetail: SalesOrderDetail): SalesOrderDetail {
        const copyOb: SalesOrderDetail = Object.assign({}, salesOrderDetail);
        return copyOb;
    }

}
