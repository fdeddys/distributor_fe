import { Injectable } from '@angular/core';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BrandPageDto, Brand } from './brand.model';
import { map } from 'rxjs/operators';

export type EntityResponseType = HttpResponse<Brand>;

@Injectable({
  providedIn: 'root'
})
export class BrandService {

    private serverUrl = SERVER_PATH + 'brand';
    constructor(private http: HttpClient) { }

    filter(req?: any): Observable<HttpResponse<BrandPageDto[]>> {
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

        return this.http.post<BrandPageDto[]>(newresourceUrl, req['filter'], { observe: 'response' });
    }

    save(brand: Brand): Observable<EntityResponseType> {
        const copy = this.convert(brand);
        return this.http.post<Brand>(`${this.serverUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    private convert( brand: Brand): Brand {
        const copy: Brand = Object.assign({}, brand);
        return copy;
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Brand = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertItemFromServer(brand: Brand): Brand {
        const copyOb: Brand = Object.assign({}, brand);
        return copyOb;
    }
}
