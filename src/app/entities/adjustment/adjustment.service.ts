import { Injectable } from '@angular/core';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdjustmentPageDto, Adjustment, AdjustmentDetailPageDto, AdjustmentDetail } from './adjustment.model';
import { map, flatMap } from 'rxjs/operators';

export type EntityResponseType = HttpResponse<Adjustment>;


@Injectable({
  providedIn: 'root'
})
export class AdjustmentService {

    private serverUrl = SERVER_PATH + 'adjustment';
    constructor(
        private http: HttpClient
        ) { }

    filter(req?: any): Observable<HttpResponse<AdjustmentPageDto[]>> {
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

        return this.http.post<AdjustmentPageDto[]>(newresourceUrl, req['filter'], { observe: 'response' });
    }

    findByIdAdj(id: number): Observable<any> {

        const pathAdjustmentDetailUrl = SERVER_PATH + 'adjustment';

        return this.http
            .get<Adjustment>(`${this.serverUrl}/${id}`)
    }

    findById(id: number, totalRec: number): Observable<any> {

        const pathAdjustmentDetailUrl = SERVER_PATH + 'adjustment-detail';

        return this.http
            .get<Adjustment>(`${this.serverUrl}/${id}`)
            .pipe(
                flatMap(
                    (adjustment: Adjustment) => {
                        const filter = {
                            adjustmentNo : '',
                            adjustmentId : adjustment.id,
                        };
                        return this.http
                            .post<AdjustmentDetailPageDto>(`${pathAdjustmentDetailUrl}/page/1/count/${totalRec}`, filter, { observe: 'response' })
                            .pipe(
                                map( (resDetail) => {
                                    // const details = resDetail.body.contents;
                                    // adjustment.detail = details;
                                    // return adjustment;
                                    const details = resDetail.body.contents;
                                    adjustment.detail = details;
                                    adjustment.totalRow = resDetail.body.totalRow
                                    return adjustment;
                                })
                            );
                    }
                )
            );
    }


    save(adjustment: Adjustment): Observable<EntityResponseType> {
        const copy = this.convert(adjustment);
        return this.http.post<Adjustment>(`${this.serverUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    approve(adjustment: Adjustment): Observable<EntityResponseType> {
        const copy = this.convert(adjustment);
        return this.http.post<Adjustment>(`${this.serverUrl}/approve`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    reject(adjustment: Adjustment): Observable<EntityResponseType> {
        const copy = this.convert(adjustment);
        return this.http.post<Adjustment>(`${this.serverUrl}/reject`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    preview(id: number):  Observable<Blob>  {
        return this.http.post(`${this.serverUrl}/print/${id}`, {}, { responseType: 'blob' });
    }

    private convert(adjustment: Adjustment): Adjustment {
        const copy: Adjustment = Object.assign({}, adjustment);
        return copy;
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Adjustment = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertItemFromServer(adjustment: Adjustment): Adjustment {
        const copyOb: Adjustment = Object.assign({}, adjustment);
        return copyOb;
    }

}
