import { Component, OnInit } from '@angular/core';
import { User } from './user.model';
import { UserService } from './user.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'op-user-change-password',
  templateUrl: './user-change-password.component.html',
  styleUrls: ['./user-change-password.component.css']
})
export class UserChangePasswordComponent implements OnInit {

    userName = '';
    credential = {
        oldPass: '',
        confirmNewPass: '',
        newPass: ''
    };
    errMsg = '';

    confirmStatus = false;

    user: User;

    constructor(private userService: UserService,
                private modalService: NgbModal) { }

    ngOnInit() {
        this.userService.getCurrentUser()
            .subscribe(
                (res: HttpResponse<User>) => this.userName = res.body.errDesc,
                (res: HttpErrorResponse) => console.log('error', res.message)
            );

    }

    onKey() {
        console.log(this.credential.confirmNewPass);
        if (this.credential.confirmNewPass !== this.credential.newPass) {
            this.errMsg = 'Password not match';
            this.confirmStatus = false;
        } else if (this.credential.newPass === '') {
            this.errMsg = 'Password cannot be null';
            this.confirmStatus = false;
        }else if (this.credential.newPass.length <8 ) {
            this.errMsg = 'Password  min 8 char';
            this.confirmStatus = false;
        }else {
            this.errMsg = '';
            this.confirmStatus = true;

        }
    }

    save(): void {

        this.savePassword();

    }


    save2(): void {
        console.log('dsadas');

        const re = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$');
        // re.
        if (!re.test(this.credential.confirmNewPass)) {
            console.log('gagal');
            this.errMsg = 'Minimum eight characters, at least one ' +
            'uppercase letter, one lowercase letter, one number and one special character';
        } else {
            console.log('berhasil');
            this.savePassword();
        }

        // this.userService.changePassword(this.userName, this.credential)
        //     .subscribe(
        //         result => {
        //             if (result.body.errCode === '00') {
        //                 Swal.fire('Success', 'Success change password', 'success');
        //                 this.closeForm('tutup save');
        //                 this.modalService.dismissAll('tutup save');
        //             } else {
        //                 Swal.fire('Failed', result.body.errDesc, 'error');
        //             }
        //         });
    }

    savePassword(): void {
        this.userService.changePassword(this.userName, this.credential)
                    .subscribe(
                        result => {
                            if (result.body.errCode === '00') {
                                Swal.fire('Success', 'Success change password', 'success');
                                this.closeForm('tutup save');
                                this.modalService.dismissAll('tutup save');
                            } else {
                                Swal.fire('Failed', result.body.errDesc, 'error');
                            }
                        });
    }

    closeForm(reason): void {
        this.modalService.dismissAll(reason);
    }

}
