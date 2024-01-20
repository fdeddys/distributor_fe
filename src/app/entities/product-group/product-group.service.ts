import { Injectable } from '@angular/core';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductGroup, ProductGroupPageDto } from './product-group.model';
import { EntityResponseType } from '../user/user.service';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ProductGroupService {

    private serverUrl = SERVER_PATH + 'product-group';

    constructor(private http: HttpClient) { }

    filter(req?: any): Observable<HttpResponse<ProductGroupPageDto[]>> {
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

        return this.http.post<ProductGroupPageDto[]>(newresourceUrl, req['filter'], { observe: 'response' });
    }

    save(productGroup: ProductGroup): Observable<EntityResponseType> {
        const copy = this.convert(productGroup);
        return this.http.post<ProductGroup>(`${this.serverUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    private convert( productGroup: ProductGroup): ProductGroup {
        const copy: ProductGroup = Object.assign({}, productGroup);
        return copy;
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: ProductGroup = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertItemFromServer(productGroup: ProductGroup): ProductGroup {
        const copyOb: ProductGroup = Object.assign({}, productGroup);
        return copyOb;
    }

}
