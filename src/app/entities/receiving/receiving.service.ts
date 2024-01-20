import { Injectable } from '@angular/core';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReceivingPageDto, Receive, ReceivingDetailPageDto } from './receiving.model';
import { flatMap, map } from 'rxjs/operators';

type EntityResponseType = HttpResponse<Receive>;

@Injectable({
    providedIn: 'root'
})
export class ReceivingService {

    private serverUrl = SERVER_PATH + 'receive';
    constructor(private http: HttpClient) { }

    filter(req?: any): Observable<HttpResponse<ReceivingPageDto[]>> {
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

        return this.http.post<ReceivingPageDto[]>(newresourceUrl, req['filter'], { observe: 'response' });
    }

    findById(id: number): Observable<any> {

        const pathReceiveDetailUrl = SERVER_PATH + 'receive-detail';

        return this.http
            .get<Receive>(`${this.serverUrl}/${id}`)
            .pipe(
                flatMap(
                    (receive: Receive) => {
                        const filter = {
                            receiveNo : '',
                            receiveId : receive.id,
                        };
                        return this.http
                            .post<ReceivingDetailPageDto>(`${pathReceiveDetailUrl}/page/1/count/1000`, filter, { observe: 'response' })
                            .pipe(
                                map( (resDetail) => {
                                    const details = resDetail.body.contents;
                                    receive.detail = details;
                                    return receive;
                                })
                            );
                    }
                )
            );
    }


    save(receive: Receive): Observable<EntityResponseType> {
        const copy = this.convert(receive);
        return this.http.post<Receive>(`${this.serverUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    saveByPO(receive: Receive): Observable<EntityResponseType> {
        const copy = this.convert(receive);
        let newresourceUrl = this.serverUrl + `/byPO`;
        return this.http.post<Receive>(newresourceUrl, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    removeByPO(receive: Receive, clearData: boolean): Observable<EntityResponseType> {
        const copy = this.convert(receive);
        let newresourceUrl = this.serverUrl;
        if (clearData===true) {
            newresourceUrl = newresourceUrl + `/remove-PO`; 
        } else {
            newresourceUrl = newresourceUrl + `/remove-PO-all`;
        }
        
        return this.http.post<Receive>(newresourceUrl, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    approve(receive: Receive): Observable<EntityResponseType> {
        const copy = this.convert(receive);
        return this.http.post<Receive>(`${this.serverUrl}/approve`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    reject(receive: Receive): Observable<EntityResponseType> {
        const copy = this.convert(receive);
        return this.http.post<Receive>(`${this.serverUrl}/reject`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    preview(id: number):  Observable<Blob>  {
        return this.http.post(`${this.serverUrl}/print/${id}`, {}, { responseType: 'blob' });
    }

    private convert(receive: Receive): Receive {
        const copy: Receive = Object.assign({}, receive);
        return copy;
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Receive = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertItemFromServer(receive: Receive): Receive {
        const copyOb: Receive = Object.assign({}, receive);
        return copyOb;
    }


    export(req?: any): Observable<Blob>  {
        let newresourceUrl = null;

        newresourceUrl = this.serverUrl + `/export`;
        return this.http.post(newresourceUrl, req['filter'], { responseType: 'blob' });
    }

    
}
