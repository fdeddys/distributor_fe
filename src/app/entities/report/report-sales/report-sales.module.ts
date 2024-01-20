import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportSalesComponent } from './report-sales.component';
import { ReportSalesService } from './report-sales.service';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [ReportSalesComponent],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
    ],
    providers: [
        ReportSalesService
    ]
})
export class ReportSalesModule { }

