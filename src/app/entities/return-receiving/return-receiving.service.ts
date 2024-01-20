import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { LastPriceDto, ReturnReceive, ReturnReceiveDetail, ReturnReceiveDetailPageDto, ReturnReceivePageDto } from './return-receiving.model';

export type EntityResponseType = HttpResponse<ReturnReceive>;

@Injectable({
  providedIn: 'root'
})

export class ReturnReceivingService {

    private serverUrl = SERVER_PATH + 'return-receive';
    constructor(private http: HttpClient) { }

    filter(req?: any): Observable<HttpResponse<ReturnReceivePageDto[]>> {
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

        return this.http.post<ReturnReceivePageDto[]>(newresourceUrl, req['filter'], { observe: 'response' });
    }

    findById(id: number): Observable<any> {

        const pathReturnDetailUrl = SERVER_PATH + 'return-receive-detail';

        return this.http.get<ReturnReceiveDetail>(`${this.serverUrl}/${id}`)
            .pipe(
                flatMap(
                    (returnReceive: any) => {
                        const filter = {
                            returnNo : '',
                            returnId : returnReceive.id,
                        };
                        return this.http.post<ReturnReceiveDetailPageDto>(`${pathReturnDetailUrl}/page/1/count/10`, 
                            filter, { observe: 'response' })
                            .pipe(
                                map( (resDetail) => {
                                    let details = resDetail.body.contents;
                                    
                                    returnReceive.detail = details;
                                    returnReceive.totalRow = resDetail.body.totalRow
                                    return returnReceive;
                                })
                            );
                    }
                )
            );
        // .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    save(returnReceive: ReturnReceive): Observable<EntityResponseType> {
        const copy = this.convert(returnReceive);
        return this.http.post<ReturnReceive>(`${this.serverUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    approve(returnReceive: ReturnReceive): Observable<EntityResponseType> {
        const copy = this.convert(returnReceive);
        return this.http.post<ReturnReceive>(`${this.serverUrl}/approve`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }


    createInvoice(orderId: number): Observable<EntityResponseType> {
        var bodyReq = {
            'orderId' : orderId
        }
        return this.http.post<ReturnReceive>(`${this.serverUrl}/create-invoice`, bodyReq, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    reject(returnReceive: ReturnReceive): Observable<EntityResponseType> {
        const copy = this.convert(returnReceive);
        return this.http.post<ReturnReceive>(`${this.serverUrl}/reject`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    preview(id: number, tipeReport: string):  Observable<Blob>  {
        return this.http.post(`${this.serverUrl}/print/${id}`, {}, { responseType: 'blob' });
    }

    private convert(returnReceive: ReturnReceive): ReturnReceive {
        const copy: ReturnReceive = Object.assign({}, returnReceive);
        return copy;
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: ReturnReceive = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertItemFromServer(returnReceive: ReturnReceive): ReturnReceive {
        const copyOb: ReturnReceive = Object.assign({}, returnReceive);
        return copyOb;
    }

    findLastPrice(productid: number): Observable<any> {

        // const pathOrderDetailUrl = SERVER_PATH + 'purchase-order-detail/last-price';
        const pathOrderDetailUrl = SERVER_PATH + 'receive-detail/last-price';

        return this.http.get<LastPriceDto>(`${pathOrderDetailUrl}/${productid}`)
    }

}
