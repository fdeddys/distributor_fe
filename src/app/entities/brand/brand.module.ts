import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandComponent } from './brand.component';
import { BrandModalComponent } from './brand-modal/brand-modal.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrandService } from './brand.service';

@NgModule({
    declarations: [
        BrandComponent,
        BrandModalComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
    ],
    entryComponents: [
        BrandComponent,
        BrandModalComponent,
    ],
    providers: [
        BrandService,
    ],
    exports: [
        BrandComponent,
        BrandModalComponent,
    ]
})
export class BrandModule { }
