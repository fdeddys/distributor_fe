import { Injectable } from '@angular/core';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from './role.model';
import { map, tap } from 'rxjs/operators';
import { createRequestOption } from 'src/app/shared/httpUtil';

export type EntityResponseType = HttpResponse<Role>;

@Injectable({
  providedIn: 'root'
})


export class RoleService {

  private serverUrl = SERVER_PATH + 'role';

  constructor(private http: HttpClient) { }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Role>(`${this.serverUrl}/${id}`, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    query(req?: any): Observable<HttpResponse<Role[]>> {
        const options = createRequestOption(req);
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

        if (pageNumber !== null ) {
            newresourceUrl = this.serverUrl + `/page/${pageNumber}/count/${pageCount}`;
            return this.http.get<Role[]>(newresourceUrl, {  observe: 'response' })
                .pipe(
                    tap(rolelist => console.log('raw ', rolelist ) )
                    );
        } else {
            return this.http.get<Role[]>(`${this.serverUrl}`, {  observe: 'response' })
            .pipe(
                tap(rolelist => console.log('raw ', rolelist ) )
                );
        }

    }

    save(role: Role): Observable<EntityResponseType> {
    // create(role: Role): Observable<Role> {
        const copy = this.convert(role);
        console.log('prepare post++', copy, '++', `${this.serverUrl}`);
        // return this.http.post<Role>(`${this.serverUrl}/`, copy);

        return this.http.post<Role>(`${this.serverUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    filter(req?: any): Observable<HttpResponse<Role[]>> {
        const options = createRequestOption(req);
        let allData = null;
        let pageNumber = null;
        let pageCount = null;
        let newresourceUrl = null;

        Object.keys(req).forEach((key) => {
            if (key === 'allData') {
                allData = req[key];
            }
            if (key === 'page') {
                pageNumber = req[key];
            }
            if (key === 'count') {
                pageCount = req[key];
            }
        });

        newresourceUrl = this.serverUrl + `/filter/page/${pageNumber}/count/${pageCount}`;
        return this.http.post<Role[]>(newresourceUrl, req['filter'], {  observe: 'response' })
            .pipe(
                tap(results => console.log('raw ', results ) )
            );
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        console.log('convert response');
        const body: Role = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to memberBank.
     */
    private convertItemFromServer(role: Role): Role {
      const copyOb: Role = Object.assign({}, role);
      return copyOb;
    }

    /**
     * Convert a Member to a JSON which can be sent to the server.
     */
    private convert( role: Role): Role {
        const copy: Role = Object.assign({}, role);
        return copy;
    }

}
