import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { ApotikParam } from './apotik-param.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export type EntityResponseType = HttpResponse<ApotikParam >;


@Injectable({
  providedIn: 'root'
})
export class ApotikParamService {
  
  private serverUrl = SERVER_PATH + 'parameter';
  constructor(private http: HttpClient) { }

  getAll(): Observable<HttpResponse<ApotikParam[]>> {
   
    let newresourceUrl = null;
    newresourceUrl = this.serverUrl + `/all`;

    return this.http.get<ApotikParam[]>(newresourceUrl, { observe: 'response' });
  }

  update(param: ApotikParam): Observable<EntityResponseType> {
    const copy = this.convert(param);
    return this.http.post<ApotikParam>(`${this.serverUrl}`, copy, { observe: 'response'})
        .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
  }

  private convert( param: ApotikParam): ApotikParam {
    const copy: ApotikParam = Object.assign({}, param);
    return copy;
  }

  private convertResponse(res: EntityResponseType): EntityResponseType {
    const body: ApotikParam = this.convertItemFromServer(res.body);
    return res.clone({body});
  }

  private convertItemFromServer(param: ApotikParam): ApotikParam {
      const copyOb: ApotikParam = Object.assign({}, param);
      return copyOb;
  }


}
