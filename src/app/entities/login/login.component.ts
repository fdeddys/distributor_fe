import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { LoginService } from './login.service';
import Swal from 'sweetalert2';
import { ParameterService } from '../parameter/parameter.service';
import { Parameter } from '../parameter/parameter.model';
import { ThrowStmt } from '@angular/compiler';
import { GlobalComponent } from 'src/app/shared/global-component';
import { isNumber } from 'lodash';
// declare var grecaptcha: any;

@Component({
  selector: 'op-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  showAlert = false;
  msgAlert = '';
  captchaError = false;

  credential = {
    username: '',
    password: ''
  };
  constructor(private router: Router,
              private localStorage: LocalStorageService,
              private loginService: LoginService,
              private parameterService: ParameterService,
     ) { }

  ngOnInit() {
  }

  closeAlert() {
    console.log('close alert');
  }

  login() {
    this.connectToServer();
    // const cb = callback || function() {};
    // const data = {
    //   username: credentials.username,
    //   password: credentials.password
    // };

    // const response = grecaptcha.getResponse();
    // if (response.length === 0) {
    //   // this.captchaError = true;
    //   // this.showAlert = true;
    //   // this.msgAlert = 'Recaptcha not verified ! ';
    //   Swal.fire('Failed', 'Recaptcha not verified ! ', 'error');
    //   return;
    // }
    // this.loginService.verifyCaptcha(response).subscribe(
    //   data => {
    //     if (data.status = 200 ) {
    //       this.connectToServer();
    //     } else {
    //       Swal.fire('Failed', 'Recaptcha not verified ! ', 'error');
    //     }
    //   }
    // );
  }

  connectToServer() {
    return new Promise((resolve) => {
      this.loginService.login(this.credential).subscribe((data) => {
          console.log('hasil login isi resolve data ', data);
          resolve(data);
          if (data !== '') {
            // grecaptcha.reset();
            this.router.navigate(['main']);
            this.parameterService.findByName("total_record_product")
                .subscribe(
                    (res => {
                    if (res.body.value !== '0') {
                        let resBody = res.body.value;
                        let total = Number(resBody);
                        // if (  isNumber(resBody)){
                        //   total = Number(resBody)
                        // } else {
                        //   console.log('not number ' + resBody + ' -- ' + isNumber(resBody));
                        // };
                        GlobalComponent.maxRecord = total;
                        this.localStorage.store('max_search_product', total);
                    } 
                    }),
                    (err => {
                        console.log("Failed get param : max_search_product" )
                    })
                )
            this.parameterService.findByName("tax")
                .subscribe(
                    (res => {
                    if (res.body.value !== '0') {
                        let resBody = res.body.value;
                        let tax = Number(resBody);
                        GlobalComponent.tax = tax;
                        this.localStorage.store('tax', tax);
                    } 
                    }),
                    (err => {
                        console.log("Failed get param : TAX")
                    })
                )
            return null;
          } else {
            console.log('isi data --> ', data);
            this.showAlert = true;
            // let err_login = this.localStorage.retrieve('err_login');
            this.msgAlert = 'Invalid login !';
            // Swal.fire('Failed', err_login, 'error');
            // grecaptcha.reset();
            // console.log('user not valid');
          }
          // return cb();
      }, (err) => {
        this.showAlert = true;
        this.msgAlert = 'Failed to connect to server ! ';
          console.log('hasil login gagal ');
          // grecaptcha.reset();
          Swal.fire('Failed', this.msgAlert, 'error');
          // this.logout();
          // reject();
          // return cb(err);
      });
  });

    // this.localStorage.store('token', '123');
    // this.router.navigate(['main']);
  }

}

