import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { PaymentDetail, PaymentDetailPageDto } from './payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentDetailService {


    private serverUrl = SERVER_PATH + 'payment-detail';
    constructor(private http: HttpClient) { }

    findByPaymentId(req?: any): Observable<HttpResponse<PaymentDetailPageDto>> {
       
        let newresourceUrl = null;

        newresourceUrl = this.serverUrl + `/all`;
        return this.http.post<PaymentDetailPageDto>(`${newresourceUrl}`, req['filter'], { observe: 'response' });
    }

    save(paymentDetail: PaymentDetail): Observable<HttpResponse<PaymentDetail>> {
        const copy = this.convert(paymentDetail);
        return this.http.post<PaymentDetail>(`${this.serverUrl}`, copy, { observe: 'response' })
            .pipe(map((res: HttpResponse<PaymentDetail>) => this.convertResponse(res)));
    }

    private convert(paymentDetail: PaymentDetail): PaymentDetail {
        const copy: PaymentDetail = Object.assign({}, paymentDetail);
        return copy;
    }

    private convertResponse(res: HttpResponse<PaymentDetail>): HttpResponse<PaymentDetail> {
        const body: PaymentDetail = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertItemFromServer(paymentDetail: PaymentDetail): PaymentDetail {
        const copyOb: PaymentDetail = Object.assign({}, paymentDetail);
        return copyOb;
    }

    deleteById(id: number): Observable<PaymentDetail> {

        const newresourceUrl = this.serverUrl + `/${id}`;

        return this.http.delete<PaymentDetail>(newresourceUrl );
    }

}
