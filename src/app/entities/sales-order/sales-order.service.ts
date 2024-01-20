import { Injectable } from '@angular/core';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';
import { SalesOrderPageDto, SalesOrder, SalesOrderDetail, SalesOrderDetailPageDto } from './sales-order.model';

export type EntityResponseType = HttpResponse<SalesOrder>;

@Injectable({
    providedIn: 'root'
})
export class SalesOrderService {

    private serverUrl = SERVER_PATH + 'sales-order';
    constructor(private http: HttpClient) { }

    filter(req?: any): Observable<HttpResponse<SalesOrderPageDto[]>> {
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
        return this.http.post<SalesOrderPageDto[]>(newresourceUrl, req['filter'], { observe: 'response' });
    }

    filterForSalesOrder(req?: any): Observable<HttpResponse<SalesOrderPageDto[]>> {
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
        return this.http.post<SalesOrderPageDto[]>(newresourceUrl, req['filter'], { observe: 'response' });
    }


    getTotalByID(orderId: number): Observable<HttpResponse<number>> {

        let newresourceUrl = this.serverUrl + `/${orderId}/total`;
        return this.http.get<number>(newresourceUrl,{ observe: 'response'});
    }

    
    findById(id: number): Observable<any> {

        const pathOrderDetailUrl = SERVER_PATH + 'sales-order-detail';

        return this.http.get<SalesOrder>(`${this.serverUrl}/${id}`)
            // .pipe(
            //     // map((salesOrder: any) => salesOrder),
            //     flatMap(
            //         (salesOrder: any) => {
            //             const filter = {
            //                 OrderNo : '',
            //                 orderId : salesOrder.id,
            //             };
            //             return this.http.post<SalesOrderDetailPageDto>(`${pathOrderDetailUrl}/page/1/count/10`, 
            //                 filter, { observe: 'response' })
            //                 .pipe(
            //                     map( (resDetail) => {
            //                         let details = resDetail.body.contents;
            //                         salesOrder.detail = details;
            //                         return salesOrder;
            //                     })
            //                 );
            //         }
            //     )
            // );
        // .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    save(salesOrder: SalesOrder): Observable<EntityResponseType> {
        const copy = this.convert(salesOrder);
        return this.http.post<SalesOrder>(`${this.serverUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    approve(salesOrder: SalesOrder): Observable<EntityResponseType> {
        const copy = this.convert(salesOrder);
        return this.http.post<SalesOrder>(`${this.serverUrl}/approve`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }


    createInvoice(orderId: number): Observable<EntityResponseType> {
        var bodyReq = {
            'orderId' : orderId
        }
        return this.http.post<SalesOrder>(`${this.serverUrl}/create-invoice`, bodyReq, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    reject(salesOrder: SalesOrder): Observable<EntityResponseType> {
        const copy = this.convert(salesOrder);
        return this.http.post<SalesOrder>(`${this.serverUrl}/reject`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    preview(id: number, tipeReport: string):  Observable<Blob>  {

        if (tipeReport == 'so') {
            return this.http.post(`${this.serverUrl}/print/so/${id}`, {}, { responseType: 'blob' });
        }

        if (tipeReport == 'invoice') {
            return this.http.post(`${this.serverUrl}/print/invoice/${id}`, {}, { responseType: 'blob' });
        }
    }

    private convert(salesOrder: SalesOrder): SalesOrder {
        const copy: SalesOrder = Object.assign({}, salesOrder);
        return copy;
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: SalesOrder = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertItemFromServer(salesOrder: SalesOrder): SalesOrder {
        const copyOb: SalesOrder = Object.assign({}, salesOrder);
        return copyOb;
    }
}
