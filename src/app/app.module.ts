import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgmCoreModule } from '@agm/core';
import {
  CommonModule,
  LocationStrategy,
  HashLocationStrategy
} from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { EntityModule } from './entities/entity.module';
import { Page404Component } from './err/page404/page404.component';
import { MainComponent } from './main/main.component';

import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';

import { SpinnerComponent } from './shared/spinner.component';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { NavigationComponent } from './shared/header-navigation/navigation.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { TreeViewComponent } from './shared/sidebar/treeview.component';
import {NgxWebstorageModule} from 'ngx-webstorage';

import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { SharedService } from './shared/sidebar/share.service';
import { AuthInterceptor } from './auth/auth.interceptor';

import { ChartsModule } from 'ng2-charts';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { CommonValidatorDirective } from './validators/common.validator';
// import { OnlyNumberDirective } from './entities/app-directive/only-number.directive';
import { ReactiveFormsModule } from '@angular/forms';

import { TreeviewModule } from 'ngx-treeview';

import { ToastrModule } from 'ngx-toastr';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerModule } from "ngx-spinner";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 1,
  wheelPropagation: true,
  minScrollbarLength: 20
};

@NgModule({
  declarations: [
    AppComponent,
    Page404Component,
    MainComponent,
    SpinnerComponent,
    NavigationComponent,
    SidebarComponent,
    TreeViewComponent,
    CommonValidatorDirective,
    // OnlyNumberDirective,
  ],
  imports: [
    NgbModule,
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-bottom-center'
    }),
    NgxSpinnerModule,
    FormsModule,
    HttpClientModule,
    EntityModule,
    AppRoutingModule,
    CommonModule,
    PerfectScrollbarModule,
    SlimLoadingBarModule.forRoot(),
    AgmCoreModule.forRoot({ apiKey: 'AIzaSyBUb3jDWJQ28vDJhuQZxkC0NXr_zycm8D0' }),
    AngularFontAwesomeModule,
    NgxWebstorageModule.forRoot(),
    ChartsModule,
    NgxUiLoaderModule,
    ReactiveFormsModule,
    TreeviewModule.forRoot(),
    
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    SharedService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    // CommonValidatorDirective,
  ],
  exports: [
    NavigationComponent,
    // OnlyNumberDirective,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
