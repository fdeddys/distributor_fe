import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { PaymentSupplierDetail, PaymentSupplierDetailPageDto } from './payment-supplier.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentSupplierDetailService {


    private serverUrl = SERVER_PATH + 'payment-supplier-detail';
    constructor(private http: HttpClient) { }


    findByPaymentId(req?: any): Observable<HttpResponse<PaymentSupplierDetailPageDto>> {
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

        // newresourceUrl = this.serverUrl + `/all`;


        return this.http.post<PaymentSupplierDetailPageDto>(`${newresourceUrl}`, req['filter'], { observe: 'response' });
    }

    deleteById(id: number): Observable<PaymentSupplierDetail> {

        const newresourceUrl = this.serverUrl + `/${id}`;

        return this.http.delete<PaymentSupplierDetail>(newresourceUrl );
    }

    save(paymentSupplierDetail: PaymentSupplierDetail): Observable<HttpResponse<PaymentSupplierDetail>> {
        const copy = this.convert(paymentSupplierDetail);
        return this.http.post<PaymentSupplierDetail>(`${this.serverUrl}`, copy, { observe: 'response' })
            .pipe(map((res: HttpResponse<PaymentSupplierDetail>) => this.convertResponse(res)));
    }

    private convert(paymentSupplierDetail: PaymentSupplierDetail): PaymentSupplierDetail {
        const copy: PaymentSupplierDetail = Object.assign({}, paymentSupplierDetail);
        return copy;
    }

    private convertResponse(res: HttpResponse<PaymentSupplierDetail>): HttpResponse<PaymentSupplierDetail> {
        const body: PaymentSupplierDetail = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertItemFromServer(paymentSupplierDetail: PaymentSupplierDetail): PaymentSupplierDetail {
        const copyOb: PaymentSupplierDetail = Object.assign({}, paymentSupplierDetail);
        return copyOb;
    }

}
