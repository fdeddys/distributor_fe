import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { PurchaseOrderDetail, PurchaseOrderDetailPageDto } from './purchase-order.model';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderDetailService {

    private serverUrl = SERVER_PATH + 'purchase-order-detail';
    constructor(private http: HttpClient) { }

    findByPurchaseOrderId(req?: any): Observable<HttpResponse<PurchaseOrderDetailPageDto>> {
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

        return this.http.post<PurchaseOrderDetailPageDto>(`${newresourceUrl}`, req['filter'], { observe: 'response' });
    }

    save(purchaseOrderDetail: PurchaseOrderDetail): Observable<HttpResponse<PurchaseOrderDetail>> {
        const copy = this.convert(purchaseOrderDetail);
        return this.http.post<PurchaseOrderDetail>(`${this.serverUrl}`, copy, { observe: 'response' })
            .pipe(map((res: HttpResponse<PurchaseOrderDetail>) => this.convertResponse(res)));
    }

    private convert(purchaseOrderDetail: PurchaseOrderDetail): PurchaseOrderDetail {
        const copy: PurchaseOrderDetail = Object.assign({}, purchaseOrderDetail);
        return copy;
    }

    private convertResponse(res: HttpResponse<PurchaseOrderDetail>): HttpResponse<PurchaseOrderDetail> {
        const body: PurchaseOrderDetail = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertItemFromServer(purchaseOrderDetail: PurchaseOrderDetail): PurchaseOrderDetail {
        const copyOb: PurchaseOrderDetail = Object.assign({}, purchaseOrderDetail);
        return copyOb;
    }

    deleteById(id: number): Observable<PurchaseOrderDetail> {

        const newresourceUrl = this.serverUrl + `/${id}`;

        return this.http.delete<PurchaseOrderDetail>(newresourceUrl );
    }

    updateDetailByID(poDetail: PurchaseOrderDetail): Observable<HttpResponse<PurchaseOrderDetail>> {
        
        return this.http.post<PurchaseOrderDetail>(`${this.serverUrl}/updateDetail`, poDetail, { observe: 'response' })
            .pipe(map((res: HttpResponse<PurchaseOrderDetail>) => this.convertResponse(res)));
    }

}
