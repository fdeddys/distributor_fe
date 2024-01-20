import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { RoleMenuView } from '../role/role.model';
import { UserMenu } from './menu.model';
import { SERVER_PATH, SERVER, PATH_IMAGES } from 'src/app/shared/constants/base-constant';
import { createRequestOption } from 'src/app/shared/httpUtil';

@Injectable()
export class AccessMatrixService {
    private serverUrl = SERVER_PATH + 'accessmatrix';
    private resourceUrl = SERVER_PATH + 'menu';

    constructor(private http: HttpClient) { }

    getMenuMock(): Observable<any> {
        return this.http.get('./assets/mockdata/menu-mock.json');
    }

    findByRoleMock(): Observable<any> {
        return this.http.get('./assets/mockdata/role-menu.json');
    }

    queryMenu(): Observable<HttpResponse<UserMenu[]>> {
        return this.http.get<UserMenu[]>(`${this.resourceUrl}/list-user-menu`, { observe: 'response' })
            .pipe(
                tap(result => console.log('raw ', result))
            );
    }

    query(req?: any): Observable<HttpResponse<UserMenu[]>> {
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
        if (pageNumber !== null) {
            newresourceUrl = this.resourceUrl + `/page/${pageNumber}/count/${pageCount}`;
            return this.http.get<UserMenu[]>(newresourceUrl, { observe: 'response' })
                .pipe(
                    // map((res: HttpResponse<memberType[]>) => this.convertArrayResponse(res))
                    tap(accessMatrixMenu => console.log('raw ', accessMatrixMenu))
                    // console.log('observable ', accessMatrixMenu)
                );
        } else {
            return this.http.get<UserMenu[]>(`${this.resourceUrl}/list-all-active-menu`, { observe: 'response' })
                .pipe(
                    // map((res: HttpResponse<memberType[]>) => this.convertArrayResponse(res))
                    tap(accessMatrixMenu => console.log('raw ', accessMatrixMenu))
                    // console.log('observable ', accessMatrixMenu)
                );
        }

    }

    findByRole(idrole?: any): Observable<HttpResponse<RoleMenuView[]>> {
        return this.http.get<RoleMenuView[]>(this.resourceUrl + `/role/${idrole}`, { observe: 'response' })
            .pipe(
                tap(menu => console.log('raw ', menu))
            );
    }

    save(req?: any): Observable<HttpResponse<any[]>> {
        console.log('Request ', req);

        let roleId = null;
        let newresourceUrl = null;

        Object.keys(req).forEach((key) => {
            if (key === 'roleId') {
                roleId = req[key];
            }
        });

        newresourceUrl = SERVER_PATH + `role/${roleId}`;
        return this.http.post<any[]>(newresourceUrl, req['menuIds'], { observe: 'response' })
            .pipe(
                // map((res: HttpResponse<Member[]>) => this.convertArrayResponse(res))
                tap(results => console.log('raw ', results))
                // console.log('observable ', billerCompanies)
            );

    }
}
