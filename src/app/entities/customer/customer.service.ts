import { Injectable } from '@angular/core';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomerPageDto, Customer } from './customer.model';
import { EntityResponseType } from '../user/user.service';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {

    private serverUrl = SERVER_PATH + 'customer';
    constructor(private http: HttpClient) { }

    filter(req?: any): Observable<HttpResponse<CustomerPageDto>> {
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

        return this.http.post<CustomerPageDto>(newresourceUrl, req['filter'], { observe: 'response' });
    }

    save(customer: Customer): Observable<EntityResponseType> {
        const copy = this.convert(customer);
        return this.http.post<Customer>(`${this.serverUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    private convert( customer: Customer): Customer {
        const copy: Customer = Object.assign({}, customer);
        return copy;
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Customer = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertItemFromServer(customer: Customer): Customer {
        const copyOb: Customer = Object.assign({}, customer);
        return copyOb;
    }
}
