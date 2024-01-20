import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { ReturnReceiveDetail, ReturnReceiveDetailPageDto } from './return-receiving.model';

export type EntityResponseType = HttpResponse<ReturnReceiveDetail>;

@Injectable({
  providedIn: 'root'
})
export class ReturnReceivingDetailService {

    private serverUrl = SERVER_PATH + 'return-receive-detail';
    constructor(private http: HttpClient) { }

    findByReturnReceiveId(req?: any): Observable<HttpResponse<ReturnReceiveDetailPageDto>> {
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

        return this.http.post<ReturnReceiveDetailPageDto>(`${newresourceUrl}`, req['filter'], { observe: 'response' });
    }

    save(returnReceiveDetail: ReturnReceiveDetail): Observable<EntityResponseType> {
        const copy = this.convert(returnReceiveDetail);
        return this.http.post<ReturnReceiveDetail>(`${this.serverUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    updateQty(idDetail: number, qty: number): Observable<HttpResponse<ReturnReceiveDetail>> {

        let newresourceUrl = this.serverUrl + `/updateQty`;
        let copy = {
            "returnDetailId":idDetail,
            "qty":qty,
        }
        return this.http.post<ReturnReceiveDetail>(newresourceUrl, copy, { observe: 'response'});
    }

    deleteById(id: number): Observable<ReturnReceiveDetail> {

        const newresourceUrl = this.serverUrl + `/${id}`;
        return this.http.delete<ReturnReceiveDetail>(newresourceUrl );
    }

    private convert(returnReceiveDetail: ReturnReceiveDetail): ReturnReceiveDetail {
        const copy: ReturnReceiveDetail = Object.assign({}, returnReceiveDetail);
        return copy;
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: ReturnReceiveDetail = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertItemFromServer(returnReceiveDetail: ReturnReceiveDetail): ReturnReceiveDetail {
        const copyOb: ReturnReceiveDetail = Object.assign({}, returnReceiveDetail);
        return copyOb;
    }

}
