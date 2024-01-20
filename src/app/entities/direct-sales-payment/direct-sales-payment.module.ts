import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DirectSalesPaymentComponent } from './direct-sales-payment.component';
import { DirectSalesPaymentService } from './direct-sales-payment.service';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router';
import { DirectSalesPaymentModalComponent } from './direct-sales-payment-modal/direct-sales-payment-modal.component';

const routes: Routes = [
        { path: '', component: DirectSalesPaymentComponent },
        { path: ':id', component: DirectSalesPaymentModalComponent },
    ]

@NgModule({
    declarations: [
        DirectSalesPaymentComponent,
        DirectSalesPaymentModalComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        RouterModule.forChild(routes),
    ],
    entryComponents: [
        DirectSalesPaymentComponent,
    ],
    providers: [
        DirectSalesPaymentService
    ],
})
export class DirectSalesPaymentModule { 
}
