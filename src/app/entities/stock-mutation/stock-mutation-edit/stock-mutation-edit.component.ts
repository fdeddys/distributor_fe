import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { isNumber } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalStorageService } from 'ngx-webstorage';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { GlobalComponent } from 'src/app/shared/global-component';
import Swal from 'sweetalert2';
import { Product, ProductPageDto } from '../../product/product.model';
import { Warehouse, WarehouseDto } from '../../warehouse/warehouse.model';
import { WarehouseService } from '../../warehouse/warehouse.service';
import { StockMutationDetailService } from '../stock-mutation-detail.service';
import { StockMutation, StockMutationDetail, StockMutationDetailPageDto } from '../stock-mutation.model';
import { StockMutationService } from '../stock-mutation.service';

@Component({
  selector: 'op-stock-mutation-edit',
  templateUrl: './stock-mutation-edit.component.html',
  styleUrls: ['./stock-mutation-edit.component.css']
})
export class StockMutationEditComponent implements OnInit {

    selectedDate: NgbDateStruct;
    stockMutation: StockMutation;
    stockMutationDetails: StockMutationDetail[];

    warehouseSources: Warehouse[];
    warehouseDests: Warehouse[];
    warehouseSourceSelected: number =0;
    warehouseDestSelected: number =0;

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

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private warehouseService: WarehouseService,
        private http: HttpClient,
        private stockMutationService: StockMutationService,
        private stockMutationDetailService: StockMutationDetailService,
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
        this.router.navigate(['/main/stock-mutation']);
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
        this.loadWarehouse();
        if (orderId === 0) {
            this.loadNewData();
            return;
        }
        this.loadDataByStockMutationId(orderId);
    }

    loadNewData() {
        this.addNew();
    }

    getItem(event: any) {
        // event.preventDefault();
        console.log('get item ==>', event);
        this.productIdAdded = event.item.id;
        this.productNameAdded = event.item.name;
        this.uomAdded = event.item.smallUomId;
        this.uomAddedName = event.item.smallUom.name;
    }

    loadDataByStockMutationId(stockMutationId: number) {

        this.spinner.show();
        let stockMutationReq = this.stockMutationService.findById(stockMutationId);

        let warehouseReq = this.warehouseService.filter({
            page: 1,
            count: 10000,
            filter: {
                code: '',
                name: '',
            }
        });

        const requestArray = [];
        requestArray.push(stockMutationReq);
        requestArray.push(warehouseReq);

        forkJoin(requestArray).subscribe(results => {
            this.spinner.hide();
            this.processStockMutation(results[0]);
            this.setWarehouseSelected();
        });
    }

    processStockMutation(result: StockMutation) {
        console.log('isi sales order result', result);
        this.stockMutation = result;

        this.stockMutationDetails = result.detail;
        console.log('isi sales order detail', this.stockMutationDetails);
        this.calculateTotal();

        this.stockMutation.detail = null;
    }

    calculateTotal() {
        this.total = 0;

        this.stockMutationDetails.forEach(stockMutationDetail => {
            this.total += this.getTotal(stockMutationDetail)
        });
    }


    setWarehouseSelected() {
        this.warehouseSourceSelected = this.stockMutation.warehouseSourceId;
        this.warehouseDestSelected = this.stockMutation.warehouseDestId;
    }

    
    loadWarehouse() {
        this.warehouseService
            .getWarehouse()
            .subscribe(
                (response: HttpResponse<WarehouseDto>) => {
                    if (response.body.errCode != "00") {
                        Swal.fire('error',"Failed get data salesman", "error");
                        return ;
                    }
                    this.warehouseSources = response.body.contents;
                    this.warehouseDests = response.body.contents;
                }
            );
    }

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

    searchWarehouseSource = (text$: Observable<string>) =>
    text$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        map(term => term === '' ? []
            : this.warehouseSources.filter
                (v =>
                    v.name
                        .toLowerCase()
                        .indexOf(term.toLowerCase()) > -1
                )
                .slice(0, 10))
    )

    searchWarehouseDest = (text$: Observable<string>) =>
    text$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        map(term => term === '' ? []
            : this.warehouseDests.filter
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

        // if (this.checkInputProductValid() === false ) {
        //     Swal.fire('Error', 'Product belum terpilih ! ', 'error');
        //     return ;
        // }

        if (this.checkInputNumberValid() === false ) {
            Swal.fire('Error', 'Check price / disc / qty must be numeric, price and qty must greater than 0, disc max 100% ! ', 'error');
            return ;
        }

       let stockMutationDetail = this.composeStockMutationDetail();

       this.spinner.show();
       this.stockMutationDetailService
            .save(stockMutationDetail)
            .subscribe(
                (res => {
                    this.spinner.hide();
                    if (res.body.errCode === '00') {
                        this.reloadDetail(this.stockMutation.id);
                       
                    } else {
                        Swal.fire('Error', res.body.errDesc, 'error');
                    }
                }),
                () => {
                    this.spinner.hide();
                },
            );
    }

    composeStockMutationDetail(): StockMutationDetail {
        let stockMutationDetail = new StockMutationDetail();
        stockMutationDetail.mutationId = this.stockMutation.id;
        stockMutationDetail.productId = this.productIdAdded;
        stockMutationDetail.qty = this.qty
        stockMutationDetail.uomId = this.uomAdded;
        return stockMutationDetail;
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
                }
                result = true;

                // console.log(typeof(product) , '] [', typeof('product'))
                // if (typeof(product) == typeof('product')) {
                //     // console.log('masok pakeo 2');
                //     Swal.fire('Error', 'Product belum terpilih, silahlan pilih lagi [x,x ]! ', 'error');
                //     result = false;
                //     return result;
                // }
            }
        );
        // Swal.fire('Error', 'Product belum terpilih, silahlan pilih lagi [x]! ', 'error');
        return result;
    }

    reloadDetail(stockMutationId: number) {
        this.spinner.show();
        this.stockMutationDetailService
            .findByStockMutationId({
                count: 10,
                page: 1,
                filter : {
                    stockMutationId: stockMutationId,
                }
            }).subscribe(
                (res: HttpResponse<StockMutationDetailPageDto>) => 
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

    fillDetail(res: HttpResponse<StockMutationDetailPageDto>) {
        this.stockMutationDetails = [];
        if (res.body.contents.length > 0) {

            this.stockMutationDetails = res.body.contents;
            this.calculateTotal();
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

    confirmDelItem (stockMutationDetail: StockMutationDetail) {
        Swal.fire({
            title : 'Confirm',
            text : 'Are you sure to cancel [ ' + stockMutationDetail.product.name + ' ] ?',
            type : 'info',
            showCancelButton: true,
            confirmButtonText : 'Ok',
            cancelButtonText : 'Cancel'
        })
        .then(
            (result) => {
            if (result.value) {
                    this.delItem(stockMutationDetail.id);
                }
            });
    }

    delItem(idDetail: number) {
        this.spinner.show();
        this.stockMutationDetailService
            .deleteById(idDetail)
            .subscribe(
                (res: StockMutationDetail) => {
                    if (res.errCode === '00') {
                        Swal.fire('Success', 'Data cancelled', 'info');
                        this.reloadDetail(this.stockMutation.id);
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

    confirmUpdateItem(stockMutationDetail: StockMutationDetail) {

        Swal.fire({
            title : 'Confirm',
            text : 'Are you sure to Update from [' + stockMutationDetail.qty + '] to [ ' + stockMutationDetail.qty  + ' ] ?',
            type : 'info',
            showCancelButton: true,
            confirmButtonText : 'Ok',
            cancelButtonText : 'Cancel'
        })
        .then(
            (result) => {
            if (result.value) {
                    this.updateQtyItem(stockMutationDetail.id, stockMutationDetail.qty );
                }
            });
    }

    updateQtyItem(idDetail: number, qtyReceive: number) {
        this.spinner.show();
        this.stockMutationDetailService
            .updateQty(idDetail, qtyReceive)
            .subscribe(
                (res: HttpResponse<StockMutationDetail>) => {
                    this.spinner.hide();
                    if (res.body.errCode === '00') {
                        Swal.fire('Success', 'Data Update Success', 'info');
                        this.reloadDetail(this.stockMutation.id);
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
        this.stockMutation = new StockMutation();
        this.stockMutation.id = 0;
        this.stockMutation.status = 0;
        this.stockMutationDetails = [];
        if (this.warehouseSources) {
            this.warehouseSourceSelected  = this.warehouseSources[0].id;
        }
        if (this.warehouseDests) {
            this.warehouseDestSelected = this.warehouseDestSelected[0].id;
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
        this.stockMutation.warehouseDestId = +this.warehouseDestSelected;
        this.stockMutation.warehouseSourceId = +this.warehouseSourceSelected;
        this.stockMutation.mutationDate = this.getSelectedDate();
        this.stockMutationService
            .save(this.stockMutation)
            .subscribe(
                (res => {
                    if (res.body.errCode === '00') {
                        this.stockMutation.id = res.body.id;
                        this.stockMutation.stockMutationNo = res.body.stockMutationNo;
                        this.stockMutation.status = res.body.status;
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
        
        if (this.warehouseSourceSelected == 0){
            Swal.fire({
                title : 'Validation',
                text : 'Warehouse Source not selected !',
                type : 'error',
                showCancelButton: false,
                confirmButtonText : 'Ok',
            })
            return false
        }
        
        if (this.warehouseDestSelected == 0){
            Swal.fire({
                title : 'Validation',
                text : 'Warehouse Destination not selected !',
                type : 'error',
                showCancelButton: false,
                confirmButtonText : 'Ok',
            })
            return false
        }

        if (this.warehouseDestSelected == this.warehouseSourceSelected){
            Swal.fire({
                title : 'Validation',
                text : 'Warehouse source and Destination are same not allowed !',
                type : 'error',
                showCancelButton: false,
                confirmButtonText : 'Ok',
            })
            return false
        }

        // Swal.fire({
        //     title : 'Validation',
        //     text : this.getSelectedDate(),
        //     type : 'error',
        //     showCancelButton: false,
        //     confirmButtonText : 'Ok',
        // })

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
        this.spinner.show();
        this.stockMutation.warehouseDestId = +this.warehouseDestSelected;
        this.stockMutation.warehouseSourceId = +this.warehouseSourceSelected;        
        this.stockMutation.mutationDate = this.getSelectedDate();
        this.stockMutationService.approve(this.stockMutation)
            .subscribe(
                (res) => {
                    this.spinner.hide();
                    if (res.body.errCode === '00'){
                        Swal.fire('OK', 'Save success', 'success');
                        this.router.navigate(['/main/stock-mutation']);
                    } else {
                        Swal.fire('Failed', res.body.errDesc, 'warning');
                    }
                },
                () => { this.spinner.hide()},
                () => {  }
            );
    }

    isValidDataApprove(): boolean {
        if (this.stockMutation.id ===0) {
            Swal.fire('Error', 'Data no order belum di save !', 'error');
            return false;
        }
        if (this.stockMutationDetails.length <= 0) {
            Swal.fire('Error', 'Data Barang belum ada', 'error');
            return false;
        }
        return true;
    }

    rejectProccess(){
        this.stockMutationService.reject(this.stockMutation)
            .subscribe(
                (res) => { console.log('success'); }
            )

        Swal.fire('OK', 'Save success', 'success');
    }

    reject() {

        if (!this.isValidDataApprove()){
            return;
        }

        Swal.fire({
            title : 'Confirm',
            text : 'Are you sure to Reject ?',
            type : 'info',
            showCancelButton: true,
            confirmButtonText : 'Ok',
            cancelButtonText : 'Cancel'
        })
        .then(
            (result) => {
            if (result.value) {
                    this.rejectProccess();
                }
            });
    }

    preview(tipeReport) {
        this.spinner.show();
        this.stockMutationService
            .preview(this.stockMutation.id, tipeReport)
            .subscribe(dataBlob => {
                console.log('data blob ==> ', dataBlob);
                const newBlob = new Blob([dataBlob], { type: 'application/pdf' });
                const objBlob = window.URL.createObjectURL(newBlob);
                this.spinner.hide();

                window.open(objBlob);
            });

    }

    getTotal(stockMutationDetail : StockMutationDetail){

        return  stockMutationDetail.hpp * stockMutationDetail.qty ;
    }


}
