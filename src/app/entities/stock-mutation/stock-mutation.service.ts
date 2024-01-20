import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { StockMutation, StockMutationDetailPageDto, StockMutationPageDto } from './stock-mutation.model';

export type EntityResponseType = HttpResponse<StockMutation>;

@Injectable({
    providedIn: 'root'
})

export class StockMutationService {

    private serverUrl = SERVER_PATH + 'stock-mutation';
    constructor(private http: HttpClient) { }

    filter(req?: any): Observable<HttpResponse<StockMutationPageDto[]>> {
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
        return this.http.post<StockMutationPageDto[]>(newresourceUrl, req['filter'], { observe: 'response' });
    }


    findById(id: number): Observable<any> {
        const pathOrderDetailUrl = SERVER_PATH + 'stock-mutation-detail';
        return this.http.get<StockMutation>(`${this.serverUrl}/${id}`)
            .pipe(
                flatMap(
                    (stockMutation: any) => {
                        const filter = {
                            StockMutationNumber : '',
                            StockMutationID : stockMutation.id,
                        };
                        return this.http.post<StockMutationDetailPageDto>(`${pathOrderDetailUrl}/page/1/count/1000`, 
                            filter, { observe: 'response' })
                            .pipe(
                                map( (resDetail) => {
                                    let details = resDetail.body.contents;
                                    stockMutation.detail = details;
                                    return stockMutation;
                                })
                            );
                    }
                )
            );
    }

    save(stockMutation: StockMutation): Observable<EntityResponseType> {
        const copy = this.convert(stockMutation);
        return this.http.post<StockMutation>(`${this.serverUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    approve(stockMutation: StockMutation): Observable<EntityResponseType> {
        const copy = this.convert(stockMutation);
        return this.http.post<StockMutation>(`${this.serverUrl}/approve`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    reject(stockMutation: StockMutation): Observable<EntityResponseType> {
        const copy = this.convert(stockMutation);
        return this.http.post<StockMutation>(`${this.serverUrl}/reject`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    preview(id: number, tipeReport: string):  Observable<Blob>  {
        return this.http.post(`${this.serverUrl}/print/${id}`, {}, { responseType: 'blob' });
    }

    private convert(stockMutation: StockMutation): StockMutation {
        const copy: StockMutation = Object.assign({}, stockMutation);
        return copy;
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: StockMutation = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertItemFromServer(stockMutation: StockMutation): StockMutation {
        const copyOb: StockMutation = Object.assign({}, stockMutation);
        return copyOb;
    }
}
