import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleComponent } from './role.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { RoleService } from './role.service';
import { RoleModalComponent } from './role.modal.component';

@NgModule({
  declarations: [
    RoleComponent,
    RoleModalComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
  ],
  entryComponents: [
    RoleComponent,
    RoleModalComponent
  ],
  providers: [
    RoleService,
  ]
})
export class RoleModule { }
