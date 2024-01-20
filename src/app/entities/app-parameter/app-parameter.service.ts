import { Injectable } from '@angular/core';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { AppParameter } from './app-parameter.model';
import { Observable } from 'rxjs';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { tap } from 'rxjs/operators';

export type EntityResponseType = HttpResponse<AppParameter>;

@Injectable({
  providedIn: 'root'
})
export class AppParameterService {

    private serverUrl = SERVER_PATH + 'appParameter';


    constructor(private http: HttpClient) { }

    getAll(): Observable<HttpResponse<AppParameter[]>> {
        let newResourceUrl = null;

        newResourceUrl = this.serverUrl + '/all';

        const result = this.http.get<AppParameter[]>(newResourceUrl, {observe: 'response'}).pipe(
            tap(results => console.log('raw', results))
        );

        return result;
    }

    getRiskParameter(): Observable<HttpResponse<AppParameter[]>> {
        let newResourceUrl = null;

        newResourceUrl = this.serverUrl + '/risk-parameter';

        const result = this.http.get<AppParameter[]>(newResourceUrl, { observe: 'response' }).pipe(
            tap(results => console.log('raw RISK PARAMETER', results))
        );

        return result;
    }
}
