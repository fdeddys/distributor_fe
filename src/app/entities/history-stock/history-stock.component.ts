import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { isNumber } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { SERVER_PATH, TOTAL_RECORD_PER_PAGE } from 'src/app/shared/constants/base-constant';
import { GlobalComponent } from 'src/app/shared/global-component';
import Swal from 'sweetalert2';
import { Product, ProductPageDto } from '../product/product.model';
import { ProductService } from '../product/product.service';
import { Warehouse, WarehouseDto } from '../warehouse/warehouse.model';
import { WarehouseService } from '../warehouse/warehouse.service';
import { HistoryStock, HistoryStockPageDto } from './history-stock.model';
import { HistoryStockService } from './history-stock.service';

@Component({
  selector: 'op-history-stock',
  templateUrl: './history-stock.component.html',
  styleUrls: ['./history-stock.component.css']
})
export class HistoryStockComponent implements OnInit {

    modelProduct: Observable<Product[]>;
    productSelected: Product;

    warehouses: Warehouse[];
    warehouseSelected: number;

    selectedDateStart: NgbDateStruct;
    selectedDateEnd: NgbDateStruct;

    totalRecord = TOTAL_RECORD_PER_PAGE;
    historyStocks: HistoryStock[];
    totalData = 0;
    curPage =1;
    totalRecordProduct = GlobalComponent.maxRecord;

    constructor(
        private http: HttpClient,
        private spinner: NgxSpinnerService,
        private warehouseService: WarehouseService,
        private historyStockService: HistoryStockService,
        private localStorage: LocalStorageService,
    ) {
    }
    
    ngOnInit(): void {
        let total = this.localStorage.retrieve('max_search_product');
        if ( isNumber(total)) {
            this.totalRecordProduct = total;
        }
        this.loadWarehouse();
        this.setDefaultValue();
    }

    setDefaultValue() {
        const today = new Date();

        this.selectedDateStart = {
            year: today.getFullYear(),
            day: today.getDate(),
            month: today.getMonth() + 1,
        };
        this.selectedDateEnd = {
            year: today.getFullYear(),
            day: today.getDate(),
            month: today.getMonth() + 1,
        };

      
    }

    
    formatterProdList(value: any) {
        return value.name + ' { ' + value.code + ' } ';
    }

    formatterProdInput(value: any) {
        if (value.name) {
            return value.name;
        }
        return value;
    }

    getItem(event: any) {
        // event.preventDefault();
        console.log('get item product ==>', event);
        this.productSelected = event.item;
    }

    searchProduct = (text$: Observable<string>) => {
        return text$.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap((term) => this.searchProd(term)
                .pipe(
                    catchError(
                        () => {
                            return of([]);
                        }
                    )
                ),
            )
        );
    }

    searchProd(term): Observable<any> {
        const filter = {
                    name: term,
                    code: '',
                };
        const serverUrl = SERVER_PATH + 'product';
        const newresourceUrl = serverUrl + `/page/1/count/${this.totalRecordProduct}`;
        return  this.http.post(newresourceUrl, filter, { observe: 'response' })
            .pipe(
                map(
                    (response: HttpResponse<ProductPageDto>) => {
                        return response.body.contents;
                    }
                )
            );
    }

    loadWarehouse() {
        this.warehouseService
            .getWarehouse()
            .subscribe(
                (response: HttpResponse<WarehouseDto>) => {
                    if (response.body.errCode != "00") {
                        Swal.fire('error',"Failed get data warehouse", "error");
                        return ;
                    }
                    this.warehouses = response.body.contents;
                    if (this.warehouses.length>0) {
                        this.warehouseSelected = this.warehouses[0].id;
                    }
                }
            );
    }

    preview(): void{
        if (this.productSelected == null) {
            Swal.fire('error',"Product not selected", "error");
            return;
        }

        if (this.warehouseSelected == null) {
            Swal.fire('error',"Warehouse not selected", "error");
            return;
        }

        if (this.selectedDateStart == null) {
            Swal.fire('error',"Date not selected", "error");
            return;
        }

        if (this.selectedDateEnd == null) {
            Swal.fire('error',"Date not selected", "error");
            return;
        }

        this.curPage = 1;
        this.loadPage(this.curPage) 
    }

    loadPage(page) {
        
      

        let filter = {
            startDate : this.getSelectedDate(this.selectedDateStart),
            endDate: this.getSelectedDate(this.selectedDateEnd),
            productCode: this.productSelected.code,
            warehouseId: +this.warehouseSelected
        };

        this.historyStockService.filter({
            filter: filter,
            page: page,
            count: this.totalRecord,
        }).subscribe(
            (res: HttpResponse<HistoryStockPageDto[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { }
        );
        console.log(page);
        // console.log(this.brand);
    }

    getSelectedDate(selectedDate: NgbDateStruct ): string{
        const month = ('0' + selectedDate.month).slice(-2);
        const day = ('0' + selectedDate.day).slice(-2);
        const tz = 'T00:00:00+07:00';
        return selectedDate.year + '-' + month + '-' + day + tz;
    }

    private onSuccess(data, headers) {
        if (data.contents.length < 0) {
            return;
        }
        this.historyStocks = data.contents;
        this.totalData = data.totalRow;
    }

    private onError(error) {
        console.log('error..');
    }


}
