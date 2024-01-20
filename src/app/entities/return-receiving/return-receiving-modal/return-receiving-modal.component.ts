import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { isNumber } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalStorageService } from 'ngx-webstorage';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { SERVER_PATH, TOTAL_RECORD_PER_PAGE } from 'src/app/shared/constants/base-constant';
import { GlobalComponent } from 'src/app/shared/global-component';
import Swal from 'sweetalert2';
import { Product, ProductPageDto } from '../../product/product.model';
import { Supplier, SupplierPageDto } from '../../supplier/supplier.model';
import { SupplierService } from '../../supplier/supplier.service';
import { Warehouse, WarehouseDto } from '../../warehouse/warehouse.model';
import { WarehouseService } from '../../warehouse/warehouse.service';
import { ReturnReceivingDetailService } from '../return-receiving-detail.service';
import { LastPriceDto, ReturnReceive, ReturnReceiveDetail, ReturnReceiveDetailPageDto } from '../return-receiving.model';
import { ReturnReceivingService } from '../return-receiving.service';
import * as moment from 'moment';

@Component({
  selector: 'op-return-receiving-modal',
  templateUrl: './return-receiving-modal.component.html',
  styleUrls: ['./return-receiving-modal.component.css']
})
export class ReturnReceivingModalComponent implements OnInit {

    selectedDate: NgbDateStruct;
    returnReceive: ReturnReceive;
    returnReceiveDetails: ReturnReceiveDetail[];

    /* Untuk search supplier
     * local search
     */
    suppliers: Supplier[];
    supplierSelected: Supplier;
    warehouses: Warehouse[];
    warehouseSelected: number;

    total: number;
    grandTotal: number;
    isTax: Boolean;
    taxAmount: number;

    /* Untuk search product
     * http
     */
    model: Observable<Product[]>;
    searching = false;
    searchFailed = false;
    totalRecordProduct = GlobalComponent.maxRecord;

    productIdAdded = 0;
    productNameAdded = '';
    priceAdded = 0;
    discAdded = 0;
    disc2Added = 0;
    qtyAdded = 0;
    uomAdded = 0;
    uomAddedName = '';
    loadedWarehouse =false;
    loadedSalesman =false;
    loadedSupplier =false;

    totalData = 0;
    totalRecord = TOTAL_RECORD_PER_PAGE;
    curPage = 1;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private supplierService: SupplierService,
        private http: HttpClient,
        private returnReceiveService: ReturnReceivingService,
        private returnReceiveDetailService: ReturnReceivingDetailService,
        private spinner: NgxSpinnerService,
        private warehouseService: WarehouseService,
        private localStorage: LocalStorageService,

    ) {
        this.total = 0;
        this.grandTotal = 0;
        this.taxAmount = 0;
        this.isTax = false;
        this.priceAdded = 0;
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
        this.router.navigate(['/main/return-receive']);
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

        this.loadSupplier();
        this.loadWarehouse();
        if (orderId === 0) {
            this.loadNewData();
            return;
        }
        this.loadDataByReturnId(orderId);
    }

    loadNewData() {
        this.addNew();
    }

    getItem(event: any) {
        // event.preventDefault();

        console.log('get item ==>', event);
        this.productIdAdded = event.item.id;
        this.priceAdded = 0
        //
        this.returnReceiveService
            .findLastPrice(event.item.id)
            .subscribe(
                (response: HttpResponse<LastPriceDto>) => {
                    // console.log("resp last price ",response)
                    // this.priceAdded=response.body.price;
                    this.onSuccess(response)
                }
            );

        this.productNameAdded = event.item.name;
        this.uomAdded = event.item.smallUomId;
        this.uomAddedName = event.item.smallUom.name;
    }

    private onSuccess(data) {
        
        console.log("resp last price ",data)
        this.priceAdded=data.price;
    }
    

    loadDataByReturnId(returnId: number) {

        this.spinner.show();
        setTimeout(() => {

            this.spinner.hide();
        }, 2000);

        console.log("load data return ID");
        let returnReq = this.returnReceiveService.findById(returnId);
        let supplierReq = this.supplierService.filter({
            page: 1,
            count: 10000,
            filter: {
                code: '',
                name: '',
            }
        });
        let returnReceiveDetailReq = this.returnReceiveDetailService
            .findByReturnReceiveId({
                count: 10,
                page: 1,
                filter : {
                    returnId: returnId,
                }
            });

        const requestArray = [];
        requestArray.push(returnReq);
        requestArray.push(supplierReq);
        // requestArray.push(returnReceiveDetailReq)

        forkJoin(requestArray).subscribe(results => {
            this.processReturnReceive(results[0]);
            this.processSupplier(results[1]);
            // this.processDetail(results[2]);
            this.setSupplierDefault();
            this.setWarehouseSelected();
            this.spinner.hide();
        });

    }

    processReturnReceive(result: ReturnReceive) {
        console.log('isi Return Data result', result);
        this.returnReceive = result;
        this.total = result.total
        this.grandTotal = result.grandTotal

        this.returnReceiveDetails = result.detail;
        this.totalData = result.totalRow;
        console.log('isi return detail', this.returnReceiveDetails);
        this.calculateTotal();
        this.setSelectedDate(this.returnReceive.returnDate)
        this.returnReceive.detail = null;
    }

    setSelectedDate(curDate: string) {
        let curDates = moment(curDate,"YYYY-MM-DD").toDate()
        const today = new Date();
        this.selectedDate = {
            year: curDates.getFullYear() ,
            day: curDates.getDate(),
            month: curDates.getMonth() + 1,
        };
    }

    processDetail(result: HttpResponse<ReturnReceiveDetailPageDto>) {
        this.fillDetail(result),
        this.spinner.hide();
    }

    calculateTotal() {
        this.getTotalRp(this.returnReceive.id)
        // this.total = 0;

        // this.returnReceiveDetails.forEach(returnReceiveDetail => {
        //     this.total += this.getTotal(returnReceiveDetail)
        // });

        // this.taxAmount = this.isTax === true ? Math.floor(this.total / 10) : 0;
        // this.grandTotal = this.total + this.taxAmount;
    }

    processSupplier(result: HttpResponse<SupplierPageDto>) {
        if (result.body.contents.length < 0) {
            return;
        }
        this.suppliers = result.body.contents;
    }

    setSupplierDefault() {
        this.supplierSelected = this.returnReceive.supplier;
        console.log('set selected supplier =>', this.supplierSelected );
    }

    setWarehouseSelected() {
        this.warehouseSelected = this.returnReceive.warehouseId;
    }

    loadSupplier() {
        this.supplierService.filter({
            page: 1,
            count: 10000,
            filter: {
                code: '',
                name: '',
            },
        }).subscribe(
            (response: HttpResponse<SupplierPageDto>) => {
                if (response.body.contents.length <= 0) {
                    Swal.fire('error', "failed get Supplier data !", 'error');
                    return;
                }
                this.suppliers = response.body.contents;
                this.loadedSupplier = true ;
                this.loadNewData();
            });
    }

    loadWarehouse() {
        this.warehouseService
            .getWarehouseIn()
            .subscribe(
                (response: HttpResponse<WarehouseDto>) => {
                    if (response.body.errCode != "00") {
                        Swal.fire('error',"Failed get data warehouse", "error");
                        return ;
                    }
                    this.warehouses = response.body.contents;
                    this.loadedWarehouse = true;
                    this.loadNewData();
                }
            );
    }

    checkTax() {
        this.calculateTotal();
    }

    formatter = (result: Supplier) => result.name.toUpperCase();

    searchSupplier = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            map(term => term === '' ? []
                : this.suppliers.filter
                    (v =>
                        v.name
                            .toLowerCase()
                            .indexOf(term.toLowerCase()) > -1
                    )
                    .slice(0, 10))
    )

    search = (text$: Observable<string>) => {
        return text$.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            // tap(() => this.searching = true),
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

       let returnOrderDetail = this.composeReturnDetail();

       this.spinner.show();
       this.returnReceiveDetailService
            .save(returnOrderDetail)
            .subscribe(
                (res => {
                    this.spinner.hide();
                    if (res.body.errCode === '00') {
                        this.reloadDetail(this.returnReceive.id);
                      
                    } else {
                        Swal.fire('Error', res.body.errDesc, 'error');
                    }
                }),
                () => {
                    this.spinner.hide();
                },
            );
    }

    getTotalRp(returnId){


        this.returnReceiveService
            .findById(returnId)
            .subscribe(
                (res => {
                    this.total = res.total
                    this.grandTotal = res.grandTotal
                }),
                () => {
                },
            );
    }

    composeReturnDetail(): ReturnReceiveDetail {
        let returnDetail = new ReturnReceiveDetail();
        returnDetail.returnReceiveId = this.returnReceive.id;
        returnDetail.disc1 = this.discAdded;
        returnDetail.disc2 = this.disc2Added;
        returnDetail.price = this.priceAdded;
        returnDetail.productId = this.productIdAdded;
        returnDetail.qty = this.qtyAdded;
        returnDetail.uomId = this.uomAdded;
        return returnDetail;
    }

    checkInputNumberValid(): boolean {
        // let result = true;

        if ( (isNaN(this.qtyAdded)) || (this.qtyAdded === null) ) {
            // result = false;
            return false;
        }

        if ( (isNaN(this.priceAdded)) || (this.priceAdded === null) ) {
            // result = false;
            return false;
        }

        if ((isNaN(this.discAdded)) || (this.discAdded === null) ) {
            // result = false;
            return false;
        }

        if ( this.discAdded >100 ) {
            // result = false;
            return false;
        }

        if ((isNaN(this.disc2Added)) || (this.disc2Added === null) ) {
            // result = false;
            return false;
        }

        if ( this.disc2Added >100 ) {
            // result = false;
            return false;
        }

        if (this.qtyAdded <= 0 || this.discAdded < 0 ) {
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
                    // result = true;
                    return true;
                }

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
        // return result;
    }

    loadPage(){
        this.reloadDetail(this.returnReceive.id)
    }

    reloadDetail(orderReturnId: number) {
        this.spinner.show();
        this.returnReceiveDetailService
            .findByReturnReceiveId({
                count: 10,
                page: this.curPage ,
                filter : {
                    returnId: orderReturnId,
                }
            }).subscribe(
                (res: HttpResponse<ReturnReceiveDetailPageDto>) => 
                    {
                        this.fillDetail(res),
                        this.spinner.hide();
                    },
                (res: HttpErrorResponse) =>{
                    console.log(res.message),
                    this.spinner.hide();
                    },               
            );
    }

    fillDetail(res: HttpResponse<ReturnReceiveDetailPageDto>) {
        this.returnReceiveDetails = [];
        if (res.body.contents.length > 0) {
            console.log("isi detail ", res)
            this.returnReceiveDetails = res.body.contents;
            this.totalData = res.body.totalRow;
            this.calculateTotal();
            this.clearDataAdded();
        }
    }

    clearDataAdded() {
        this.productIdAdded = null;
        this.priceAdded = 0;
        this.productNameAdded = null;
        this.uomAdded = 0;
        this.qtyAdded = 1;
        this.discAdded =0;
        this.disc2Added =0;
        this.model = null;
        this.uomAddedName = '';
    }

    confirmDelItem (returnReceiveDetail: ReturnReceiveDetail) {
        Swal.fire({
            title : 'Confirm',
            text : 'Are you sure to cancel [ ' + returnReceiveDetail.product.name + ' ] ?',
            type : 'info',
            showCancelButton: true,
            confirmButtonText : 'Ok',
            cancelButtonText : 'Cancel'
        })
        .then(
            (result) => {
            if (result.value) {
                    this.delItem(returnReceiveDetail.id);
                }
            });
    }

    delItem(idDetail: number) {
        this.spinner.show();
        this.returnReceiveDetailService
            .deleteById(idDetail)
            .subscribe(
                (res: ReturnReceiveDetail) => {
                    if (res.errCode === '00') {
                        Swal.fire('Success', 'Data cancelled', 'info');
                        this.reloadDetail(this.returnReceive.id);
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

    confirmUpdateItem(returnReceiveDetail: ReturnReceiveDetail) {

        Swal.fire({
            title : 'Confirm',
            text : 'Are you sure to Update  [' + returnReceiveDetail.qty + ']  ?',
            type : 'info',
            showCancelButton: true,
            confirmButtonText : 'Ok',
            cancelButtonText : 'Cancel'
        })
        .then(
            (result) => {
            if (result.value) {
                    this.updateQty(returnReceiveDetail.id, returnReceiveDetail.qty );
                }
            });
    }

    updateQty(idDetail: number, qtyReceive: number) {
        this.spinner.show();
        this.returnReceiveDetailService
            .updateQty(idDetail, qtyReceive)
            .subscribe(
                (res: HttpResponse<ReturnReceiveDetail>) => {
                    this.spinner.hide();
                    if (res.body.errCode === '00') {
                        Swal.fire('Success', 'Data Update Success', 'info');
                        this.reloadDetail(this.returnReceive.id);
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
        this.grandTotal = 0;
        this.taxAmount = 0;
        this.isTax = false;
        this.priceAdded = 0;
        this.returnReceive = new ReturnReceive();
        this.returnReceive.id = 0;
        this.returnReceive.status = 0;
        this.returnReceiveDetails = [];
        this.setToday() ;
        this.clearDataAdded();

        if ( this.loadedWarehouse) {
            if ( this.warehouses.length>0) {
                this.warehouseSelected = this.warehouses[0].id;
            }
        }

        if (this.loadedSupplier) {
            if (this.suppliers.length > 0) {
                this.returnReceive.supplier = this.suppliers[0];
                this.setSupplierDefault();
            }
        }
      
    }

    saveHdr() {
        this.spinner.show();
        this.returnReceive.supplier = null;
        this.returnReceive.supplierId = this.supplierSelected.id;
        this.returnReceive.warehouseId = +this.warehouseSelected;
        this.returnReceive.returnDate = this.getSelectedDate();
        this.returnReceiveService
            .save(this.returnReceive)
            .subscribe(
                (res => {
                    if (res.body.errCode === '00') {
                        this.returnReceive.id = res.body.id;
                        this.returnReceive.returnNo = res.body.returnNo;
                        this.returnReceive.status = res.body.status;
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
        this.returnReceive.supplier = null;
        this.returnReceive.supplierId = this.supplierSelected.id;
        this.returnReceive.warehouseId = +this.warehouseSelected;
        this.returnReceive.returnDate = this.getSelectedDate();
        this.returnReceiveService.approve(this.returnReceive)
            .subscribe(
                (res) => {
                    this.spinner.hide();
                    if (res.body.errCode === '00'){
                        Swal.fire('OK', 'Save success', 'success');
                        this.router.navigate(['/main/return-receive']);
                    } else {
                        Swal.fire('Failed', res.body.errDesc, 'warning');
                    }
                },
                () => { this.spinner.hide()},
                () => {  }
            );
    }

    isValidDataApprove(): boolean {
        if (this.returnReceive.id ===0) {
            Swal.fire('Error', 'Data no order belum di save !', 'error');
            return false;
        }
        if (this.returnReceiveDetails.length <= 0) {
            Swal.fire('Error', 'Data Barang belum ada', 'error');
            return false;
        }
        return true;
    }

    rejectProccess(){
        this.returnReceiveService.reject(this.returnReceive)
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
        this.returnReceiveService
            .preview(this.returnReceive.id, tipeReport)
            .subscribe(dataBlob => {
                console.log('data blob ==> ', dataBlob);
                const newBlob = new Blob([dataBlob], { type: 'application/pdf' });
                const objBlob = window.URL.createObjectURL(newBlob);
                this.spinner.hide();
                window.open(objBlob);
            });
    }

    getTotal(returnReceiveDetail : ReturnReceiveDetail){
        var total : number;
        total = returnReceiveDetail.price * returnReceiveDetail.qty;
        total = total - ( total * returnReceiveDetail.disc1 /100)
        total = total - ( total * returnReceiveDetail.disc2 /100)
        return total;
    }

    createInvoice() {
        this.spinner.show();
        this.returnReceiveService.createInvoice(this.returnReceive.id)
            .subscribe(
                (res) => {
                    this.spinner.hide();
                    if (res.body.errCode === '00'){
                        Swal.fire('OK', 'created  success', 'success');
                        this.router.navigate(['/main/return-receive']);
                    } else {
                        Swal.fire('Failed', res.body.errDesc, 'warning');
                    }
                },
                () => { this.spinner.hide()},
                () => {  }
            );
    }

    getStatus(id): string {
        let statusName = 'Unknown';
        switch (id) {
            case 1:
            case 10:
                statusName = 'Outstanding';
                break;
            case 20:
                statusName = 'Submit';
                break;
            case 30:
                statusName = 'Cancel';
                break;
            case 40:
                statusName = 'Receiving';
                break;
            
        }
        return statusName;
    }


}
