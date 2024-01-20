import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportPaymentSupplierComponent } from './report-payment-supplier.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    ReportPaymentSupplierComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
  ],
  providers: [
    ReportPaymentSupplierModule
  ]
})
export class ReportPaymentSupplierModule { }


