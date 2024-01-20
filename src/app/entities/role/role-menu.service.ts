import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { RoleMenuView } from './role.model';

export type EntityResponseType = HttpResponse<RoleMenuView>;


@Injectable({
    providedIn: 'root'
})
export class RoleMenuService {

    private serverUrl = SERVER_PATH + 'menu';

    constructor(private http: HttpClient) { }

    findByRoleID(id: number): Observable< HttpResponse<RoleMenuView[]>> {
        return this.http.get<RoleMenuView[]>(`${this.serverUrl}/role/${id}`, { observe: 'response'})
        .pipe(
            tap(results => console.log('raw ', results ) )
        );
    }

    update(roleMenu: RoleMenuView): Observable<EntityResponseType> {
  
        // const copy = this.convertItemJSON(roleMenu);
        // console.log('prepare post++', copy, '++', `${this.serverUrl}`);
        // return this.http.post<Role>(`${this.serverUrl}/`, copy);

        return this.http.post<RoleMenuView>(`${this.serverUrl}/update-role`, roleMenu, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }


    private convertResponse(res: EntityResponseType): EntityResponseType {
        console.log('convert response');
        const body: RoleMenuView = this.convertItemJSON(res.body);
        return res.clone({body});
    }

    private convertItemJSON(roleMenu: RoleMenuView): RoleMenuView {
        const copyOb: RoleMenuView = Object.assign({}, roleMenu);
        return copyOb;
    }
}
