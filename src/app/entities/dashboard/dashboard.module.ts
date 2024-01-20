import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const routesDashboard: Routes = [
  { path: '', component: DashboardComponent },
]

@NgModule({
    declarations: [
       DashboardComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        RouterModule.forChild(routesDashboard),
    ],
    entryComponents: [
        DashboardComponent,
    ],
})
export class DashboardModule { }
