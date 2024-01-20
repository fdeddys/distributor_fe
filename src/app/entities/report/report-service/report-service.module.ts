import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportServiceService } from './report-service.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgbModule,
  ],
  providers: [
    ReportServiceService
]
})
export class ReportServiceModule { }
