import { Component, AfterViewInit, EventEmitter, Output, OnInit } from '@angular/core';
import { UserService } from 'src/app/entities/user/user.service';
import { LocalStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserChangePasswordComponent } from 'src/app/entities/user/user-change-password.component';
import { LoginService } from 'src/app/entities/login/login.service';
import { APPNAME, APP_VERSION } from '../constants/base-constant';
import { HttpResponse } from '@angular/common/http';
import { Version } from 'src/app/entities/user/user.model';

@Component({
    selector: 'op-navigation',
    templateUrl: './navigation.component.html'
})
export class NavigationComponent implements OnInit {

    // title = 'Apotek Kurnia Sehat';
    title =  APPNAME;
    version = '';
    constructor(private localStorage: LocalStorageService,
                private router: Router,
                private userService: UserService,
                private modalService: NgbModal,
                private loginService: LoginService) { }

    ngOnInit() {
        this.version = APP_VERSION + ":";
        this.userService.getCurrentVersion().subscribe(
            (res: HttpResponse<Version>) => {
                let ver = res.body.version;
                this.version += ver;
            } 
        )
    }

    tes() {
        console.log('masokkk');
    }

    openChangePassword() {
        const modalRef = this.modalService.open(UserChangePasswordComponent, { size: 'lg' });
        console.log('change password');
        return null;
    }

    logout() {
        this.loginService.logout();
        // this.userService.logout();
        this.router.navigate(['']);
        this.localStorage.clear('token');
        // this.router.navigate(['/#/']);
        // location.reload();
        // setTimeout( () => { /*Your Code*/ }, 3000 );
        // location.reload();
    }
}
