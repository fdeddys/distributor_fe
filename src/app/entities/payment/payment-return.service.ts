import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { PaymentReturn, PaymentReturnPageDto } from './payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentReturnService {

    private serverUrl = SERVER_PATH + 'payment-return';
    constructor(private http: HttpClient) { }

    findByPaymentId(req?: any): Observable<HttpResponse<PaymentReturnPageDto>> {
       
        let newresourceUrl = null;

        newresourceUrl = this.serverUrl + `/all`;
        return this.http.post<PaymentReturnPageDto>(`${newresourceUrl}`, req['filter'], { observe: 'response' });
    }

    save(paymentReturn: PaymentReturn): Observable<HttpResponse<PaymentReturn>> {
        const copy = this.convert(paymentReturn);
        return this.http.post<PaymentReturn>(`${this.serverUrl}`, copy, { observe: 'response' })
            .pipe(map((res: HttpResponse<PaymentReturn>) => this.convertResponse(res)));
    }

    private convert(paymentReturn: PaymentReturn): PaymentReturn {
        const copy: PaymentReturn = Object.assign({}, paymentReturn);
        return copy;
    }

    private convertResponse(res: HttpResponse<PaymentReturn>): HttpResponse<PaymentReturn> {
        const body: PaymentReturn = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertItemFromServer(paymentReturn: PaymentReturn): PaymentReturn {
        const copyOb: PaymentReturn = Object.assign({}, paymentReturn);
        return copyOb;
    }

    deleteById(id: number): Observable<PaymentReturn> {
        const newresourceUrl = this.serverUrl + `/${id}`;
        return this.http.delete<PaymentReturn>(newresourceUrl );
    }

}
