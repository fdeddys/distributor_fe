import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { flatMap, map, tap } from 'rxjs/operators';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { StockOpname, StockOpnameDetailPageDto, StockOpnamePageDto } from './stock-opname.model';

export type EntityResponseType = HttpResponse<StockOpname>;

@Injectable({
  providedIn: 'root'
})
export class StockOpnameService {

    private serverUrl = SERVER_PATH + 'stock-opname';
    constructor(
        private http: HttpClient
        ) { }

    filter(req?: any): Observable<HttpResponse<StockOpnamePageDto[]>> {
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

        return this.http.post<StockOpnamePageDto[]>(newresourceUrl, req['filter'], { observe: 'response' });
    }

    findById(id: number, page: number, totalRecord: number): Observable<any> {

        const pathStockOpnameDetailUrl = SERVER_PATH + 'stock-opname-detail';

        return this.http
            .get<StockOpname>(`${this.serverUrl}/${id}`)
            .pipe(
                tap(stockOpname => console.log('raw ', stockOpname ) )
            );
            
        // return this.http
        //     .get<StockOpname>(`${this.serverUrl}/${id}`)
        //     .pipe(
        //         flatMap(
        //             (stockOpname: StockOpname) => {
        //                 const filter = {
        //                     stockOpnameNo : '',
        //                     stockOpnameId : stockOpname.id,
        //                 };
        //                 return this.http
        //                     .post<StockOpnameDetailPageDto>(`${pathStockOpnameDetailUrl}/page/${page}/count/${totalRecord}`, filter, { observe: 'response' })
        //                     .pipe(
        //                         map( (resDetail) => {
        //                             const details = resDetail.body.contents;
        //                             stockOpname.detail = details;
        //                             return stockOpname;
        //                         })
        //                     );
        //             }
        //         )
        //     );
    }


    save(stockOpname: StockOpname): Observable<EntityResponseType> {
        const copy = this.convert(stockOpname);
        return this.http.post<StockOpname>(`${this.serverUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    approve(stockOpname: StockOpname): Observable<EntityResponseType> {
        const copy = this.convert(stockOpname);
        return this.http.post<StockOpname>(`${this.serverUrl}/approve`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    downloadTemplate(warehouseID : number): Observable<Blob> {

        return this.http.post(`${this.serverUrl}/download-template/${warehouseID}`, {}, { responseType: 'blob' });
    }


    uploadTemplate(formData: FormData, stockOpnameId: number):Observable<EntityResponseType>{

        return this.http.post<StockOpname>(`${this.serverUrl}/upload-template/${stockOpnameId}`, formData, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    preview(id: number):  Observable<Blob>  {
        return this.http.post(`${this.serverUrl}/print/${id}`, {}, { responseType: 'blob' });
    }

    private convert(stockOpname: StockOpname): StockOpname {
        const copy: StockOpname = Object.assign({}, stockOpname);
        return copy;
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: StockOpname = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertItemFromServer(stockOpname: StockOpname): StockOpname {
        const copyOb: StockOpname = Object.assign({}, stockOpname);
        return copyOb;
    }

}
