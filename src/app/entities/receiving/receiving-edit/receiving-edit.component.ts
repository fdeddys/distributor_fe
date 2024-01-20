import { Component, OnInit } from '@angular/core';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Receive, ReceivingDetail, ReceivingDetailPageDto } from '../receiving.model';
import { Supplier, SupplierPageDto } from '../../supplier/supplier.model';
import { Observable, forkJoin, of } from 'rxjs';
import { Product, ProductPageDto } from '../../product/product.model';
import { SupplierService } from '../../supplier/supplier.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReceivingService } from '../receiving.service';
import { ReceivingDetailService } from '../receiving-detail.service';
import { HttpResponse, HttpClient, HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { debounceTime, distinctUntilChanged, switchMap, map, catchError } from 'rxjs/operators';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { ReceivingSearchPoModalComponent } from '../receiving-search-po-modal/receiving-search-po-modal.component';
import { Warehouse, WarehouseDto } from '../../warehouse/warehouse.model';
import { WarehouseService } from '../../warehouse/warehouse.service';
import { data } from 'jquery';
import { flatMap, isNumber } from 'lodash';
import * as _ from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalComponent } from 'src/app/shared/global-component';
import { LocalStorageService } from 'ngx-webstorage';
import { async } from '@angular/core/testing';
import { PurchaseOrderService } from '../../purchase-order/purchase-order.service';
import * as moment from 'moment';

@Component({
    selector: 'op-receiving-edit',
    templateUrl: './receiving-edit.component.html',
    styleUrls: ['./receiving-edit.component.css']
})
export class ReceivingEditComponent implements OnInit {

    selectedDate: NgbDateStruct;
    receive: Receive;
    receiveDetails: ReceivingDetail[];
    receiveDetailShow: ReceivingDetail[];

    suppliers: Supplier[]=[];
    supplierSelected: number;


    warehouses: Warehouse[];
    warehouseSelected: Warehouse;

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
    qtyBoxAdded = 0;
    uomAdded = 0;
    batchNo = "";
    // expiredDate :NgbDateStruct;
    expiredDate: string;
    uomAddedName = '';
    uomBoxAddedName = '';
    uomQty=0;
    closeResult: string;
    curPage =1;
    totalRecord =0;
    taxPercent = 0;

    multiDelete : number[]= [];
    multiDeleteDesc : String[]= [];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private supplierService: SupplierService,
        private http: HttpClient,
        private receiveService: ReceivingService,
        private receiveDetailService: ReceivingDetailService,
        private modalService: NgbModal,
        private warehouseService: WarehouseService,
        private spinner: NgxSpinnerService,
        private localStorage: LocalStorageService,
        private purchaseOrderService: PurchaseOrderService,
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
        this.taxPercent = GlobalComponent.tax / 100
        this.loadData(+id);
        this.setToday();
        // this.setTodayED();
    }


    backToLIst() {
        this.router.navigate(['/main/receive']);
    }

    setToday() {
        const today = new Date();
        this.selectedDate = {
            year: today.getFullYear(),
            day: today.getDate(),
            month: today.getMonth() + 1,
        };
    }
    
    // setTodayED() {
    //     const today = new Date();
    //     this.expiredDate = {
    //         year: today.getFullYear(),
    //         day: today.getDate(),
    //         month: today.getMonth() + 1,
    //     }
    // }

    loadData(orderId: number) {

        console.log('id ==>?', orderId);
        if (orderId === 0) {
            console.log("load promise Supplier");
            this.loadSupplierPromose();
            console.log("load promise warehouse");
            this.loadWarehousePromise();
            console.log("load new data");
            // this.loadNewData();
            return;
        }
        this.loadDataByOrderId(orderId);
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
                    Swal.fire('error', 'failed get supplier data !', 'error');
                    return;
                }
                this.suppliers = response.body.contents;
                if (this.receive.id === 0) {
                    this.receive.supplier = this.suppliers[0];
                    this.setSupplierDefault();
                }
            });
    }

    async loadSupplierPromose() {
        this.supplierService.filter({
            page: 1,
            count: 10000,
            filter: {
                code: '',
                name: '',
            },
        })
        .toPromise()
        .then(
            response => {
                if (response.body.contents.length <= 0) {
                    Swal.fire('error', 'failed get supplier data !', 'error');
                    return;
                }
                this.suppliers = response.body.contents;
                this.supplierSelected = this.suppliers[0].id;
                // if (this.receive.id === 0) {
                //     this.receive.supplier = this.suppliers[0];
                //     this.setSupplierDefault();
                // }
                console.log("load supp promise");
                this.loadNewData();
            },
            rej=> {

            }
        )
    }    

    loadWarehousePromise() {

        this.warehouseService.getWarehouseIn()
            .toPromise()
            .then(
                (response: HttpResponse<WarehouseDto>) => {
                    if (response.body.contents.length <= 0) {
                        Swal.fire('error', 'failed get warehouse data !', 'error');
                        return;
                    }
                    this.warehouses = response.body.contents;
                    this.warehouseSelected = this.warehouses[0] ;
                    console.log('set wh selected ', this.warehouseSelected);
                    this.loadNewData();

                });

        // let serverUrl = SERVER_PATH + 'warehouse';
        
        // let promise = new Promise((resolve, reject) => {
        //     // let apiURL = `${this.apiRoot}?term=${term}&media=music&limit=20`;
        //     this.http.get(serverUrl)
        //       .toPromise()
        //       .then(
        //         res => { // Success
        //         //   console.log(res);
        //           console.log("load ww promisesss", res);
        //           resolve;
        //         }
        //       );
        // });
        // return promise;

        // var request = new XMLHttpRequest();
        // request.open('GET', serverUrl, false);
        // request.send(); 

        // if (request.status === 200) {   
        //     let hasil = request.response;
        //     console.log("load ww promisesss", request);
        //     this.warehouses = request.response.contents;
        //     console.log("warehouses =>",this.warehouses);
        //     this.warehouseSelected = this.warehouses[0] ;
        //  }
        // const promise = this.http.get(serverUrl).toPromise();
        // console.log(promise);  

        // promise.then(
        //     data => {
        //     }
        // )
        // promise. .then((data)=>{
            // this.Movie = JSON.stringify(data)
            // console.log(JSON.stringify(data));
        // })
        
        // let dataPromise = await this.getDataSynchronous();

        // dataPromise.then
        // console.log("load ww promise", dataPromise);

        // if (dataPromise.contents.length <= 0) {
        //     Swal.fire('error', 'failed get warehouse data !', 'error');
        //     return;
        // }
        // this.warehouses = dataPromise.contents;
        // this.warehouseSelected = this.warehouses[0] ;
        // console.log('set wh selected ', this.warehouseSelected);
        // console.log("load ww promise");

        // dataPromise
        //     .then(
        //         dataWh => {
        //             console.log("data wh =>", dataWh)
        //             if (dataWh.contents.length <= 0) {
        //                 Swal.fire('error', 'failed get warehouse data !', 'error');
        //                 return;
        //             }
        //             this.warehouses = dataWh.contents;
        //             this.warehouseSelected = this.warehouses[0] ;
        //             console.log('set wh selected ', this.warehouseSelected);
        //             console.log("load ww promise"e);
        //         }
        //     )
    }


    loadWarehouse() {
        this.warehouseService.getWarehouseIn()
            .subscribe(
            (response: HttpResponse<WarehouseDto>) => {
                if (response.body.contents.length <= 0) {
                    Swal.fire('error', 'failed get warehouse data !', 'error');
                    return;
                }
                this.warehouses = response.body.contents;
                this.warehouseSelected = this.warehouses[0] ;
                console.log('set wh selected ', this.warehouseSelected)
            });
    }

    setSupplierDefault() {
        this.supplierSelected = this.receive.supplier.id;
        console.log('set selected supplier =>', this.supplierSelected );
    }
    
    setWarehouseDefault(){
        this.warehouseSelected = this.receive.warehouse ;
        console.log('set wh selected =>', this.warehouseSelected );
    }

    loadNewData() {
        this.addNew();
    }

    addNew() {
        this.total = 0;
        this.grandTotal = 0;
        this.taxAmount = 0;
        this.isTax = false;
        this.priceAdded = 0;
        this.batchNo = '';
        this.receive = new Receive();
        this.receive.id = 0;
        this.receive.status = 0;
        this.receiveDetails = [];
        this.setToday() ;
        // this.setTodayED();
        this.clearDataAdded();
        let suppOK = false;
        if (this.suppliers !== undefined ) {
            console.log("--->", this.suppliers);
            if ( this.suppliers.length>0 ) {
                this.receive.supplier = this.suppliers[0];
                this.supplierSelected = this.suppliers[0].id;
                suppOK = true;
            }
        }
        let WhOk = false;
        if (this.warehouses!== undefined ) {
            this.receive.warehouse = this.warehouses[0];
            WhOk= true;
        }
        // ini langsung generate no jika add new
        if (suppOK && WhOk) {
            this.saveHdr("");
        }
    }

    clearDataAdded() {
        this.productIdAdded = null;
        this.priceAdded = 0;
        this.productNameAdded = null;
        this.uomAdded = 0;
        this.qtyAdded = 0;
        this.qtyBoxAdded = 0;
        this.model = null;
        this.uomAddedName = '';
        this.uomBoxAddedName = '';
        this.uomQty = 0;
        this.batchNo='';
        // this.setTodayED();
    }

    loadDataByOrderId(orderId: number) {

        this.spinner.show();

        setTimeout(() => {
            this.spinner.hide();
        }, 10000);

        let receiveReq = this.receiveService.findById(orderId);

        let supplierReq = this.supplierService.filter({
            page: 1,
            count: 10000,
            filter: {
                code: '',
                name: '',
            }
        });

        let receiveDetailReq = this.receiveDetailService
            .findByReceiveId({
                count: 1000,
                page: 1,
                filter : {
                    receiveId: orderId,
                }
            });
        
        let warehouseReq = this.warehouseService.getWarehouseIn();

        const requestArray = [];
        requestArray.push(receiveReq);
        requestArray.push(supplierReq);
        requestArray.push(receiveDetailReq);
        requestArray.push(warehouseReq);

        forkJoin(requestArray).subscribe(results => {
            this.processReceive(results[0]);
            this.processSupplier(results[1]);
            this.processReceiveDtil(results[2]);
            this.processWarehouse(results[3]);
            this.setSupplierDefault();
            this.setWarehouseDefault();
        },
        ()=> {
            
        },
        ()=> {
            this.spinner.hide();
        });

    }

    processReceiveDtil(result: HttpResponse<ReceivingDetailPageDto>) {
        this.fillDetail(result);
    }

    processReceive(result: Receive) {
        console.log('isi receive result', result);
        this.receive = result;
        if (this.receive.tax >0) {
            this.isTax = true
        } else {
            this.isTax = false
        }
        this.setSelectedDate(this.receive.receiveDate) 
        // this.receiveDetails = result.detail;
        // console.log('isi receive detauil', this.receiveDetails);
        // this.calculateTotal();

        // this.receive.detail = null;
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

    fieldsChange(values:any, obj: ReceivingDetail) {
        // console.log(JSON.stringify(obj) , " - " , obj.id, " - " , values.currentTarget.checked);
        if (values.currentTarget.checked){
            this.multiDelete.push(obj.id);
            this.multiDeleteDesc.push(obj.product.name)
            console.log(obj.id)
        } else {
            console.log("remove " ,  obj.id)
            var index = this.multiDelete.indexOf(obj.id);
            if (index !== -1) {
                this.multiDelete.splice(index, 1);
                this.multiDeleteDesc.splice(index, 1);
            }
            
        }
    }

    calculateTotal() {
        this.total = 0;

        var subtotal = 0 ;
        var disc = 0;
        var disc2 = 0;
        this.receiveDetails.forEach(receiveDetail => {
            subtotal = (receiveDetail.price * receiveDetail.qty);
            disc = (receiveDetail.disc1  * subtotal) /100
            subtotal -=disc;
            disc2 = (receiveDetail.disc2  * subtotal) /100
            subtotal -=disc2    
            this.total += subtotal ;
        });

        this.taxAmount = this.isTax === true ? Math.floor(this.total * this.taxPercent  ) : 0;
        this.grandTotal = this.total + this.taxAmount;
    }


    checkTax() {
        this.taxAmount = this.isTax === true ? Math.floor(this.total * this.taxPercent ) : 0;
        this.grandTotal = this.total + this.taxAmount;
    }


    processSupplier(result: HttpResponse<SupplierPageDto>) {
        if (result.body.contents.length < 0) {
            return;
        }
        this.suppliers = result.body.contents;
    }

    processWarehouse(result: HttpResponse<WarehouseDto>) {
        if (result.body.contents.length < 0) {
            return;
        }
        this.warehouses = result.body.contents;
    }

    getItem(event: any) {
        // event.preventDefault();
        console.log('get item ==>', event);
        this.productIdAdded = event.item.id;
        // default harga 0 jadi ambil hpp
        this.priceAdded = event.item.hpp;
        this.productNameAdded = event.item.name;
        this.uomAdded = event.item.smallUomId;
        this.uomAddedName = event.item.smallUom.name;
        this.uomBoxAddedName = event.item.bigUom.name;
        this.uomQty = event.item.qtyUom;

        this.purchaseOrderService.findLastPrice(event.item.id).toPromise().then(
            res => {
                console.log("hasil cek harga ",res)
                if (res.errCode == "00") {
                    if (res.price == 0 ) {
                        this.priceAdded = res.hpp;
                    } else {
                        this.priceAdded = res.price;
                    }
                    this.discAdded = res.disc1;
                    this.disc2Added = res.disc2;
                } 
            }
        )
    }


    // TYPE AHEAD PRODUCT
    search = (text$: Observable<string>) => {
        return text$.pipe(
            debounceTime(200),
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
        return value.name ;
    }

    formatterProdInput(value: any) {
        if (value.name) {
            return value.name;
        }
        return value;
    }
    // TYPE AHEAD PRODUCT
    // *************************************************************************************


    // TYPE AHEAD SUPPLIER
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

    // TYPE AHEAD SUPPLIER
    // *************************************************************************************


    // Tomvol add item
    addNewItem() {
        console.log('isisisiisis ', this.productIdAdded );

        // if (this.checkInputValid() === false) {
        //     return ;
        // }
        if (this.checkInputProductValid() === false ) {
            Swal.fire('Error', 'Product belum terpilih ! ', 'error');
            return ;
        }

        if (this.checkInputNumberValid() === false ) {
            Swal.fire('Error', 'Check price / disc / qty must be numeric, price and qty must greater than 0 ! ', 'error');
            return ;
        }

       let receiveDetail = this.composeReceiveDetail();

       this.receiveDetailService
            .save(receiveDetail)
            .subscribe(
                (res => {
                    if (res.body.errCode === '00') {
                        this.reloadDetail(this.receive.id);
                    } else {
                        Swal.fire('Error', res.body.errDesc, 'error');
                    }
                })
            );

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
            (res) => {
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

            //    console.log(typeof(product) , '] [', typeof('product'))
            //    if (typeof(product) == typeof('product')) {
            //        // console.log('masok pakeo 2');
            //        Swal.fire('Error', 'Product belum terpilih, silahlan pilih lagi [x,x ]! ', 'error');
            //        result = false;
            //        return result;
            //    }
           }
        );
        // Swal.fire('Error', 'Product belum terpilih, silahlan pilih lagi [x]! ', 'error');
        // return result;
    }

    checkInputNumberValid(): boolean {
        // let result = true;

        if ( (isNaN(this.qtyAdded)) || (this.qtyAdded === null) ) {
            // result = false;
            console.log("isNaN(this.qtyAdded)")
            return false;
        }

        if ( (isNaN(this.priceAdded)) || (this.priceAdded === null) ) {
            // result = false;
            console.log("isNaN(this.priceAdded)")
            return false;
        }

        if ((isNaN(this.discAdded)) || (this.discAdded === null) ) {
            // result = false;
            console.log("(isNaN(this.discAdded)")
            return false;
        }

        if ( this.discAdded < 0 ) {
            // this.priceAdded <= 0 ||
            // result = false;
            console.log("(this.discAdded ")
            return false;
        }

        if ((isNaN(this.disc2Added)) || (this.disc2Added === null) ) {
            // result = false;
            console.log("(isNaN(this.disc2Added)")
            return false;
        }

        
        if ( this.disc2Added < 0 ) {
            // this.priceAdded <= 0 ||
            // result = false;
            console.log("(this.disc2Added ")
            return false;
        }

        if (this.qtyAdded <= 0 && this.qtyBoxAdded <= 0 ) {
            // this.priceAdded <= 0 ||
            // result = false;
            console.log("(this.qtyAdded <= 0 && this.qtyBoxAdded")
            return false;
        }



        // if ( (this.priceAdded * this.qtyAdded ) < this.discAdded ) {
        //     // result = false;
        //     console.log("this.priceAdded * this.qtyAdded ) < this.discAdded ")
        //     return false;
        // }

        return true;
    }

    composeReceiveDetail(): ReceivingDetail {
        let receiveDetail = new ReceivingDetail();
        receiveDetail.receiveId = this.receive.id;
        receiveDetail.disc1 = this.discAdded;
        receiveDetail.disc2 = this.disc2Added;
        receiveDetail.price = this.priceAdded;
        receiveDetail.productId = this.productIdAdded;
        receiveDetail.qty = this.qtyAdded + (this.qtyBoxAdded * this.uomQty);
        receiveDetail.uomId = this.uomAdded;
        receiveDetail.ed = this.expiredDate;
        // receiveDetail.ed = this.getEd();
        receiveDetail.batchNo = this.batchNo;
        return receiveDetail;
    }

    reloadDetail(id: number) {
        this.receiveDetailService
            .findByReceiveId({
                count: 1000,
                page: 1,
                filter : {
                    receiveId: id,
                }
            }).subscribe(
                (res: HttpResponse<ReceivingDetailPageDto>) => this.fillDetail(res),
                (res: HttpErrorResponse) => console.log(res.message),
                () => {}
            );
    }

    fillDetail(res: HttpResponse<ReceivingDetailPageDto>) {
        this.receiveDetails = [];
        this.receiveDetailShow = [];
        if (res.body.contents.length > 0) {
            
            this.receiveDetails = res.body.contents;
            this.receiveDetails.forEach(detail => {

                // pecah total order jadi big dan small uom
                detail.bigUom = detail.product.bigUom;
                detail.smallUom = detail.product.smallUom;
                let totalOrder = detail.qty;
                let totalBig = Math.floor(totalOrder/detail.product.qtyUom)
                let totalSmall = totalOrder - (totalBig * detail.product.qtyUom)
                detail.qtyUomBig = totalBig;
                detail.qtyUomSmall= totalSmall;
            });
            console.log('isi detail ===>', this.receiveDetails);
            this.totalRecord = res.body.totalRow;
            
        }
        this.fillGridDetail();
        this.calculateTotal();
        this.clearDataAdded();
    }


    fillGridDetail() {

        var recKe =1;
        this.receiveDetailShow = [];
        this.receiveDetails.every(data => {
            // page 1 rec 1 .. 10
            // page 2 rec 11 ..20
            if ((this.curPage-1) * 10 < recKe ) {
                this.receiveDetailShow.push(data);
                console.log('add .. ', this.receiveDetailShow.length);
                // jika sampe 10 rec, exit
                if (this.receiveDetailShow.length >= 10) {
                    return;
                }
            }
            recKe++;
            return true;
        })
        console.log('exit ya..');
    }

    confirmDeleteMulti(){

        Swal.fire({
            title : 'Confirm',
            text : 'Are you sure to cancel [ ' + this.multiDeleteDesc.toString() + ' ] ?',
            type : 'info',
            showCancelButton: true,
            confirmButtonText : 'Ok',
            cancelButtonText : 'Cancel'
        })
        .then(
            (result) => {
            if (result.value) {
                    this.delMultiItem();
                }
            });
    }


    delMultiItem() {
        this.spinner.show();

        setTimeout(() => {
            this.spinner.hide();
        }, 5000);

        this.receiveDetailService
            .deleteMultipleById(this.multiDelete)
            .subscribe(
                (res) => {
                    if (res.body.errCode === '00') {
                        Swal.fire('Success', 'Data deleted', 'info');
                        this.reloadDetail(this.receive.id);
                        this.spinner.hide();
                    } else {
                        Swal.fire('Failed', 'Data deleted ', 'info');
                    }
                },
                ()=> {
                    this.spinner.hide();
                }
            );
    }

   

    confirmDelItem (receiveDtl: ReceivingDetail) {
        Swal.fire({
            title : 'Confirm',
            text : 'Are you sure to cancel [ ' + receiveDtl.product.name + ' ] ?',
            type : 'info',
            showCancelButton: true,
            confirmButtonText : 'Ok',
            cancelButtonText : 'Cancel'
        })
        .then(
            (result) => {
            if (result.value) {
                    this.delItem(receiveDtl.id);
                }
            });
    }


    delItem(idDetail: number) {
        this.receiveDetailService
            .deleteById(idDetail)
            .subscribe(
                (res: ReceivingDetail) => {
                    if (res.errCode === '00') {
                        Swal.fire('Success', 'Data cancelled', 'info');
                        this.reloadDetail(this.receive.id);
                    } else {
                        Swal.fire('Failed', 'Data failed cancelled', 'info');
                    }
                },
            );
    }

    saveHdr(msg) {
        this.receive.supplier = null;
        this.receive.supplierId = +this.supplierSelected;
        this.receive.receiveDate = this.getSelectedDate();
        this.receive.warehouseId = this.warehouseSelected.id;
        if (this.isTax === true) {
            this.receive.tax = this.taxPercent * 100;
        } else {
            this.receive.tax = 0;
        }
        // this.receive.supplierId = 0;
        this.receiveService
            .save(this.receive)
            .subscribe(
                (res => {
                    if (res.body.errCode === '00') {
                        this.receive.id = res.body.id;
                        this.receive.receiveNo = res.body.receiveNo;
                        this.receive.status = res.body.status;
                        var pesan = res.body.errDesc
                        if (msg !== "") {
                            pesan = msg
                        }
                        Swal.fire('ok', pesan, 'success');
                    } else {
                        Swal.fire('Error', res.body.errDesc, 'error');
                    }
                })
            );
    }

    getSelectedDate(): string{

        const month = ('0' + this.selectedDate.month).slice(-2);
        const day = ('0' + this.selectedDate.day).slice(-2);
        const tz = 'T00:00:00+07:00';

        return this.selectedDate.year + '-' + month + '-' + day + tz;
    }

    // getEd(): string{

    //     const month = ('0' + this.expiredDate.month).slice(-2);
    //     const day = ('0' + this.expiredDate.day).slice(-2);
    //     const tz = 'T00:00:00+07:00';

    //     return this.selectedDate.year + '-' + month + '-' + day + tz;
    // }

    approve() {

        if (!this.isValidDataApprove()) {
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
        if (this.isTax === true) {
            this.receive.tax = this.taxPercent * 100;
        } else {
            this.receive.tax = 0;
        }
        this.receiveService.approve(this.receive)
            .subscribe(
                (res) => {
                    if (res.body.errCode === '00'){
                        Swal.fire('OK', 'Save success', 'success');
                        this.router.navigate(['/main/receive']);
                    } else {
                        Swal.fire('Failed', res.body.errDesc, 'warning');
                    }
                }
            );
    }

    isValidDataApprove(): boolean {
        if (this.receive.id ===0) {
            Swal.fire('Error', 'Data no order belum di save !', 'error');
            return false;
        }
        if (this.receiveDetails.length <= 0) {
            Swal.fire('Error', 'Data Barang belum ada', 'error');
            return false;
        }
        return true;
    }

    preview() {
        this.receiveService
            .preview(this.receive.id)
            .subscribe(dataBlob => {

                console.log('data blob ==> ', dataBlob);
                const newBlob = new Blob([dataBlob], { type: 'application/pdf' });
                const objBlob = window.URL.createObjectURL(newBlob);

                window.open(objBlob);
            });

    }

    getStatus(id): string {
        let statusName = 'Unknown';
        switch (id) {
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
            case 50:
                statusName = 'PAID';
                break;
        }
        return statusName;
    }

    loadPO(obj) {

        if (this.receive.status != 10  ) {
            if (this.receive.status != 1  ) {
                Swal.fire('Error', 'Status not allowed to add/change PO ! ', 'error');
                return
            }
        }
        if (this.receive.poNo != '' ) {
            Swal.fire('Error', 'PO already found ! ', 'error');
            return
        }
        console.log('receive -->', this.receive);
        console.log('Receive date ', this.getSelectedDate());
        const modalRef = this.modalService.open(ReceivingSearchPoModalComponent, { size: 'lg' });
        modalRef.componentInstance.receive = this.receive;
        modalRef.componentInstance.supplier = this.supplierSelected;
        modalRef.componentInstance.receiveDate = this.getSelectedDate();
        modalRef.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
            console.log('result',result);
            console.log(result.substring(0,2));
            if (result.substring(0,2) == 'ok') {
                var recvID = result.replace('ok:','');
                this.loadDataByOrderId(+recvID);
            }
            // this.curPage = 1;
            // this.loadAll(this.curPage);
        }, (reason) => {
            console.log('reason',reason);
            if ( reason === 0 ) {
                // click outside
                return;
            }
            if ( reason === 1 ) {
                // click ESC
                return;
            }
            // console.log(reason.substring(0,2));
            if (reason.substring(0,2) == 'ok') {
                var recvID = reason.replace('ok:','');
                this.loadDataByOrderId(+recvID);
            }
            // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            // console.log(this.closeResult);
            // this.loadAll(this.curPage);
        });
    }

    removePO() {

        if (this.receive.id ==0 ) {
            Swal.fire('Error', 'Receiving not found ! ', 'error');
            return
        }

        if (this.receive.status != 10 ) {
            Swal.fire('Error', 'Status not allowed to remove ! ', 'error');
            return
        }

        if (this.receive.poNo == '' ) {
            Swal.fire('Error', 'PO not found ! ', 'error');
            return
        }

        Swal.fire({
            title : 'Confirm',
            text : 'Are you sure to Remove PO ?',
            type : 'info',
            showCancelButton: true,
            confirmButtonText : 'Ok',
            cancelButtonText : 'Cancel'
        })
        .then(
            (result) => {
            if (result.value) {
                    this.confirmRemoveItem();
                }
        });        
        
    }

    confirmRemoveItem() {
        Swal.fire({
            title : 'Confirm',
            text : 'You want to clear all Item data ?',
            type : 'info',
            showCancelButton: true,
            confirmButtonText : 'YES, clear data',
            cancelButtonText : 'NO, keep it !'
        })
        .then(
            (result) => {
            console.log("result confirmRemoveItem: ", result)
            if (result.value) {
                this.removePoProcess(false);
            } else {
                this.removePoProcess(true);
            }
        });    

    }
    
    removePoProcess(clearData : boolean) {
        let receive = new Receive();
        receive.id = this.receive.id
        receive.poNo = this.receive.poNo
        this.receiveService.removeByPO(receive, clearData)
            .subscribe(
                (res) => {
                    if (res.body.errCode === '00'){
                        Swal.fire('OK', 'Save success', 'success');
                        this.receive.poNo = ""
                        this.reloadDetail(this.receive.id);
                        // this.router.navigate(['/main/receive']);
                    } else {
                        Swal.fire('Failed', res.body.errDesc, 'warning');
                    }
                }
            );
    }

    loadPage() {
        this.multiDelete=[];
        this.multiDeleteDesc=[];
        this.copyDataToShowData();
        this.fillGridDetail();
    }

    copyDataToShowData() {

        console.log("Copy data to show!");
        this.receiveDetailShow.forEach(datashow =>{
            let findIndex = _.findIndex(this.receiveDetails, function(datadetail){
                        return datadetail.id == datashow.id;
                    })
            
            if (findIndex === undefined) {
                console.log('data undefined ');
            } else {
                console.log('data found ', findIndex);
                this.receiveDetails[findIndex].price = datashow.price;
                this.receiveDetails[findIndex].disc1 = datashow.disc1;
                this.receiveDetails[findIndex].qty = datashow.qty;
                this.receiveDetails[findIndex].qtyUomBig = datashow.qtyUomBig;
                this.receiveDetails[findIndex].qtyUomSmall = datashow.qtyUomSmall;
                this.receiveDetails[findIndex].batchNo = datashow.batchNo;
                this.receiveDetails[findIndex].ed = datashow.ed;
            }
        })
        this.calculateTotal();
        // _.forEach(this.receiveDetailShow, function(datashow) {
            
        //      _.find(this.receiveDetails, function(datadetail){
        //         return datadetail.id == datashow.id;
        //     })

        //     // console.log('data show ', dataFind);
        // });
    }

    updateDetail(){

        this.copyDataToShowData();
        this.spinner.show();

        setTimeout(() => {
            this.spinner.hide();
        }, 5000);

        this.receiveDetails.forEach(detail => {
            detail.qty = (detail.qtyUomBig * detail.product.qtyUom) +(detail.qtyUomSmall) 
            // detail.qtyUomBig * detail.product.qtyUom) + (detail.qtyUomSmall));
        });
        this.receiveDetailService.updateDetail(this.receiveDetails)
            .subscribe(
                (res) => {
                    if (res.body.errCode === '00'){
                        Swal.fire('OK', 'Save success', 'success');
                        // this.router.navigate(['/main/receive']);
                    } else {
                        Swal.fire('Failed', res.body.errDesc, 'warning');
                    }
                },
                (res: HttpErrorResponse) => {
                    // if (res.bod)
                },
                ()=> {
                    this.spinner.hide();
                }
            );
        
    }

    rejectProccess(){
        this.receiveService.reject(this.receive)
            .subscribe(
                (res) => { 
                    console.log('success');
                    this.router.navigate(['/main/receive']); 
                    Swal.fire('OK', 'Save success', 'success');
                }
            )
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

    getDetailTotalPerRow(detail: ReceivingDetail){
        let price = detail.price;
        let total = price * (( detail.qtyUomBig * detail.product.qtyUom) + (detail.qtyUomSmall));
        let disc = total * detail.disc1 / 100;
        let totalDisc = total - disc
        let disc2 = totalDisc * detail.disc2 / 100;
        let totalDisc2 = totalDisc - disc2
        return totalDisc2;
    }

    getDetailTotalPerRow2(detail: ReceivingDetail){
        let price = detail.price;
        let total = price * (( detail.qtyUomBig * detail.product.qtyUom) + (detail.qtyUomSmall));
        let disc = total * detail.disc1 / 100;
        let grandTotal = total - disc
        return grandTotal;
    }

    onChangeSupp($event, value) {
        console.log('supplier on change', value)
        this.saveHdr("Supplier saved !!!")
    }

    getSubTotal(price: number, qty:number, disc1:number, disc2: number) {
        // disc 1 : 10%
        // disc 2 : 5%
        // ppn : 11%
        // 100rb - 10% = 90rb
        // 90rb- 5% = 85500
        // 85500+11% (ppn) = 94905
        // console.log(price + ':' + qty + ':' + disc1 + ':' + disc2)
        let subtotal = price * qty
        let totalDisc1 = subtotal - (subtotal * disc1 / 100)
        let totalDisc2 = totalDisc1 - ( totalDisc1 * disc2 / 100) 
        return totalDisc2;
    }
}
