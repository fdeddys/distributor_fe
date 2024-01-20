import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SalesmanComponent } from './salesman.component';
import { SalesmanModalComponent } from './salesman-modal/salesman-modal.component';
import { SalesmanService } from './salesman.service';


@NgModule({
    declarations: [
        SalesmanComponent,
        SalesmanModalComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
    ],
    entryComponents: [
        SalesmanComponent,
        SalesmanModalComponent
    ],
    providers: [
        SalesmanService,
    ],
    exports: [
        SalesmanComponent,
        SalesmanModalComponent
    ]
})
export class SalesmanModule { }
