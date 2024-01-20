import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from './product.component';
import { ProductModalComponent } from './product-modal/product-modal.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from './product.service';

@NgModule({
    declarations: [
        ProductComponent,
        ProductModalComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
    ],
    entryComponents: [
        ProductComponent,
        ProductModalComponent
    ],
    providers: [
        ProductService
    ]
})
export class ProductModule { }
