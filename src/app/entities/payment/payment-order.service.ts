import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { PaymentOrder, PaymentOrderPageDto } from './payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentOrderService {

    private serverUrl = SERVER_PATH + 'payment-order';
    constructor(private http: HttpClient) { }

    findByPaymentId(req?: any): Observable<HttpResponse<PaymentOrderPageDto>> {
       
        let newresourceUrl = null;

        newresourceUrl = this.serverUrl + `/all`;
        return this.http.post<PaymentOrderPageDto>(`${newresourceUrl}`, req['filter'], { observe: 'response' });
    }


    save(paymentOrder: PaymentOrder): Observable<HttpResponse<PaymentOrder>> {
        const copy = this.convert(paymentOrder);
        return this.http.post<PaymentOrder>(`${this.serverUrl}`, copy, { observe: 'response' })
            .pipe(map((res: HttpResponse<PaymentOrder>) => this.convertResponse(res)));
    }

    private convert(paymentOrder: PaymentOrder): PaymentOrder {
        const copy: PaymentOrder = Object.assign({}, paymentOrder);
        return copy;
    }

    private convertResponse(res: HttpResponse<PaymentOrder>): HttpResponse<PaymentOrder> {
        const body: PaymentOrder = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertItemFromServer(paymentOrder: PaymentOrder): PaymentOrder {
        const copyOb: PaymentOrder = Object.assign({}, paymentOrder);
        return copyOb;
    }

    deleteById(id: number): Observable<PaymentOrder> {

        const newresourceUrl = this.serverUrl + `/${id}`;

        return this.http.delete<PaymentOrder>(newresourceUrl );
    }


}
