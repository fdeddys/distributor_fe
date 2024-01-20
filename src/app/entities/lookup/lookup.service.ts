import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { map, tap } from 'rxjs/operators';
import { Lookup, LookupDto, LookupPageDto } from './lookup.model';

export type EntityResponseType = HttpResponse<Lookup>;
// export type EntityResponseTypeDto = HttpResponse<LookupDto>;


@Injectable({
    providedIn: 'root'
})
export class LookupService {

    private serverUrl = SERVER_PATH + 'lookup';

    constructor(private http: HttpClient) { }

    // findForMerchantGroup():  Observable<HttpResponse<LookupDto[]>> {
    //     return this.http.get<LookupDto[]>(this.serverUrl + `/merchantGroup`, {  observe: 'response' })
    //         .pipe(
    //             tap(merchantGrouplist => console.log('raw ', merchantGrouplist ) )
    //             );
    // }

    save(lookup: Lookup): Observable<EntityResponseType> {
        const copy = this.convert(lookup);
        return this.http.post<Lookup>(`${this.serverUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    filter(req?: any): Observable<HttpResponse<Lookup[]>> {
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
        return this.http.post<Lookup[]>(newresourceUrl, req['filter'], {  observe: 'response' });
    }

    findByName(req?: any): Observable<HttpResponse<LookupPageDto>> {
        let groupName = null;
        let newresourceUrl = null;

        Object.keys(req).forEach((key) => {
            if (key === 'groupName') {
                groupName = req[key];
            }
        });
        newresourceUrl = this.serverUrl + `/name/${groupName}`;

        return this.http.get<LookupPageDto>(newresourceUrl, { observe: 'response' })
            .pipe(
                 tap(lookupList => {})
            );
    }

    private convert( lookup: Lookup): Lookup {
        const copy: Lookup = Object.assign({}, lookup);
        return copy;
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Lookup = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertItemFromServer(lookup: Lookup): Lookup {
        const copyOb: Lookup = Object.assign({}, lookup);
        return copyOb;
    }

}
