import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { PaymentSupplier, PaymentSupplierDetail, PaymentSupplierPageDto } from './payment-supplier.model';
type EntityResponseType = HttpResponse<PaymentSupplier>;

@Injectable({
  providedIn: 'root'
})


export class PaymentSupplierService {

    private serverUrl = SERVER_PATH + 'payment-supplier';
    constructor(private http: HttpClient) { }
 
    filter(req?: any): Observable<HttpResponse<PaymentSupplierPageDto[]>> {
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

        return this.http.post<PaymentSupplierPageDto[]>(newresourceUrl, req['filter'], { observe: 'response' });
    }


    findById(id: number): Observable<any> {

        return this.http.get<PaymentSupplier>(`${this.serverUrl}/${id}`)

    }

    save(paymentSupplier: PaymentSupplier): Observable<EntityResponseType> {
        const copy = this.convert(paymentSupplier);
        return this.http.post<PaymentSupplier>(`${this.serverUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    private convert(paymentSupplier: PaymentSupplier): PaymentSupplier {
        const copy: PaymentSupplier = Object.assign({}, paymentSupplier);
        return copy;
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: PaymentSupplier = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertItemFromServer(paymentSupplier: PaymentSupplier): PaymentSupplier {
        const copyOb: PaymentSupplier = Object.assign({}, paymentSupplier);
        return copyOb;
    }

    approve(paymentSupplier: PaymentSupplier): Observable<EntityResponseType> {
        const copy = this.convert(paymentSupplier);
        return this.http.post<PaymentSupplier>(`${this.serverUrl}/approve`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }
    
    reject(paymentSupplier: PaymentSupplier): Observable<EntityResponseType> {
        const copy = this.convert(paymentSupplier);
        return this.http.post<PaymentSupplier>(`${this.serverUrl}/reject`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }
}
