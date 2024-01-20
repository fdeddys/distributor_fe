import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { PurchaseOrder, PurchaseOrderDetailPageDto, PurchaseOrderPageDto } from './purchase-order.model';

export type EntityResponseType = HttpResponse<PurchaseOrder>;

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {

    private serverUrl = SERVER_PATH + 'purchase-order';
    constructor(private http: HttpClient) { }

    filter(req?: any): Observable<HttpResponse<PurchaseOrderPageDto[]>> {
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
        console.log("http =>", req['filter'])
        newresourceUrl = this.serverUrl + `/page/${pageNumber}/count/${pageCount}`;
        return this.http.post<PurchaseOrderPageDto[]>(newresourceUrl, req['filter'], { observe: 'response' });
    }

    export(req?: any): Observable<Blob>  {
        let newresourceUrl = null;

        newresourceUrl = this.serverUrl + `/export`;
        return this.http.post(newresourceUrl, req['filter'], { responseType: 'blob' });
    }


    findByIdPO(id: number): Observable<any> {

        const pathOrderDetailUrl = SERVER_PATH + 'purchase-order-detail';

        return this.http.get<PurchaseOrder>(`${this.serverUrl}/${id}`)
    }

    findById(id: number): Observable<any> {

        const pathOrderDetailUrl = SERVER_PATH + 'purchase-order-detail';

        return this.http.get<PurchaseOrder>(`${this.serverUrl}/${id}`)
            .pipe(
                flatMap(
                    (purchaseOrder: any) => {
                        const filter = {
                            purchaseOrderNumber : '',
                            purchaseOrderId : purchaseOrder.id,
                        };
                        return this.http.post<PurchaseOrderDetailPageDto>(`${pathOrderDetailUrl}/page/1/count/1000`, 
                            filter, { observe: 'response' })
                            .pipe(
                                map( (resDetail) => {
                                    let details = resDetail.body.contents;
                                    purchaseOrder.detail = details;
                                    return purchaseOrder;
                                })
                            );
                    }
                )
            );
    }

    findLastPrice(productid: number): Observable<any> {

        const pathOrderDetailUrl = SERVER_PATH + 'purchase-order-detail/last-price';

        return this.http.get<PurchaseOrder>(`${pathOrderDetailUrl}/${productid}`)
    }

    save(purchaseOrder: PurchaseOrder): Observable<EntityResponseType> {
        const copy = this.convert(purchaseOrder);
        return this.http.post<PurchaseOrder>(`${this.serverUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    approve(purchaseOrder: PurchaseOrder): Observable<EntityResponseType> {
        const copy = this.convert(purchaseOrder);
        return this.http.post<PurchaseOrder>(`${this.serverUrl}/approve`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }


    reject(poId: number): Observable<EntityResponseType> {
        // const copy = this.convert(purchaseOrder);
        return this.http.post<PurchaseOrder>(`${this.serverUrl}/reject/${poId}`,null , { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    cancelSubmit(poId: number): Observable<EntityResponseType> {
        // const copy = this.convert(purchaseOrder);
        return this.http.post<PurchaseOrder>(`${this.serverUrl}/cancel-submit/${poId}`,null , { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    preview(id: number):  Observable<Blob>  {
        
        return this.http.post(`${this.serverUrl}/print/${id}`, {}, { responseType: 'blob' });
    }

    previewByPONo(pono: string):  Observable<Blob>  {
        
        return this.http.post(`${this.serverUrl}/print-by-pono/${pono}`, {}, { responseType: 'blob' });
    }

    private convert(purchaseOrder: PurchaseOrder): PurchaseOrder {
        const copy: PurchaseOrder = Object.assign({}, purchaseOrder);
        return copy;
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: PurchaseOrder = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertItemFromServer(purchaseOrder: PurchaseOrder): PurchaseOrder {
        const copyOb: PurchaseOrder = Object.assign({}, purchaseOrder);
        return copyOb;
    }
}
