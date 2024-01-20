import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { Warehouse, WarehouseDto, WarehousePageDto } from './warehouse.model';

export type EntityResponseType = HttpResponse<Warehouse>;


@Injectable({
    providedIn: 'root'
})
export class WarehouseService {

    private serverUrl = SERVER_PATH + 'warehouse';
    constructor(private http: HttpClient) { }

    getWarehouse(req?: any): Observable<HttpResponse<WarehouseDto>> {

        var newresourceUrl = this.serverUrl;
        return this.http.get<WarehouseDto>(newresourceUrl, { observe: 'response' });
    }

    getWarehouseIn(req?: any): Observable<HttpResponse<WarehouseDto>> {

        var newresourceUrl = this.serverUrl;
        return this.http.get<WarehouseDto>(newresourceUrl + '/in', { observe: 'response' });
    }

    getWarehouseOut(req?: any): Observable<HttpResponse<WarehouseDto>> {

        var newresourceUrl = this.serverUrl;
        return this.http.get<WarehouseDto>(newresourceUrl + '/out', { observe: 'response' });
    }

    async getWarehousePromise(req?: any) {

        var newresourceUrl = this.serverUrl;
        return this.http.get<WarehouseDto>(newresourceUrl).toPromise();
    }

    filter(req?: any): Observable<HttpResponse<WarehousePageDto[]>> {
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

        return this.http.post<WarehousePageDto[]>(newresourceUrl, req['filter'], { observe: 'response' });
    }

    save(warehouse: Warehouse): Observable<EntityResponseType> {
        const copy = this.convert(warehouse);
        return this.http.post<Warehouse>(`${this.serverUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    private convert( warehouse: Warehouse): Warehouse {
        const copy: Warehouse = Object.assign({}, warehouse);
        return copy;
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Warehouse = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertItemFromServer(warehouse: Warehouse): Warehouse {
        const copyOb: Warehouse = Object.assign({}, warehouse);
        return copyOb;
    }
    
}
