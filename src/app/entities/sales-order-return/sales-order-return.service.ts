import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { SalesOrderReturn, SalesOrderReturnDetail, SalesOrderReturnDetailPageDto, SalesOrderReturnPageDto } from './sales-order-return.model';

export type EntityResponseType = HttpResponse<SalesOrderReturn>;


@Injectable({
    providedIn: 'root'
})
export class SalesOrderReturnService {

    private serverUrl = SERVER_PATH + 'return-sales-order';
    constructor(private http: HttpClient) { }

    filter(req?: any): Observable<HttpResponse<SalesOrderReturnPageDto[]>> {
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

        return this.http.post<SalesOrderReturnPageDto[]>(newresourceUrl, req['filter'], { observe: 'response' });
    }

    findById(id: number): Observable<any> {

        const pathOrderDetailUrl = SERVER_PATH + 'return-sales-order-detail';

        return this.http.get<SalesOrderReturnDetail>(`${this.serverUrl}/${id}`)
            .pipe(
                // map((salesOrder: any) => salesOrder),
                flatMap(
                    (salesOrder: any) => {
                        const filter = {
                            OrderNo : '',
                            orderId : salesOrder.id,
                        };
                        return this.http.post<SalesOrderReturnDetailPageDto>(`${pathOrderDetailUrl}/page/1/count/1000`, 
                            filter, { observe: 'response' })
                            .pipe(
                                map( (resDetail) => {
                                    let details = resDetail.body.contents;
                                    salesOrder.detail = details;
                                    return salesOrder;
                                })
                            );
                    }
                )
            );
        // .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    filterForSalesOrderReturn(req?: any): Observable<HttpResponse<SalesOrderReturnPageDto[]>> {
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
        
        newresourceUrl = this.serverUrl + `/payment/page/${pageNumber}/count/${pageCount}`;
        return this.http.post<SalesOrderReturnPageDto[]>(newresourceUrl, req['filter'], { observe: 'response' });
    }


    save(salesOrderReturn: SalesOrderReturn): Observable<EntityResponseType> {
        const copy = this.convert(salesOrderReturn);
        return this.http.post<SalesOrderReturn>(`${this.serverUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    approve(salesOrderReturn: SalesOrderReturn): Observable<EntityResponseType> {
        const copy = this.convert(salesOrderReturn);
        return this.http.post<SalesOrderReturn>(`${this.serverUrl}/approve`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }


    createInvoice(orderId: number): Observable<EntityResponseType> {
        var bodyReq = {
            'orderId' : orderId
        }
        return this.http.post<SalesOrderReturn>(`${this.serverUrl}/create-invoice`, bodyReq, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    reject(salesOrder: SalesOrderReturn): Observable<EntityResponseType> {
        const copy = this.convert(salesOrder);
        return this.http.post<SalesOrderReturn>(`${this.serverUrl}/reject`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    preview(id: number, tipeReport: string):  Observable<Blob>  {
        return this.http.post(`${this.serverUrl}/print/${id}`, {}, { responseType: 'blob' });
    }

    private convert(salesOrderReturn: SalesOrderReturn): SalesOrderReturn {
        const copy: SalesOrderReturn = Object.assign({}, salesOrderReturn);
        return copy;
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: SalesOrderReturn = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertItemFromServer(salesOrderReturn: SalesOrderReturn): SalesOrderReturn {
        const copyOb: SalesOrderReturn = Object.assign({}, salesOrderReturn);
        return copyOb;
    }
}
