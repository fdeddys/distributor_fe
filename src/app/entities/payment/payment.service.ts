import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { Payment, PaymentDetailPageDto, PaymentPageDto } from './payment.model';

export type EntityResponseType = HttpResponse<Payment>;


@Injectable({
  providedIn: 'root'
})
export class PaymentService {

    private serverUrl = SERVER_PATH + 'payment';
    constructor(private http: HttpClient) { }

    filter(req?: any): Observable<HttpResponse<PaymentPageDto[]>> {
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

        return this.http.post<PaymentPageDto[]>(newresourceUrl, req['filter'], { observe: 'response' });
    }

    findBySalesOrderID(salesOrderId?: any): Observable<HttpResponse<Payment>> {
   
        let newresourceUrl = null;

        newresourceUrl = this.serverUrl + `/salesOrderId/${salesOrderId}`;

        return this.http.post<Payment>(newresourceUrl, {}, { observe: 'response' });
    }

    findById(id: number): Observable<any> {

        return this.http.get<Payment>(`${this.serverUrl}/${id}`);
    }

    save(payment: Payment): Observable<EntityResponseType> {
        const copy = this.convert(payment);
        return this.http.post<Payment>(`${this.serverUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    approve(payment: Payment): Observable<EntityResponseType> {
        const copy = this.convert(payment);
        return this.http.post<Payment>(`${this.serverUrl}/approve`, copy, { observe: 'response'})
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

    private convert(payment: Payment): Payment {
        const copy: Payment = Object.assign({}, payment);
        return copy;
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Payment = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertItemFromServer(payment: Payment): Payment {
        const copyOb: Payment = Object.assign({}, payment);
        return copyOb;
    }
}
