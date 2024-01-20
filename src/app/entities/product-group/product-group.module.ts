import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductGroupComponent } from './product-group.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductGroupService } from './product-group.service';
import { ProductGroupModalComponent } from './product-group-modal/product-group-modal.component';

@NgModule({
    declarations: [
        ProductGroupComponent,
        ProductGroupModalComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
    ],
    entryComponents: [
        ProductGroupComponent,
        ProductGroupModalComponent,
      ],
      providers: [
        ProductGroupService,
      ],
      exports: [
        ProductGroupModalComponent,
      ]
})
export class ProductGroupModule { }
