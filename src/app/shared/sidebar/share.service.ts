import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { tap } from 'rxjs/operators';
import { SERVER_PATH } from '../constants/base-constant';

@Injectable()
export class SharedService {
    private statusUtilUrl = SERVER_PATH + 'util';

    constructor(private http: HttpClient) { }

    getStatus(req?: any): Observable<HttpResponse<string[]>> {
        return this.http.get<string[]>(`${this.statusUtilUrl}/terorisIdType`, { observe: 'response'})
        .pipe(
            tap(status => { })
        );
    }


}
