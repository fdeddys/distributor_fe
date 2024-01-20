import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { UserComponent } from './user.component';
import { UserService } from './user.service';
import { UserModalComponent } from './user.modal.component';
import { UserChangePasswordComponent } from './user-change-password.component';

@NgModule({
  declarations: [
    UserComponent,
    UserModalComponent,
    UserChangePasswordComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
  ],
  entryComponents: [
    UserComponent,
    UserModalComponent,
    UserChangePasswordComponent
  ],
  providers: [
    UserService,
  ]
})
export class UserModule { }
