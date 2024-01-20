import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { Parameter } from './parameter.model';

@Injectable({
  providedIn: 'root'
})
export class ParameterService {

  private serverUrl = SERVER_PATH + 'parameter';

  constructor(private http: HttpClient) { }

  findByName(paramName: string):  Observable<HttpResponse<Parameter>> {
      return this.http.get<Parameter>(`${this.serverUrl}/byname/${paramName}`, {  observe: 'response' })
  }
}
