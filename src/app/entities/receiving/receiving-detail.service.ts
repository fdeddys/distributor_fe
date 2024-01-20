import { Injectable } from '@angular/core';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReceivingDetailPageDto, ReceivingDetail } from './receiving.model';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ReceivingDetailService {

    private serverUrl = SERVER_PATH + 'receive-detail';
    constructor(private http: HttpClient) { }

    findByReceiveId(req?: any): Observable<HttpResponse<ReceivingDetailPageDto>> {
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

        return this.http.post<ReceivingDetailPageDto>(`${newresourceUrl}`, req['filter'], { observe: 'response' });
    }

    updateDetail(receiveDetail: ReceivingDetail[]): Observable<HttpResponse<ReceivingDetail>> {
        
        return this.http.post<ReceivingDetail>(`${this.serverUrl}/updateDetail`, receiveDetail, { observe: 'response' })
            .pipe(map((res: HttpResponse<ReceivingDetail>) => this.convertResponse(res)));
    }

    save(receiveDetail: ReceivingDetail): Observable<HttpResponse<ReceivingDetail>> {
        const copy = this.convert(receiveDetail);
        return this.http.post<ReceivingDetail>(`${this.serverUrl}`, copy, { observe: 'response' })
            .pipe(map((res: HttpResponse<ReceivingDetail>) => this.convertResponse(res)));
    }

    private convert(receiveDetail: ReceivingDetail): ReceivingDetail {
        const copy: ReceivingDetail = Object.assign({}, receiveDetail);
        return copy;
    }

    private convertResponse(res: HttpResponse<ReceivingDetail>): HttpResponse<ReceivingDetail> {
        const body: ReceivingDetail = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertItemFromServer(receiveDetail: ReceivingDetail): ReceivingDetail {
        const copyOb: ReceivingDetail = Object.assign({}, receiveDetail);
        return copyOb;
    }

    deleteById(id: number): Observable<ReceivingDetail> {

        const newresourceUrl = this.serverUrl + `/${id}`;

        return this.http.delete<ReceivingDetail>(newresourceUrl );
    }

    deleteMultipleById(multiId: number[]): Observable<HttpResponse<ReceivingDetail>> {

        const newresourceUrl = this.serverUrl + `/deleteMulti`;

        // return this.http.delete<ReceivingDetail>(newresourceUrl );
        return this.http.post<ReceivingDetail>(newresourceUrl, multiId, { observe: 'response' })
            .pipe(map((res: HttpResponse<ReceivingDetail>) => this.convertResponse(res)));
    }


}
