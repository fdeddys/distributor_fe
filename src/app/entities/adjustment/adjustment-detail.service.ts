import { Injectable } from '@angular/core';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdjustmentDetailPageDto, AdjustmentDetail } from './adjustment.model';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AdjustmentDetailService {

    private serverUrl = SERVER_PATH + 'adjustment-detail';
    constructor(private http: HttpClient) { }

    findByAdjustmentId(req?: any): Observable<HttpResponse<AdjustmentDetailPageDto>> {
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

        return this.http.post<AdjustmentDetailPageDto>(`${newresourceUrl}`, req['filter'], { observe: 'response' });
    }

    save(adjustmentDetail: AdjustmentDetail): Observable<HttpResponse<AdjustmentDetail>> {
        const copy = this.convert(adjustmentDetail);
        return this.http.post<AdjustmentDetail>(`${this.serverUrl}`, copy, { observe: 'response' })
            .pipe(map((res: HttpResponse<AdjustmentDetail>) => this.convertResponse(res)));
    }

    updateQtyById(adjustmentDetail: AdjustmentDetail): Observable<HttpResponse<AdjustmentDetail>> {

        const copy = this.convert(adjustmentDetail);
        return this.http.post<AdjustmentDetail>(`${this.serverUrl}/updateqty`, copy, { observe: 'response' })
            .pipe(map((res: HttpResponse<AdjustmentDetail>) => this.convertResponse(res)));
    }

    private convert(adjustmentDetail: AdjustmentDetail): AdjustmentDetail {
        const copy: AdjustmentDetail = Object.assign({}, adjustmentDetail);
        return copy;
    }

    private convertResponse(res: HttpResponse<AdjustmentDetail>): HttpResponse<AdjustmentDetail> {
        const body: AdjustmentDetail = this.convertItemFromServer(res.body);
        return res.clone({ body });
    }

    private convertItemFromServer(adjustmentDetail: AdjustmentDetail): AdjustmentDetail {
        const copyOb: AdjustmentDetail = Object.assign({}, adjustmentDetail);
        return copyOb;
    }

    deleteById(id: number, idAdj:number): Observable<AdjustmentDetail> {

        const newresourceUrl = this.serverUrl + `/${id}/${idAdj}`;

        return this.http.delete<AdjustmentDetail>(newresourceUrl);
    }

    

}
