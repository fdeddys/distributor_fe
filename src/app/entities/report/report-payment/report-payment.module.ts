import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportPaymentComponent } from './report-payment.component';
import { ReportPaymentService } from './report-payment.service';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
	declarations: [
		ReportPaymentComponent
	],
	imports: [
		CommonModule,
        FormsModule,
        NgbModule,
  	],
	providers: [
		ReportPaymentService
	]
})
export class ReportPaymentModule { }
