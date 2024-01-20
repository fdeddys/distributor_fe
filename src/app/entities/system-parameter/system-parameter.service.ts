import { Injectable } from '@angular/core';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SystemParameter } from './system-parameter.model';
import { map, tap } from 'rxjs/operators';

export type EntityResponseType = HttpResponse<SystemParameter>;


@Injectable({
    providedIn: 'root'
})
export class SystemParameterService {

    private serverUrl = SERVER_PATH + 'appParameter';

    constructor(private http: HttpClient) { }

    // find by filter paging
    filter(req ?: any): Observable<HttpResponse<SystemParameter[]>> {
        let pageNumber = null;
        let pageCount = null;
        let newResourceUrl = null;
        let result = null;

        Object.keys(req).forEach((key) => {
            if (key === 'page') {
                pageNumber = req[key];
            }
            if (key === 'count') {
                pageCount = req[key];
            }
        });

        newResourceUrl = this.serverUrl + `/filter/page/${pageNumber}/count/${pageCount}`;

        result = this.http.post<SystemParameter[]>(newResourceUrl, req['filter'], { observe: 'response' });

        return result;
    }

    // get app aparameter frim master data approval
    getFromMda(id): Observable<HttpResponse<SystemParameter[]>> {
        const newresourceUrl = this.serverUrl + `/getFromMda/${id}`;
        return this.http.get<SystemParameter[]>(newresourceUrl, { observe: 'response' })
            .pipe(
                tap(result => console.log('hasil', result))
            );
    }

    // save from modal
    save(systemParameter: SystemParameter): Observable<EntityResponseType> {
        const copy = this.convert(systemParameter);
        const result = this.http.post<SystemParameter>(`${this.serverUrl}`, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));

        return result;
    }


    repair(systemParameter: SystemParameter, idMda: number): Observable<EntityResponseType> {
        const copy = this.convert(systemParameter);
        const newResourceUrl = this.serverUrl + `/repair/${idMda}`;
        const result = this.http.post<SystemParameter>(newResourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));

        return result;
    }

    approveFromMda(id): Observable<SystemParameter> {
        const newresourceUrl = this.serverUrl + `/approveMda/${id}`;
        return this.http.post<SystemParameter>(newresourceUrl, { observe: 'response' });
    }

    private convert(systemParameter: SystemParameter): SystemParameter {
        const copy: SystemParameter = Object.assign({}, systemParameter);
        return copy;
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: SystemParameter = this.convertItemFromServer(res.body);
        return res.clone({ body });
    }

    private convertItemFromServer(systemParameter: SystemParameter): SystemParameter {
        const copyOb: SystemParameter = Object.assign({}, systemParameter);
        return copyOb;
    }
}
