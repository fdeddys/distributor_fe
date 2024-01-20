import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerComponent } from './customer.component';
import { CustomerModalComponent } from './customer-modal/customer-modal.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomerService } from './customer.service';

@NgModule({
    declarations: [
        CustomerComponent,
        CustomerModalComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
    ],
    entryComponents: [
        CustomerComponent,
        CustomerModalComponent
    ],
    providers: [
        CustomerService,
    ],
    exports: [
        CustomerComponent,
        CustomerModalComponent
    ]
})
export class CustomerModule { }
