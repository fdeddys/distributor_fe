import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import Swal from 'sweetalert2';
import { LookupTemplate } from '../../lookup/lookup.model';
import { Product, ProductPageDto } from '../../product/product.model';
import { Supplier, SupplierPageDto } from '../../supplier/supplier.model';
import { SupplierService } from '../../supplier/supplier.service';
import { PurchaseOrderDetailService } from '../purchase-order-detail.service';
import { PurchaseOrder, PurchaseOrderDetail, PurchaseOrderDetailPageDto } from '../purchase-order.model';
import { PurchaseOrderService } from '../purchase-order.service';
import * as moment from 'moment';
import { GlobalComponent } from 'src/app/shared/global-component';
import { LocalStorageService } from 'ngx-webstorage';
import { isNumber } from 'lodash';
import { PurchaseOrderModalComponent } from '../purchase-order-modal/purchase-order-modal.component';
import { load } from '@angular/core/src/render3';

@Component({
  selector: 'op-purchase-order-edit',
  templateUrl: './purchase-order-edit.component.html',
  styleUrls: ['./purchase-order-edit.component.css']
})
export class PurchaseOrderEditComponent implements OnInit {

    selectedDate: NgbDateStruct;
    purchaseOrder: PurchaseOrder;
    purchaseOrderDetails: PurchaseOrderDetail[];

    uomLists : LookupTemplate[]=[];

    suppliers: Supplier[]=[];
    supplierSelected: number;

    total: number;
    grandTotal: number;
    // isTax: Boolean;
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
    qtyAdded = 0;
    // uomAdded = 0;
    // uomAddedName = '';
    // poUom :LookupTemplate;
    poUom : number = 0;
    poUomQty = 0;
    bigUomID : number=0;

    curPage =1;
    totalData =0;

    // modal
    closeResult: string;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private supplierService: SupplierService,
        private http: HttpClient,
        private purchaseOrderService: PurchaseOrderService,
        private purchaseOrderDetailService: PurchaseOrderDetailService,
        private localStorage: LocalStorageService,
        private modalService: NgbModal,
    ) {
        this.total = 0;
        this.grandTotal = 0;
        this.taxAmount = 0;
        // this.isTax = false;
        this.priceAdded = 0;
    }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        const isValidParam = isNaN(+id);
        console.log('Param ==>', id, ' nan=>', isValidParam);
        this.setToday();
        if (isValidParam) {
            console.log('Invalid parameter ');
            this.backToLIst();
            return;
        }
        let total = this.localStorage.retrieve('max_search_product');
        if ( isNumber(total)) {
            this.totalRecordProduct = total;
        }
        this.suppliers.push({
            id:0,
            name: "PLEASE SELECT SUPPLIER",
            code:"",
        })
        this.loadData(+id);
    }


    backToLIst() {
        this.router.navigate(['/main/purchase-order']);
    }

    setToday() {
        const today = new Date();
        this.selectedDate = {
            year: today.getFullYear(),
            day: today.getDate(),
            month: today.getMonth() + 1,
        };
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

    loadData(orderId: number) {

        console.log('id ==>?', orderId);
        if (orderId === 0) {
            this.loadSupplier();
            this.loadNewData();
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
                this.suppliers= this.suppliers.concat(response.body.contents);
                if (this.purchaseOrder.id === 0) {
                    this.purchaseOrder.supplier = this.suppliers[0];
                    this.setSupplierDefault();
                }
            });
    }

    setSupplierDefault() {
        this.supplierSelected = this.purchaseOrder.supplier.id;
        console.log('set selected supplier =>', this.supplierSelected );
    }

    loadNewData() {
        this.addNew();
    }

    addNew() {
        this.total = 0;
        this.grandTotal = 0;
        this.taxAmount = 0;
        // this.isTax = false;
        this.priceAdded = 0;
        this.purchaseOrder = new PurchaseOrder();
        this.purchaseOrder.id = 0;
        this.purchaseOrder.status = 0;
        this.purchaseOrderDetails = [];
        this.setToday() ;
        this.clearDataAdded();
        if (this.suppliers !== undefined) {
            this.purchaseOrder.supplier = this.suppliers[0];
            this.setSupplierDefault();
        }
        // ini langsung generate no jika add new
        this.saveHdr()
    }

    clearDataAdded() {
        this.productIdAdded = null;
        this.priceAdded = 0;
        this.productNameAdded = null;
        // this.uomAdded = 0;
        this.poUomQty = 0;
        this.poUom ;
        this.bigUomID = 0;
        this.qtyAdded = 1;
        this.model = null;
        this.uomLists =[];
        // this.uomAddedName = '';
    }

    loadDataByOrderId(orderId: number) {

        let purchaseOrderReq = this.purchaseOrderService.findById(orderId);

        let supplierReq = this.supplierService.filter({
            page: 1,
            count: 10000,
            filter: {
                code: '',
                name: '',
            }
        });

        let purchaseOrderDetailReq = this.purchaseOrderDetailService
            .findByPurchaseOrderId({
                count: 10,
                page: 1,
                filter : {
                    purchaseOrderId: orderId,
                }
            });

        const requestArray = [];
        requestArray.push(purchaseOrderReq);
        requestArray.push(supplierReq);
        requestArray.push(purchaseOrderDetailReq);

        forkJoin(requestArray).subscribe(results => {
            this.processPurchaseOrder(results[0]);
            this.processSupplier(results[1]);
            this.processPurchaseOrderDtil(results[2]);
            this.setSupplierDefault();
        });

    }

    processPurchaseOrderDtil(result: HttpResponse<PurchaseOrderDetailPageDto>) {
        this.fillDetail(result);
    }

    processPurchaseOrder(result: PurchaseOrder) {
        console.log('isi purchase Order result', result);
        this.purchaseOrder = result;
        // this.isTax = this.purchaseOrder.isTax;
        this.purchaseOrderDetails = result.detail;
        console.log('isi purchaseOrder detauil', this.purchaseOrderDetails);
        this.calculateTotal();
        this.setSelectedDate(this.purchaseOrder.purchaseOrderDate);
        // this.selectedDate = this.purchaseOrder.purchaseOrderDate;
        this.purchaseOrder.detail = null;
    }

    calculateTotal() {

        this.purchaseOrderService.findByIdPO(this.purchaseOrder.id)
            .subscribe(
                (res => {
                    this.total= res.total
                    this.grandTotal=res.total
                    
                })
            );

        // this.total = 0;

        // var subtotal = 0 ;
        // var disc = 0;
        // this.purchaseOrderDetails.forEach(purchaseOrderDetail => {
        //     subtotal = (purchaseOrderDetail.price * purchaseOrderDetail.qty);
        //     disc = (purchaseOrderDetail.disc1  * subtotal) /100
        //     subtotal -=disc;
        //     this.total += subtotal ;
        // });

        // this.taxAmount = this.purchaseOrder.isTax == true ? Math.floor(this.total / 10) : 0;
        // this.grandTotal = this.total + this.taxAmount;
    }


    checkTax() {
        this.taxAmount = this.purchaseOrder.isTax === true ? Math.floor(this.total / 10) : 0;
        this.grandTotal = this.total + this.taxAmount;
    }


    processSupplier(result: HttpResponse<SupplierPageDto>) {
        if (result.body.contents.length < 0) {
            return;
        }
        // this.suppliers = result.body.contents;
        this.suppliers= this.suppliers.concat(result.body.contents);
    }

    getItem(event: any) {
        // event.preventDefault();
        this.uomLists = [];

        console.log('get item ==>', event);
        this.productIdAdded = event.item.id;
        this.priceAdded = 0;
        this.discAdded =0;
        this.productNameAdded = event.item.name;
        // this.uomAdded = event.item.smallUomId;
        // this.uomAddedName = event.item.smallUom.name;
        
        let biglUom: LookupTemplate = new LookupTemplate()  ;
        biglUom.name = event.item.bigUom.name + " [ " + event.item.qtyUom + " " + event.item.smallUom.name + " ]";
        biglUom.code = event.item.bigUom.code;
        biglUom.id = event.item.bigUom.id;
        biglUom.qty = event.item.qtyUom;
        this.uomLists.push(biglUom);

        // this.poUom = biglUom;
        this.poUom = +event.item.bigUom.id;
        this.poUomQty =event.item.qtyUom;
        this.bigUomID = +event.item.bigUom.id;

        let smallUom: LookupTemplate = new LookupTemplate()  ;
        smallUom.name = event.item.smallUom.name;
        smallUom.id = event.item.smallUom.id;
        smallUom.code = event.item.smallUom.code;
        smallUom.qty = 1;
        this.uomLists.push(smallUom);

        this.purchaseOrderService.findLastPrice(event.item.id).toPromise().then(
            res => {
                console.log("hasil cek harga ",res)
                if (res.errCode == "00") {
                    if (res.price == 0 ) {
                        this.priceAdded = res.hpp;
                    } else {
                        this.priceAdded = res.price;
                    }
                    // disc nya ga di ambil 
                    // 16 JUNI
                    // this.discAdded = res.disc1;
                    this.discAdded =0
                } 
            }
        )
    }


    // TYPE AHEAD PRODUCT
    search = (text$: Observable<string>) => {
        return text$.pipe(
            debounceTime(200),
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

       let purchaseOrderDetail = this.composePurchaseOrderDetail();

       this.purchaseOrderDetailService
            .save(purchaseOrderDetail)
            .subscribe(
                (res => {
                    if (res.body.errCode === '00') {
                        this.reloadDetail(this.purchaseOrder.id, false);
                    } else {
                        Swal.fire('Error', res.body.errDesc, 'error');
                    }
                })
            );
    }

    checkInputProductValid() {

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
                    return result;
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
        // return result;
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

        if (this.qtyAdded <= 0 || this.discAdded < 0 ) {
            // this.priceAdded <= 0 ||
            // result = false;
            return false;
        }

        if ( (this.priceAdded * this.qtyAdded ) < this.discAdded ) {
            // result = false;
            return false;
        }

        return true;
    }

    onChangeUOM(val) {
        console.log('Change UOM =?', val);

        if (this.uomLists[0].id == val) {
            this.poUomQty = this.uomLists[0].qty;
        } else {
            this.poUomQty = this.uomLists[1].qty;
        }
    }

    composePurchaseOrderDetail(): PurchaseOrderDetail {
        let purchaseOrderDetail = new PurchaseOrderDetail();
        purchaseOrderDetail.purchaseOrderId = this.purchaseOrder.id;
        purchaseOrderDetail.disc1 = this.discAdded;
        // purchaseOrderDetail.price = this.priceAdded;
        purchaseOrderDetail.productId = this.productIdAdded;
        purchaseOrderDetail.poQty = this.qtyAdded;
        // purchaseOrderDetail.uomId = this.uomAdded;

        purchaseOrderDetail.poUomId = +this.poUom;
        if (this.poUom == this.bigUomID) {
            purchaseOrderDetail.poUomQty = this.poUomQty;
        } else {
            purchaseOrderDetail.poUomQty = 1;
        }
        purchaseOrderDetail.poPrice = this.priceAdded * this.poUomQty;
        return purchaseOrderDetail;
    }

    reloadDetail(id: number, deldata: boolean) {
        let loadPage =1
        if (deldata) {
            // jika delete data, tidak boleh ke halaman 1
            if (this.purchaseOrderDetails.length > 1){
                loadPage = this.curPage;
            }
        } else {
            this.curPage=1
        }

        this.purchaseOrderDetailService
            .findByPurchaseOrderId({
                count: 10,
                page: loadPage,
                filter : {
                    purchaseOrderId: id,
                }
            }).subscribe(
                (res: HttpResponse<PurchaseOrderDetailPageDto>) => this.fillDetail(res),
                (res: HttpErrorResponse) => console.log(res.message),
                () => {}
            );
    }

    fillDetail(res: HttpResponse<PurchaseOrderDetailPageDto>) {
        this.purchaseOrderDetails = [];
        if (res.body.contents.length > 0) {

            this.purchaseOrderDetails = res.body.contents;
            this.totalData  = res.body.totalRow;
            this.calculateTotal();
            this.clearDataAdded();
        }
    }

    cancelSubmit() {
        Swal.fire({
            title : 'Confirm',
            text : 'Are you sure to cancel submit [ ' + this.purchaseOrder.purchaseOrderNo + ' ] ?',
            type : 'info',
            showCancelButton: true,
            confirmButtonText : 'Ok',
            cancelButtonText : 'Cancel'
        })
        .then(
            (result) => {
            if (result.value) {
                    this.cancelSubmitProses();
                }
            });
    }

    cancelSubmitProses() {
        this.purchaseOrderService
            .cancelSubmit(this.purchaseOrder.id)
            .subscribe(
                (res) => {
                    if (res.body.errCode === '00') {
                        Swal.fire('Success', ' Success ...', 'info');
                        // this.reloadDetail(this.purchaseOrder.id);
                        this.router.navigate(['/main/purchase-order']);
                    } else {
                        Swal.fire('Failed', res.body.errDesc, 'info');
                    }
                },
            );
    }

    confirmDelItem (purchaseOrderDtl: PurchaseOrderDetail) {
        Swal.fire({
            title : 'Confirm',
            text : 'Are you sure to cancel [ ' + purchaseOrderDtl.product.name + ' ] ?',
            type : 'info',
            showCancelButton: true,
            confirmButtonText : 'Ok',
            cancelButtonText : 'Cancel'
        })
        .then(
            (result) => {
            if (result.value) {
                    this.delItem(purchaseOrderDtl.id);
                }
            });
    }

    delItem(idDetail: number) {
        this.purchaseOrderDetailService
            .deleteById(idDetail)
            .subscribe(
                (res: PurchaseOrderDetail) => {
                    if (res.errCode === '00') {
                        Swal.fire('Success', 'Data cancelled', 'info');
                        this.reloadDetail(this.purchaseOrder.id, true);
                    } else {
                        Swal.fire('Failed', 'Data failed cancelled', 'info');
                    }
                },
            );
    }

    saveHdr() {
        this.purchaseOrder.supplier = null;
        this.purchaseOrder.supplierId = +this.supplierSelected;
        this.purchaseOrder.purchaseOrderDate = this.getSelectedDate();
        // this.purchaseOrder.isTax =this.isTax;
        // this.purchaseOrder.supplierId = 0;
        this.purchaseOrderService
            .save(this.purchaseOrder)
            .subscribe(
                (res => {
                    if (res.body.errCode === '00') {
                        this.purchaseOrder.id = res.body.id;
                        this.purchaseOrder.purchaseOrderNo = res.body.purchaseOrderNo;
                        this.purchaseOrder.status = res.body.status;
                        Swal.fire('ok', res.body.errDesc, 'success');
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

    approve() {

        this.purchaseOrder.supplierId = +this.supplierSelected;
        this.purchaseOrder.purchaseOrderDate = this.getSelectedDate();
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
        this.purchaseOrderService.approve(this.purchaseOrder)
            .subscribe(
                (res) => {
                    if (res.body.errCode === '00'){
                        Swal.fire('OK', 'Save success', 'success');
                        this.router.navigate(['/main/purchase-order']);
                    } else {
                        Swal.fire('Failed', res.body.errDesc, 'warning');
                    }
                }
            );
    }

    isValidDataApprove(): boolean {
        if (this.purchaseOrder.id ===0) {
            Swal.fire('Error', 'Data no order belum di save !', 'error');
            return false;
        }

        if (this.purchaseOrder.supplierId ===0) {
            Swal.fire('Error', 'Data supplier belum di save !', 'error');
            return false;
        }

        if (this.purchaseOrderDetails.length <= 0) {
            Swal.fire('Error', 'Data Barang belum ada', 'error');
            return false;
        }

        return true;
    }

    preview() {
        this.purchaseOrderService
            .preview(this.purchaseOrder.id)
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
        }
        return statusName;
    }

    reject() {

        Swal.fire({
            title : 'Confirm',
            text : 'Are you sure to cancel ?',
            type : 'info',
            showCancelButton: true,
            confirmButtonText : 'Ok',
            cancelButtonText : 'Cancel'
        })
        .then(
            (result) => {
            if (result.value) {
                    this.rejectProses();
                }
            }
        );


    }
        
    rejectProses() {
        this.purchaseOrderService.reject(this.purchaseOrder.id)
            .subscribe(
                (res) => {
                    if (res.body.errCode === '00'){
                        Swal.fire('OK', 'Save success', 'success');
                        this.router.navigate(['/main/purchase-order']);
                    } else {
                        Swal.fire('Failed', res.body.errDesc, 'warning');
                    }
                }
            );

    }

    loadPage() {
        this.purchaseOrderDetailService
            .findByPurchaseOrderId({
                count: 10,
                page: this.curPage,
                filter : {
                    purchaseOrderId: this.purchaseOrder.id,
                }
            })
            .subscribe(
                (res => {
                    this.fillDetail(res)
                })
            );;
    }

    openEdit(obj) {
        console.log( obj);

        const modalRef = this.modalService.open(PurchaseOrderModalComponent, { size: 'lg' });
        modalRef.componentInstance.purchaseOrderDetail = obj;

        modalRef.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
            console.log(this.closeResult);
            this.curPage = 1;
            this.reloadDetail(this.purchaseOrder.id, false);
        }, (reason) => {
            console.log(reason);
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            console.log(this.closeResult);
            this.reloadDetail(this.purchaseOrder.id, false);
        });
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

}

