import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { DirectSalesPayment, DirectSalesPaymentPageDto } from './direct-sales-payment.model';

export type EntityResponseType = HttpResponse<DirectSalesPayment>;


@Injectable({
    providedIn: 'root'
})
export class DirectSalesPaymentService {

    private serverUrl = SERVER_PATH + 'payment-direct';
    constructor(private http: HttpClient) { }

    filter(req?: any): Observable<HttpResponse<DirectSalesPaymentPageDto>> {
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

        return this.http.post<DirectSalesPaymentPageDto>(newresourceUrl, req['filter'], { observe: 'response' });
    }

    approve(directSalesPayment: DirectSalesPayment): Observable<EntityResponseType> {
        const copy = this.convert(directSalesPayment);
        return this.http.post<DirectSalesPayment>(`${this.serverUrl}/approve`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    reject(directSalesPayment: DirectSalesPayment): Observable<EntityResponseType> {
        const copy = this.convert(directSalesPayment);
        return this.http.post<DirectSalesPayment>(`${this.serverUrl}/reject`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    private convert(directSalesPayment: DirectSalesPayment): DirectSalesPayment {
        const copy: DirectSalesPayment = Object.assign({}, directSalesPayment);
        return copy;
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: DirectSalesPayment = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertItemFromServer(directSalesPayment: DirectSalesPayment): DirectSalesPayment {
        const copyOb: DirectSalesPayment = Object.assign({}, directSalesPayment);
        return copyOb;
    }

}
