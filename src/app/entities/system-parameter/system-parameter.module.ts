import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { SystemParameterComponent } from './system-parameter.component';
import { SystemParameterService } from './system-parameter.service';
import { SystemParameterModalComponent } from './system-parameter.modal.component';

@NgModule({
  declarations: [
    SystemParameterComponent,
    SystemParameterModalComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule
  ],
  entryComponents: [
    SystemParameterComponent,
    SystemParameterModalComponent
  ],
  providers: [
    SystemParameterService
  ],
  exports: [
    SystemParameterModalComponent
  ]
})
export class SystemParameterModule { }
