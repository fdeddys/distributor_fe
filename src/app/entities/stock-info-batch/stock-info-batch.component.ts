import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { TOTAL_RECORD_PER_PAGE } from 'src/app/shared/constants/base-constant';
import { Product } from '../product/product.model';
import { ReceivingDetail, ReceivingDetailPageDto } from '../receiving/receiving.model';
import { Stock, StockPageDto } from '../stock/stock.model';
import { StockService } from '../stock/stock.service';
import { StockInfoBatchService } from './stock-info-batch.service';

@Component({
  selector: 'op-stock-info-batch',
  templateUrl: './stock-info-batch.component.html',
  styleUrls: ['./stock-info-batch.component.css']
})
export class StockInfoBatchComponent implements OnInit {

    selectedDateStart: NgbDateStruct;
    selectedDateEnd: NgbDateStruct;

    totalRecord = TOTAL_RECORD_PER_PAGE;
    totalData = 0;
    curPage =1;
    receivingDetails: ReceivingDetail[];
    stocks: Stock[];
    productName='';
    
    batchNo: string = '';    
    uomSelected = '';
    sellPriceSelected : number= 0;
    constructor(
        private http: HttpClient,
        private spinner: NgxSpinnerService,
        private stockInfoBatchService: StockInfoBatchService,
        private stockService: StockService,
    ) { }

    ngOnInit() {
        this.setToday()
    }

    setToday() {
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

    loadPage(page) {
        this.stockInfoBatchService.filter({
            page : page,
            count: this.totalRecord,
            filter: {
                expiredStart : this.getSelectedDate(this.selectedDateStart),
                expiredEnd: this.getSelectedDate(this.selectedDateEnd),
                batch: this.batchNo,
                productName: this.productName,
            }
           
        }).subscribe(
            (res: HttpResponse<ReceivingDetailPageDto>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => {},
            () => { }
        );
        console.log(page);
        // console.log(this.brand);
    }

    private onSuccess(data, headers) {
        if (data.contents.length < 0) {
            return;
        }
        this.receivingDetails = data.contents;
        this.totalData = data.totalRow;
    }

    getSelectedDate(selectedDate: NgbDateStruct ): string{

        console.log('selected date ==>', selectedDate)
        if (selectedDate == null) {
            return ""
        }
        const month = ('0' + selectedDate.month).slice(-2);
        const day = ('0' + selectedDate.day).slice(-2);
        const tz = 'T00:00:00+07:00';
        return selectedDate.year + '-' + month + '-' + day ;
    }

    preview(){
        this.receivingDetails=[];
        this.loadPage(this.curPage);
    }

    openStock(product : Product) {
        console.log('Open product ==>', product)
        this.uomSelected = product.smallUom.name;
        this.sellPriceSelected =product.sellPrice;
        this.loadStockWarehouse(product.id, 1);
    }


    loadStockWarehouse(productId, page) {
        this.stockService.filter({
            productId: productId,
            page: page,
            count: 5,
        }).subscribe(
            (res: HttpResponse<StockPageDto[]>) => this.onSuccessStock(res.body, res.headers),
            (res: HttpErrorResponse) => {},
            () => { }
        );
    }

    private onSuccessStock(data, headers) {
        if (data.contents.length < 0) {
            return;
        }
        this.stocks = data.contents;
    }

}
