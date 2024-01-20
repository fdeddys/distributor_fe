import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { flatMap, isNumber } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalStorageService } from 'ngx-webstorage';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { SERVER_PATH, TOTAL_RECORD_PER_PAGE } from 'src/app/shared/constants/base-constant';
import { GlobalComponent } from 'src/app/shared/global-component';
import Swal from 'sweetalert2';
import { Product, ProductPageDto } from '../../product/product.model';
import { Warehouse, WarehouseDto } from '../../warehouse/warehouse.model';
import { WarehouseService } from '../../warehouse/warehouse.service';
import { StockOpnameDetailService } from '../stock-opname-detail.service';
import { StockOpname, StockOpnameDetail, StockOpnameDetailPageDto } from '../stock-opname.model';
import { StockOpnameService } from '../stock-opname.service';

@Component({
    selector: 'op-stock-opname-edit',
    templateUrl: './stock-opname-edit.component.html',
      styleUrls: ['./stock-opname-edit.component.css']
})
export class StockOpnameEditComponent implements OnInit {

    selectedDate: NgbDateStruct;
    stockOpname: StockOpname;
    stockOpnameDetails: StockOpnameDetail[];

    warehouses: Warehouse[];
    warehouseSelected: number =0;

    total: number;

    /* Untuk search product
        * http
        */
    model: Observable<Product[]>;
    searching = false;
    searchFailed = false;
    totalRecordProduct = GlobalComponent.maxRecord;

    productIdAdded = 0;
    productNameAdded = '';
    qty = 0;
    uomAdded = 0;
    uomAddedName = '';

    curPage = 1;
    totalData = 0;
    totalRecord = TOTAL_RECORD_PER_PAGE;

    fileUpload:File
    @ViewChild('inputFile') myInputVariable: ElementRef;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private warehouseService: WarehouseService,
        private http: HttpClient,
        private stockOpnameService: StockOpnameService,
        private stockOpnameDetailService: StockOpnameDetailService,
        private spinner: NgxSpinnerService,
        private localStorage: LocalStorageService,
    ) {
        this.total = 0;
    }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        const isValidParam = isNaN(+id);
        console.log('Param ==>', id, ' nan=>', isValidParam);
        if (isValidParam) {
            console.log('Invalid parameter ');
            this.backToLIst();
            return;
        }
        let total = this.localStorage.retrieve('max_search_product');
        if ( isNumber(total)) {
            this.totalRecordProduct = total;
        }
        this.loadData(+id);
        this.setToday();
    }

    backToLIst() {
        this.router.navigate(['/main/stock-opname']);
    }

    setToday() {
        const today = new Date();
        this.selectedDate = {
            year: today.getFullYear(),
            day: today.getDate(),
            month: today.getMonth() + 1,
        };
    }

    loadData(orderId: number) {

        console.log('id ==>?', orderId);
        
        // this.loadWarehouse();
        this.warehouseService
            .getWarehouse()
            .subscribe(
                (response: HttpResponse<WarehouseDto>) => {
                    if (response.body.errCode != "00") {
                        Swal.fire('error',"Failed get data salesman", "error");
                        return ;
                    }
                    this.warehouses = response.body.contents;
                    if (orderId === 0) {
                        this.loadNewData();
                        return;
                    }
                    this.loadDataByStockOpnameId(orderId);

                }
            );

    }

    loadNewData() {
        this.addNew();
    }

    getItem(event: any) {
        console.log('get item ==>', event);
        this.productIdAdded = event.item.id;
        this.productNameAdded = event.item.name;
        this.uomAdded = event.item.smallUomId;
    }

    loadDataByStockOpnameId(stockOpnameId: number) {

        this.spinner.show();
        setTimeout(() => {

            this.spinner.hide();
        }, 5000);

        this.curPage =1;
        let stockOpnameReq = this.stockOpnameService.findById(stockOpnameId, this.curPage, this.totalRecord);

        const filter = {
            stockOpnameId : stockOpnameId,
            page: this.curPage,
            count: this.totalRecord,
        };

        let stockOpnameDetailReq = this.stockOpnameDetailService.findByStockOpnameId(filter);

        let warehouseReq = this.warehouseService.filter({
            page: 1,
            count: 10000,
            filter: {
                code: '',
                name: '',
            }
        });

        const requestArray = [];
        requestArray.push(stockOpnameReq);
        requestArray.push(stockOpnameDetailReq);
        requestArray.push(warehouseReq);
        forkJoin(requestArray).subscribe(results => {
            this.processStockOpname(results[0]);
            this.processStockOpnameDetail(results[1])
            this.setWarehouseSelected();
            this.spinner.hide();
        });
    }

    processStockOpname(result: StockOpname) {
        console.log('isi stock opname result', result);
        this.stockOpname = result;

        // this.stockOpnameDetails = result.detail;
        // console.log('isi stock opname detail', this.stockOpnameDetails);
        // this.calculateTotal();

        // this.stockOpname.detail = null;
    }
    
    processStockOpnameDetail(result: any) {
        console.log('isi stock opname detail result', result);
        this.stockOpnameDetails = result.body.contents;
        this.totalData = result.body.totalRow;

        console.log('isi stock opname detail', this.stockOpnameDetails);
        // this.stockOpnameDetails = result.detail;
        // console.log('isi stock opname detail', this.stockOpnameDetails);
        this.calculateTotal();

        // this.stockOpname.detail = null;
    }


    calculateTotal() {
        this.total = 0;

        this.stockOpnameDetails.forEach(stockOpnameDetail => {
            this.total += this.getTotal(stockOpnameDetail)
        });
    }


    setWarehouseSelected() {
        this.warehouseSelected = this.stockOpname.warehouseId;
    }

    
    // loadWarehouse() {
    //     this.warehouseService
    //         .getWarehouse()
    //         .subscribe(
    //             (response: HttpResponse<WarehouseDto>) => {
    //                 if (response.body.errCode != "00") {
    //                     Swal.fire('error',"Failed get data salesman", "error");
    //                     return ;
    //                 }
    //                 this.warehouses = response.body.contents;
    //             }
    //         );
    // }

    search = (text$: Observable<string>) => {
        return text$.pipe(
            debounceTime(500),
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

    searchWarehouse = (text$: Observable<string>) =>
    text$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        map(term => term === '' ? []
            : this.warehouses.filter
                (v =>
                    v.name
                        .toLowerCase()
                        .indexOf(term.toLowerCase()) > -1
                )
                .slice(0, 10))
    )

    formatterProdList(value: any) {
        return value.name + ' Sell Price { ' + value.sellPrice + ' } ';
    }

    formatterProdInput(value: any) {
        if (value.name) {
            return value.name;
        }
        return value;
    }

    addNewItem() {
        console.log('isisisiisis ', this.productIdAdded );

        if (this.checkInputProductValid() === false ) {
            Swal.fire('Error', 'Product belum terpilih ! ', 'error');
            return ;
        }

        if (this.checkInputNumberValid() === false ) {
            Swal.fire('Error', 'Check price / disc / qty must be numeric, price and qty must greater than 0, disc max 100% ! ', 'error');
            return ;
        }

        let stockOpnameDetail = this.composeStockOpnameDetail();

        this.spinner.show();
        setTimeout(() => {

            this.spinner.hide();
        }, 5000);

        this.stockOpnameDetailService
            .save(stockOpnameDetail)
            .subscribe(
                (res => {
                    this.spinner.hide();
                    if (res.body.errCode === '00') {
                        this.reloadDetail(this.stockOpname.id);
                        
                    } else {
                        Swal.fire('Error', res.body.errDesc, 'error');
                    }
                }),
                () => {
                    this.spinner.hide();
                },
            );
    }

    composeStockOpnameDetail(): StockOpnameDetail {
        let stockOpnameDetail = new StockOpnameDetail();
        stockOpnameDetail.stockOpnameId = this.stockOpname.id;
        stockOpnameDetail.productId = this.productIdAdded;
        stockOpnameDetail.qty = this.qty
        stockOpnameDetail.uomId = this.uomAdded;
        return stockOpnameDetail;
    }

    checkInputNumberValid(): boolean {

        if ( (isNaN(this.qty)) || (this.qty === null) ) {
            return false;
        }
        return true;
    }

    checkInputProductValid(): boolean {

        let result = false;
        // 1. jika belum pernah di isi
        if ( this.model === undefined )  {
            // return false ;
            result = false;
            return result;
        }

        // 2.  sudah diisi
        // 2.a lalu di hapus
        // 2.b bukan object karena belum memilih lagi, masih type string 
        of(this.model).toPromise().then(
            res => {
                console.log('observable model ', res);
                if ( !res ) {
                    Swal.fire('Error', 'Product belum terpilih, silahlan pilih lagi ! ', 'error');
                    // return false ;
                    result = false;
                }
                const product =  res;
                console.log('obser hasil akhir => ', product);
                console.log('type [', typeof(product), '] ');
                const typeObj = typeof(product);
                if (typeObj == 'object') {
                    result = true;
                }

                console.log(typeof(product) , '] [', typeof('product'))
                if (typeof(product) == typeof('product')) {
                    // console.log('masok pakeo 2');
                    Swal.fire('Error', 'Product belum terpilih, silahlan pilih lagi [x,x ]! ', 'error');
                    result = false;
                    return result;
                }
            }
        );
        // Swal.fire('Error', 'Product belum terpilih, silahlan pilih lagi [x]! ', 'error');
        return result;
    }

    reloadDetail(stockOpnameId: number) {
        console.log('stock opname =>', stockOpnameId);
        this.spinner.show();
        this.stockOpnameDetailService
            .findByStockOpnameId({
                count: 10,
                page: 1,
                stockOpnameId: stockOpnameId,
                // filter : {
                // }
            }).subscribe(
                (res: HttpResponse<StockOpnameDetailPageDto>) => 
                    {
                        this.fillDetail(res),
                        this.spinner.hide();
                    },
                (res: HttpErrorResponse) =>{
                    console.log(res.message),
                    this.spinner.hide();
                    },
                () => {
                    this.spinner.hide();
                }
                
            );
    }

    fillDetail(res: HttpResponse<StockOpnameDetailPageDto>) {
        this.stockOpnameDetails = [];
        if (res.body.contents.length > 0) {

            this.stockOpnameDetails = res.body.contents;
            // this.calculateTotal();
            this.clearDataAdded();
        }
    }

    clearDataAdded() {
        this.productIdAdded = null;
        this.productNameAdded = null;
        this.uomAdded = 0;
        this.qty = 1;
        this.model = null;
        this.uomAddedName = '';
    }

    confirmDelItem (stockOpnameDetail: StockOpnameDetail) {
        Swal.fire({
            title : 'Confirm',
            text : 'Are you sure to cancel [ ' + stockOpnameDetail.product.name + ' ] ?',
            type : 'info',
            showCancelButton: true,
            confirmButtonText : 'Ok',
            cancelButtonText : 'Cancel'
        })
        .then(
            (result) => {
            if (result.value) {
                    this.delItem(stockOpnameDetail.id);
                }
            });
    }

    delItem(idDetail: number) {
        this.spinner.show();
        this.stockOpnameDetailService
            .deleteById(idDetail)
            .subscribe(
                (res: StockOpnameDetail) => {
                    if (res.errCode === '00') {
                        Swal.fire('Success', 'Data cancelled', 'info');
                        this.reloadDetail(this.stockOpname.id);
                    } else {
                        Swal.fire('Failed', 'Data failed cancelled', 'info');
                    }
                },
                () => {},
                () => {
                    this.spinner.hide();
                }
            );
    }

    confirmUpdateItem(stockOpnameDetail: StockOpnameDetail) {

        Swal.fire({
            title : 'Confirm',
            text : 'Are you sure to Update from [' + stockOpnameDetail.qty + '] to [ ' + stockOpnameDetail.qty  + ' ] ?',
            type : 'info',
            showCancelButton: true,
            confirmButtonText : 'Ok',
            cancelButtonText : 'Cancel'
        })
        .then(
            (result) => {
            if (result.value) {
                    this.updateQtyItem(stockOpnameDetail.id, stockOpnameDetail.qty );
                }
            });
    }

    updateQtyItem(idDetail: number, qtyReceive: number) {
        this.spinner.show();
        this.stockOpnameDetailService
            .updateQty(idDetail, qtyReceive)
            .subscribe(
                (res: HttpResponse<StockOpnameDetail>) => {
                    this.spinner.hide();
                    if (res.body.errCode === '00') {
                        Swal.fire('Success', 'Data Update Success', 'info');
                        this.reloadDetail(this.stockOpname.id);
                    } else {
                        Swal.fire('Failed', 'Data failed cancelled', 'info');
                    }
                },
                () => {
                    this.spinner.hide();
                },
                () => {
                    this.spinner.hide();
                }
            );
    }

    addNew() {
        this.total = 0;
        this.stockOpname = new StockOpname();
        this.stockOpname.id = 0;
        this.stockOpname.status = 0;
        this.stockOpnameDetails = [];
        if (this.warehouses.length>0) {
            this.warehouseSelected  = this.warehouses[0].id;
        }
        this.setToday() ;
        this.clearDataAdded();
    }

    saveHdr() {

        var isValidHdr = this.validateHdr()

        if ( ! isValidHdr) {
            return
        }
        this.spinner.show();
        this.stockOpname.warehouseId = +this.warehouseSelected;
        this.stockOpname.stockOpnameDate = this.getSelectedDate();
        this.stockOpnameService
            .save(this.stockOpname)
            .subscribe(
                (res => {
                    if (res.body.errCode === '00') {
                        this.stockOpname.id = res.body.id;
                        this.stockOpname.stockOpnameNo = res.body.stockOpnameNo;
                        this.stockOpname.status = res.body.status;
                    } else {
                        Swal.fire('Error', res.body.errDesc, 'error');
                    }
                }),
                () => {},
                () => {
                    this.spinner.hide();
                }
            );
    }

    validateHdr(): boolean {
        
        if (this.warehouseSelected == 0){
            Swal.fire({
                title : 'Validation',
                text : 'Warehouse Source not selected !',
                type : 'error',
                showCancelButton: false,
                confirmButtonText : 'Ok',
            })
            return false
        }
        
        return true
    }

    getSelectedDate(): string{

        const month = ('0' + this.selectedDate.month).slice(-2);
        const day = ('0' + this.selectedDate.day).slice(-2);
        const tz = 'T00:00:00+07:00';

        return this.selectedDate.year + '-' + month + '-' + day + tz;
    }

    approve() {

        if (!this.isValidDataApprove()){
            return;
        }

        Swal.fire({
            title : 'Confirm',
            text : 'Are you sure to approve ?',
            type : 'info',
            showCancelButton: true,
            confirmButtonText : 'Ok',
            cancelButtonText : 'Cancel'
        })
        .then(
            (result) => {
            if (result.value) {
                    this.approveProccess();
                }
            });
    }

    approveProccess() {
        // this.spinner.show();
        this.spinner.show();
        setTimeout(() => {

            this.spinner.hide();
        }, 5000);

        this.stockOpname.warehouseId = +this.warehouseSelected;
        this.stockOpname.stockOpnameDate = this.getSelectedDate();
        this.stockOpnameService.approve(this.stockOpname)
            .subscribe(
                (res) => {
                    this.spinner.hide();
                    if (res.body.errCode === '00'){
                        Swal.fire('OK', 'Save success', 'success');
                        this.router.navigate(['/main/stock-opname']);
                    } else {
                        Swal.fire('Failed', res.body.errDesc, 'warning');
                    }
                },
                () => { this.spinner.hide()},
                () => {  }
            );
    }

    isValidDataApprove(): boolean {
        if (this.stockOpname.id ===0) {
            Swal.fire('Error', 'Data no order belum di save !', 'error');
            return false;
        }
        if (this.stockOpnameDetails.length <= 0) {
            Swal.fire('Error', 'Data Barang belum ada', 'error');
            return false;
        }
        return true;
    }


    // preview(tipeReport) {
    //     this.spinner.show();
    //     this.stockOpnameService
    //         .preview(this.stockOpname.id, tipeReport)
    //         .subscribe(dataBlob => {
    //             console.log('data blob ==> ', dataBlob);
    //             const newBlob = new Blob([dataBlob], { type: 'application/pdf' });
    //             const objBlob = window.URL.createObjectURL(newBlob);
    //             this.spinner.hide();

    //             window.open(objBlob);
    //         });

    // }

    getTotal(stockOpnameDetail : StockOpnameDetail){

        return  stockOpnameDetail.hpp * (stockOpnameDetail.qty - stockOpnameDetail.qtyOnSystem) ;
    }

    getStatus(id): string {
        let statusName = 'Unknown';
        switch (id) {
            case 0:
            case 1:
            case 10:
                statusName = 'Outstanding';
                break;
            case 20:
                statusName = 'Approved';
                break;
            case 30:
                statusName = 'Rejected';
                break;
        }
        return statusName;
    }

    loadPage() {
        this.loadDetail(this.curPage);
    }

 
    loadDetail(page) {
        this.stockOpnameDetailService.findByStockOpnameId({
            stockOpnameId : +this.stockOpname.id,
            page: page,
            count: this.totalRecord,
        }).subscribe(
            (res: HttpResponse<StockOpnameDetailPageDto>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { }
        );
        console.log(page);
        // console.log(this.brand);
    }

    private onSuccess(data, headers) {
        if (data.contents.length < 0) {
            return;
        }
        this.stockOpnameDetails = data.contents;
        this.totalData = data.totalRow;
    }

    private onError(error) {
        console.log('error..');
    }

    downloadTemplate() {

        this.spinner.show();
        this.stockOpnameService.downloadTemplate(+this.warehouseSelected)
            .subscribe(dataBlob => {
                console.log('data blob ==> ', dataBlob);
                const newBlob = new Blob([dataBlob], { type: 'text/csv' });
                // const name = dataBlob.
                const objBlob = window.URL.createObjectURL(newBlob);
                const element = document.createElement("a");
                element.href = objBlob;
                element.download = "template.csv"
                element.click();
                this.spinner.hide();

                // window.open(objBlob);
            });

    }

    onFileSelected(event) {

        this.fileUpload = event.target.files[0];

    }
    
    Upload(f: NgForm) {


        if (this.stockOpname.id ===0) {
            Swal.fire("Error","Please Save first before upload !","error");
            return
        }

        if (this.fileUpload.size > (1024*1024*2)){
            Swal.fire("Error","File > 2MB not allowed !","error");
            return
        }

        if (this.fileUpload) {
    
            const formData = new FormData();
            formData.append("data-stock-opname.csv", this.fileUpload);
            console.log(this.fileUpload);
            this.spinner.show();
            this.stockOpnameService
                .uploadTemplate(formData,this.stockOpname.id)
                .subscribe(res=>{
                    this.myInputVariable.nativeElement.value='';
                    this.fileUpload=null;
                    if (res.body.errCode == "00") {
                        this.spinner.hide();
                        Swal.fire("Success","Success process !","success");
                        this.curPage=1
                        this.loadDetail(this.curPage);    
                    }
                    // f.reset();
                })
        } else {
            Swal.fire("Error","Please choose file !","error");
        }
    }
}


