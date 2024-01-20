import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApotikParamComponent } from './apotik-param.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ApotikParamService } from './apotik-param.service';

@NgModule({
  declarations: [
    ApotikParamComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
  ],
  entryComponents: [
    ApotikParamComponent
],
providers: [
    ApotikParamService,
],
exports: [
  ApotikParamComponent
]
})
export class ApotikParamModule { }
