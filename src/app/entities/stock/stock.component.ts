import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TOTAL_RECORD_PER_PAGE } from 'src/app/shared/constants/base-constant';
import { Product, ProductPageDto } from '../product/product.model';
import { ProductService } from '../product/product.service';
import { Stock, StockPageDto } from './stock.model';
import { StockService } from './stock.service';

@Component({
  selector: 'op-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {

    products: Product[];
    stocks: Stock[];
    selectedProduct: Product;
    curPage = 1;
    curPageWh = 1;
    totalData = 0;
    totalDataStocks =0;
    totalRecord = TOTAL_RECORD_PER_PAGE;
    searchTerm = {
        code: '',
        name: '',
        composition : '',

    };
    closeResult: string;
    uomSelected = '';
    sellPriceSelected : number= 0;
    constructor(
        private route: ActivatedRoute,
        private productService: ProductService,
        private stockService: StockService,
    ) { }

    ngOnInit() {
        this.loadAll(this.curPage);
    }

    onFilter() {
        this.loadAll(this.curPage);
    }

    loadAll(page) {
        this.productService.filter({
            filter: this.searchTerm,
            page: page,
            count: this.totalRecord,
        }).subscribe(
            (res: HttpResponse<ProductPageDto>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { }
        );
        console.log(page);
        // console.log(this.brand);
    }
    
    private onSuccess(data, headers) {
        this.stocks =[];
        if (data.contents.length < 0) {
            return;
        }
        this.products = data.contents;
        this.totalData = data.totalRow;
    }

    openStock(product : Product) {
       
        this.curPageWh = 1;
        this.selectedProduct = product;
        this.uomSelected = product.smallUom.name;
        this.sellPriceSelected =product.sellPrice;
        this.loadStockWarehouse(product.id, this.curPageWh);
    }
    
    loadPageWh() {
        this.loadStockWarehouse(this.selectedProduct, this.curPageWh);
    }


    loadStockWarehouse(productId, page) {
        this.stockService.filter({
            productId: productId,
            page: page,
            count: 5,
        }).subscribe(
            (res: HttpResponse<StockPageDto[]>) => this.onSuccessStock(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { }
        );

    }

    private onSuccessStock(data, headers) {
        if (data.contents.length < 0) {
            return;
        }
        this.stocks = data.contents;
        this.totalDataStocks = data.totalRow;
    }


    private onError(error) {
        console.log('error..');
    }

    resetFilter() {
        this.searchTerm = {
            code: '',
            name: '',
            composition : '',

        };
        this.loadAll(1);
    }

    loadPage() {
        this.loadAll(this.curPage);
    }

    getSellPrice(product: Product) {

        if (product.sellPriceType==0) {
            return product.sellPrice
        }
        return  Math.round(product.hpp + (product.sellPrice * product.hpp / 100))
    }
}
