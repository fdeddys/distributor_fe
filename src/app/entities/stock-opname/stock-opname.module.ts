import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockOpnameComponent } from './stock-opname.component';
import { StockOpnameEditComponent } from './stock-opname-edit/stock-opname-edit.component';
import { StockOpnameService } from './stock-opname.service';
import { StockOpnameDetailService } from './stock-opname-detail.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@NgModule({

    declarations: [
        StockOpnameComponent,
        StockOpnameEditComponent,
    ],
    imports: [
        CommonModule,
        NgbModule,
        FormsModule,
    ],
    entryComponents: [
        StockOpnameComponent,
        StockOpnameEditComponent,
    ],
    providers: [
        StockOpnameService,
        StockOpnameDetailService,
    ]
})
export class StockOpnameModule { }
