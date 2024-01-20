import { Injectable } from '@angular/core';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { SupplierPageDto, Supplier, SupplierResult } from './supplier.model';
import { Observable } from 'rxjs';
import { EntityResponseType } from '../user/user.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

    private serverUrl = SERVER_PATH + 'supplier';
    constructor(private http: HttpClient) { }

    filter(req?: any): Observable<HttpResponse<SupplierPageDto>> {
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

        return this.http.post<SupplierPageDto>(newresourceUrl, req['filter'], { observe: 'response' });
    }

    findById(idSupp?: any): Observable<HttpResponse<SupplierResult>> {
 
        let newresourceUrl = null;

        newresourceUrl = this.serverUrl + `/id/${idSupp}`;

        return this.http.get<SupplierResult>(newresourceUrl, { observe: 'response' });
    }

    save(supplier: Supplier): Observable<EntityResponseType> {
        const copy = this.convert(supplier);
        return this.http.post<Supplier>(`${this.serverUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    private convert( supplier: Supplier): Supplier {
        const copy: Supplier = Object.assign({}, supplier);
        return copy;
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Supplier = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertItemFromServer(supplier: Supplier): Supplier {
        const copyOb: Supplier = Object.assign({}, supplier);
        return copyOb;
    }

}
