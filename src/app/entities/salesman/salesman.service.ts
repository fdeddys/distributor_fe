import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { Salesman, SalesmanDto, SalesmanPageDto } from './salesman.model';

export type EntityResponseType = HttpResponse<Salesman>;

@Injectable({
    providedIn: 'root'
})
export class SalesmanService {

    private serverUrl = SERVER_PATH + 'salesman';
    constructor(private http: HttpClient) { }

    getSalesman(req?: any): Observable<HttpResponse<SalesmanDto>> {

        var newresourceUrl = this.serverUrl;
        return this.http.get<SalesmanDto>(newresourceUrl, { observe: 'response' });
    }


    filter(req?: any): Observable<HttpResponse<SalesmanPageDto[]>> {
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

        return this.http.post<SalesmanPageDto[]>(newresourceUrl, req['filter'], { observe: 'response' });
    }

    save(salesman: Salesman): Observable<EntityResponseType> {
        const copy = this.convert(salesman);
        return this.http.post<Salesman>(`${this.serverUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    private convert( salesman: Salesman): Salesman {
        const copy: Salesman = Object.assign({}, salesman);
        return copy;
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Salesman = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertItemFromServer(salesman: Salesman): Salesman {
        const copyOb: Salesman = Object.assign({}, salesman);
        return copyOb;
    }

}
