import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupplierComponent } from './supplier.component';
import { SupplierModalComponent } from './supplier-modal/supplier-modal.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SupplierService } from './supplier.service';

@NgModule({
    declarations: [
        SupplierComponent,
        SupplierModalComponent],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
    ],
    entryComponents: [
        SupplierComponent,
        SupplierModalComponent,
    ],
    providers: [
        SupplierService,
    ],
    // exports: [
    //     BrandComponent,
    //     BrandModalComponent,
    // ]
})
export class SupplierModule { }
