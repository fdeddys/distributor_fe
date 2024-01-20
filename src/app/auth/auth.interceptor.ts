import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';
import { LoginService } from '../entities/login/login.service';
import { SERVER } from '../shared/constants/base-constant';
import { map } from 'rxjs/internal/operators/map';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private localStorage: LocalStorageService,
        private router: Router,
        private loginService: LoginService,
    ) {}

    private serverUrl = SERVER;

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // console.log('get token' + localStorage.getItem('ngx-webstorage|token'));
        // if (request.url.indexOf('/') === -1) {
        //     return next.handle(request); // do nothing
        // }

        console.log('Isi dari intercept next ==>>' , request.url);
        if (!request || !request.url || (/^http/.test(request.url) &&
        !( this.serverUrl && request.url.startsWith(this.serverUrl)))) {
            // return next.handle(request);
            // console.log('request : ', request);
            // return next.handle(request);
            console.log('ini direktori awal');
        } else {
            console.log('ini bukan direk awal');
        }

        const token = this.localStorage.retrieve('token');

        if (!token) {
            console.log('expired token');
            // this.localStorage.clear('token');
            this.router.navigate(['']);
            // this.loginService.logout();
            // return;
        }

        console.log('masuk inteceptor', token);
        request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
        });
        //   return next.handle(request).pipe(
        //       map((event: HttpEvent<any>) => {
        //             console.log('masukkk =>', event);
        //             if (event instanceof HttpResponse) {
        //                 console.log('event--->>>', event);
        //             }
        //             return event;
        //         })
        //   );

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    console.log('event--->>>', event);
                    // this.errorDialogService.openDialog(event);
                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                console.log('error http response ->', error.message);
                console.log('error http response ->', error.status);
                if (error.status === 401) {
                    Swal.fire('401', 'You are not authorized to access data !', 'error');
                    this.loginService.logout();
                }
                if (error.status === 500) {
                    Swal.fire('500', error.message, 'error');
                    // this.loginService.logout();
                }
                return throwError(error);
            }));

    }

}
