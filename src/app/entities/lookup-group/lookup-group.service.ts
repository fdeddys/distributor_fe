import { Injectable } from '@angular/core';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LookupGroup, LookupGroupDto } from './lookup-group.model';

@Injectable({
    providedIn: 'root'
})
export class LookupGroupService {

    private serverUrl = SERVER_PATH + 'lookup-group';

    constructor(private http: HttpClient) { }

    findForMerchantGroup():  Observable<HttpResponse<LookupGroupDto>> {
        return this.http.get<LookupGroupDto>(this.serverUrl, {  observe: 'response' })
            .pipe(
                tap(merchantGrouplist => console.log('raw ', merchantGrouplist ) )
            );
    }
}
