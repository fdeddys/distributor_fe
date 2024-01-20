import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { switchMap, debounceTime, distinctUntilChanged, map, tap, catchError, flatMap } from 'rxjs/operators';
import { Observable, Subject, of, concat, forkJoin, empty, pipe } from 'rxjs';
import { ModalDismissReasons, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SalesOrder, SalesOrderDetail, SalesOrderDetailPageDto } from '../sales-order.model';
import { Customer, CustomerPageDto } from '../../customer/customer.model';
import { CustomerService } from '../../customer/customer.service';
import { HttpResponse, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Product, ProductPageDto } from '../../product/product.model';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { SalesOrderService } from '../sales-order.service';
import { SalesOrderDetailService } from '../sales-order-detail.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";
import { Salesman, SalesmanDto } from '../../salesman/salesman.model';
import { SalesmanService } from '../../salesman/salesman.service';
import { WarehouseService } from '../../warehouse/warehouse.service';
import { Warehouse, WarehouseDto } from '../../warehouse/warehouse.model';
import * as moment from 'moment';
import { GlobalComponent } from 'src/app/shared/global-component';
import { LocalStorageService } from 'ngx-webstorage';
import { isNumber } from 'lodash';
import { SalesOrderModalComponent } from '../sales-order-modal/sales-order-modal.component';


@Component({
    selector: 'op-sales-order-edit',
    templateUrl: './sales-order-edit.component.html',
    styleUrls: ['./sales-order-edit.component.css']
})

export class SalesOrderEditComponent implements OnInit {

    selectedDate: NgbDateStruct;
    salesOrder: SalesOrder;
    salesOrderDetails: SalesOrderDetail[];

    /* Untuk search customer
     * local search
     */
    customers: Customer[];
    customerSelected: Customer;
    salesmans: Salesman[];
    salesmanSelected: number;
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
    isCash: boolean = false;

    curPage =1;
    totalData =0;
    // modal
    closeResult: string;
    taxPercent = 0;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private customerService: CustomerService,
        private http: HttpClient,
        private orderService: SalesOrderService,
        private orderDetailService: SalesOrderDetailService,
        private spinner: NgxSpinnerService,
        private salesmanService: SalesmanService,
        private warehouseService: WarehouseService,
        private localStorage: LocalStorageService,
        private modalService: NgbModal,
    ) {
        this.total = 0;
        this.grandTotal = 0;
        this.taxAmount = 0;
        this.isTax = false;
        this.priceAdded = 0;
    }

    ngOnInit() {
        console.log("======? data")
        
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
        this.route.data.subscribe(
            data => {
                console.log("data===>",data.cash);
                this.isCash = data.cash;
                this.setToday();
                this.loadData(+id);
            }
        );
        this.taxPercent = GlobalComponent.tax

    }

    // checkIsNumber(numb): any {
    //     return isNaN(numb);
    // }

    backToLIst() {

        if (this.isCash) {
            this.router.navigate(['/main/direct-sales']);
            return
        }
        this.router.navigate(['/main/sales-order']);
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

        this.loadCustomer();
        this.loadSalesman();
        this.loadWarehouse();
        if (orderId === 0) {
            this.loadNewData();
            return;
        }
        this.loadDataByOrderId(orderId);
    }

    loadNewData() {
        this.addNew();
    }

    getItem(event: any) {
        // event.preventDefault();
        console.log('get item ==>', event);
        this.productIdAdded = event.item.id;
        let price = 0;
        if (event.item.sellPriceType === 0) {
            price =event.item.sellPrice;
        } else {
            price = Math.round(event.item.hpp + ( event.item.hpp * event.item.sellPrice / 100))
        }
        this.priceAdded = price;
        this.productNameAdded = event.item.name;
        this.uomAdded = event.item.smallUomId;
        this.uomAddedName = event.item.smallUom.name;


    }

    loadDataByOrderId(orderId: number) {

        this.spinner.show();
        let orderReq = this.orderService.findById(orderId);

        let customerReq = this.customerService.filter({
            page: 1,
            count: 10000,
            filter: {
                code: '',
                name: '',
            }
        });

        const requestArray = [];
        requestArray.push(orderReq);
        requestArray.push(customerReq);

        forkJoin(requestArray).subscribe(results => {
            this.processOrder(results[0]);
            this.processCustomer(results[1]);
            this.setCustomerDefault();
            this.setWarehouseSalesmanSelected();
            this.spinner.hide();
        });

        // this.orderService.findById(orderId)
        //     .subscribe(
        //         (res) => {
        //             console.log("isisisisisi ", res);
        //             this.salesOrder = res;
        //         }
        //     );
    }

    processOrder(result: SalesOrder) {
        console.log('isi sales order result', result);
        this.salesOrder = result;
        this.setSelectedDate(this.salesOrder.orderDate);
        this.isTax = result.tax > 0 ? true: false;

        // this.salesOrderDetails = result.detail;
        // console.log('isi sales order detauil', this.salesOrderDetails);
        // this.calculateTotal();

        // this.salesOrder.detail = null;
        this.reloadDetail(this.salesOrder.id) 
    }

    calculateTotal2() {
        this.total = 0;

        this.salesOrderDetails.forEach(salesOrderDetail => {
            // this.total = this.total + ( (salesOrderDetail.price * salesOrderDetail.qtyOrder) - salesOrderDetail.disc1);
            this.total += this.getTotal(salesOrderDetail)
        });

        this.taxAmount = this.isTax === true ? Math.floor(this.total * this.taxPercent /100) : 0;
        this.grandTotal = this.total + this.taxAmount;
    }

    calculateTotal(){

        let total = 0
        this.orderService
            .getTotalByID(this.salesOrder.id)
            .subscribe(res=>{
                total = res.body;
                
                this.total = total;
                this.taxAmount = this.isTax === true ? Math.floor(this.total * this.taxPercent /100) : 0;
                this.grandTotal = this.total + this.taxAmount;
            })

    }

    processCustomer(result: HttpResponse<CustomerPageDto>) {
        if (result.body.contents.length < 0) {
            return;
        }
        this.customers = result.body.contents;
    }

    setCustomerDefault() {

        if (this.isCash) {
            // this.customerSelected = 99999999;
            
            console.log(" set cust default")
            var cur = this.customers.find(function(cust) {
                return cust.id === 99999999
                }  
            )
            console.log(" set cust default ==>", cur)
            this.customerSelected = cur;
            return
        }
        this.customerSelected = this.salesOrder.customer;
        console.log('set selected customer =>', this.customerSelected );
    }

    setWarehouseSalesmanSelected() {
        this.salesmanSelected = this.salesOrder.salesmanId;
        this.warehouseSelected = this.salesOrder.warehouseId;
    }

    loadCustomer() {
        this.customerService.filter({
            page: 1,
            count: 10000,
            filter: {
                code: '',
                name: '',
            },
        }).subscribe(
            (response: HttpResponse<CustomerPageDto>) => {
                if (response.body.contents.length <= 0) {
                    Swal.fire('error', "failed get Customer data !", 'error');
                    return;
                }
                this.customers = response.body.contents;
            });
    }

    loadSalesman() {
        this.salesmanService
            .getSalesman()
            .subscribe(
                (response: HttpResponse<SalesmanDto>) => {
                    if (response.body.errCode != "00") {
                        Swal.fire('error',"Failed get data salesman", "error");
                        return ;
                    }
                    this.salesmans = response.body.contents;  
                    this.salesmanSelected = this.salesmans[0].id; 
                }
            );
    }

    loadWarehouse() {
        this.warehouseService
            .getWarehouseOut()
            .subscribe(
                (response: HttpResponse<WarehouseDto>) => {
                    if (response.body.errCode != "00") {
                        Swal.fire('error',"Failed get data salesman", "error");
                        return ;
                    }
                    this.warehouses = response.body.contents;
                    this.warehouseSelected = this.warehouses[0].id;
                    // .filter(items => items.whOut ==1 );
                }
            );
    }

    checkTax() {
        // return this.taxAmount = this.isTax === true ? Math.floor(this.total / 10) : 0;
        this.calculateTotal();
    }

    // formatter = (x: {name: string}) => x.name;

    formatter = (result: Customer) => result.name.toUpperCase();

    searchCustomer = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            map(term => term === '' ? []
                : this.customers.filter
                    (v =>
                        v.name
                            .toLowerCase()
                            .indexOf(term.toLowerCase()) > -1
                    )
                    .slice(0, 10))
    )

    // searchSalesman = (text$: Observable<string>) =>
    //     text$.pipe(
    //         debounceTime(200),
    //         distinctUntilChanged(),
    //         map(term => term === '' ? []
    //             : this.salesmans.filter
    //                 (v =>
    //                     v.name
    //                         .toLowerCase()
    //                         .indexOf(term.toLowerCase()) > -1
    //                 )
    //                 .slice(0, 10))
    // )
    // formatterProd = (result: { name: string }) => result.name.toUpperCase();

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
                    warehouseId: this.warehouseSelected,
                };
        const serverUrl = SERVER_PATH + 'product';
        const newresourceUrl = serverUrl + `/search/page/1/count/${this.totalRecordProduct}`;
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
        return value.name + "   [ " + value.qtyOnHand + "  ]";
        // + ' Sell Price { ' + value.sellPrice + ' } ';
    }

    formatterProdInput(value: any) {
        if (value.name) {
            return value.name;
        }
        return value;
    }

    addNewItem() {
        console.log('isisisiisis ', this.productIdAdded );

        // if (this.checkInputValid() === false) {
        //     return ;
        // }
        let cekValid = this.checkInputProductValid();
        console.log('Cek valid ', cekValid); 
        if ( cekValid === false ) {
            Swal.fire('Error', 'Product belum terpilih ! ', 'error');
            return ;
        }

        if (this.checkInputNumberValid() === false ) {
            Swal.fire('Error', 'Check price / disc / qty must be numeric, price and qty must greater than 0, disc max 100% ! ', 'error');
            return ;
        }

       let orderDetail = this.composeOrderDetail();

       this.spinner.show();
       this.orderDetailService
            .save(orderDetail)
            .subscribe(
                (res => {
                    this.spinner.hide();
                    if (res.body.errCode === '00') {
                        this.reloadDetail(this.salesOrder.id);
                       
                    } else {
                        Swal.fire('Error', res.body.errDesc, 'error');
                    }
                }),
                () => {
                    this.spinner.hide();
                },
            );
    }

    composeOrderDetail(): SalesOrderDetail {
        let orderDetail = new SalesOrderDetail();
        orderDetail.salesOrderId = this.salesOrder.id;
        orderDetail.disc1 = this.discAdded;
        orderDetail.disc2 = this.disc2Added;
        orderDetail.price = this.priceAdded;
        orderDetail.productId = this.productIdAdded;
        orderDetail.qtyOrder = this.qtyAdded;
        orderDetail.uomId = this.uomAdded;
        return orderDetail;
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
            // this.priceAdded <= 0 ||
            // result = false;
            return false;
        }

        // if ( (this.priceAdded * this.qtyAdded ) < this.discAdded ) {
        //     // result = false;
        //     return false;
        // }

        return true;
    }

    checkInputProductValid(): boolean {

        let result = false;
        // 1. jika belum pernah di isi
        if ( this.model === null )  {
            // return false ;
            result = false;
            return result;
        }

        // 2.  sudah diisi
        // 2.a lalu di hapus
        // 2.b bukan object karena belum memilih lagi, masih type string 
        // of(this.model).toPromise().then(
        //     res => {
                let res = this.model; 
                // console.log('observable model ', res);
                if ( !res ) {
                    Swal.fire('Error', 'Product belum terpilih, silahlan pilih lagi ! ', 'error');
                    // return false ;
                    result = false;
                }
                const product =  res;
                console.log('obser hasil akhir => ', product);
                console.log('type [', typeof(product), '] ');
                const typeObj = typeof(product);
                console.log('Type obj [', typeObj,']');
                if (typeObj === 'object') {
                    result = true;
                    return result;
                }

                console.log(typeof(product) , '] [', typeof('product'))
                if (typeof(product) == typeof('product')) {
                    // console.log('masok pakeo 2');
                    Swal.fire('Error', 'Product belum terpilih, silahlan pilih lagi [x,x ]! ', 'error');
                    result = false;
                    return result;
                }
        //     }
        // );
        // Swal.fire('Error', 'Product belum terpilih, silahlan pilih lagi [x]! ', 'error');
        return result;
    }

    reloadDetail(orderId: number) {
        this.spinner.show();
        this.orderDetailService
            .findByOrderId({
                count: 10,
                page: this.curPage,
                filter : {
                    orderId: orderId,
                }
            }).subscribe(
                (res: HttpResponse<SalesOrderDetailPageDto>) => 
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

    fillDetail(res: HttpResponse<SalesOrderDetailPageDto>) {
        this.salesOrderDetails = [];
        if (res.body.contents === null) {
            return
        }
        if (res.body.contents.length > 0) {

            this.salesOrderDetails = res.body.contents;

            this.totalData  = res.body.totalRow;

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

    confirmDelItem (salesOrderDetail: SalesOrderDetail) {
        Swal.fire({
            title : 'Confirm',
            text : 'Are you sure to cancel [ ' + salesOrderDetail.product.name + ' ] ?',
            type : 'info',
            showCancelButton: true,
            confirmButtonText : 'Ok',
            cancelButtonText : 'Cancel'
        })
        .then(
            (result) => {
            if (result.value) {
                    this.delItem(salesOrderDetail.id);
                }
            });
    }

    delItem(idDetail: number) {
        this.spinner.show();
        this.orderDetailService
            .deleteById(idDetail)
            .subscribe(
                (res: SalesOrderDetail) => {
                    if (res.errCode === '00') {
                        Swal.fire('Success', 'Data cancelled', 'info');
                        this.reloadDetail(this.salesOrder.id);
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

    confirmUpdateItem(salesOrderDetail: SalesOrderDetail) {

        if (salesOrderDetail.qtyReceive > salesOrderDetail.qtyOrder ) {
            Swal.fire({
                title : 'Confirm',
                text : 'Qty Receive [' + salesOrderDetail.qtyReceive + '] bigger than qty Receive [ ' + salesOrderDetail.qtyOrder + ' ] not allowed !',
                type : 'error',
                confirmButtonText : 'Ok'
            })
            return
        } 

        Swal.fire({
            title : 'Confirm',
            text : 'Are you sure to Update from [' + salesOrderDetail.qtyOrder + '] to [ ' + salesOrderDetail.qtyReceive + ' ] ?',
            type : 'info',
            showCancelButton: true,
            confirmButtonText : 'Ok',
            cancelButtonText : 'Cancel'
        })
        .then(
            (result) => {
            if (result.value) {
                    this.updateQtyRecvItem(salesOrderDetail.id, salesOrderDetail.qtyReceive );
                }
            });
    }

    updateQtyRecvItem(idDetail: number, qtyReceive: number) {
        this.spinner.show();
        this.orderDetailService
            .updateQtyRecvItem(idDetail, qtyReceive)
            .subscribe(
                (res: HttpResponse<SalesOrderDetail>) => {
                    this.spinner.hide();
                    if (res.body.errCode === '00') {
                        Swal.fire('Success', 'Data Update Success', 'info');
                        this.reloadDetail(this.salesOrder.id);
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
        this.salesOrder = new SalesOrder();
        this.salesOrder.id = 0;
        this.salesOrder.status = 0;
        this.salesOrderDetails = [];
        if (this.warehouses) {
            this.warehouseSelected = this.warehouses[0].id;
        }
        if (this.salesmans ) {
            this.salesmanSelected = this.salesmans[0].id;
        }
        if (this.customers) {
            this.salesOrder.customer = this.customers[0];
            this.setCustomerDefault();
        }
        this.setToday() ;
        this.clearDataAdded();
        // if (this.customers !== undefined) {
        //     console.log('this customers xxx ', this.salesOrder.customer);
        //     this.salesOrder.customer = this.customers[0];
        //     this.setCustomerDefault();
        // }
    }

    saveHdr() {
        this.spinner.show();
        this.salesOrder.customer = null;
        this.salesOrder.customerId = 99999999;
        // this.customerSelected.id;
        this.salesOrder.warehouseId = +this.warehouseSelected;
        this.salesOrder.orderDate = this.getSelectedDate();
        this.salesOrder.deliveryDate = this.formatDate().toString();
        this.salesOrder.salesmanId = +this.salesmanSelected;
        this.salesOrder.isCash = this.isCash ;
        this.salesOrder.tax  = this.isTax == true ? this.taxPercent: 0;
        // ==true ? 1 : 0;
        this.orderService
            .save(this.salesOrder)
            .subscribe(
                (res => {
                    if (res.body.errCode === '00') {
                        this.salesOrder.id = res.body.id;
                        this.salesOrder.salesOrderNo = res.body.salesOrderNo;
                        this.salesOrder.status = res.body.status;
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

    formatDate() {
        var d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [year, month, day].join('-')+"T00:00:00+07:00";
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
        this.salesOrder.customer = null;
        if (this.isCash) {
            this.salesOrder.customerId = 99999999;
        } else {
            this.salesOrder.customerId = this.customerSelected.id;
        }
        this.salesOrder.warehouseId = +this.warehouseSelected;
        this.salesOrder.orderDate = this.getSelectedDate();
        this.salesOrder.salesmanId = +this.salesmanSelected;
        this.salesOrder.tax  = this.isTax == true ? this.taxPercent: 0;
        this.orderService.approve(this.salesOrder)
            .subscribe(
                (res) => {
                    this.spinner.hide();
                    if (res.body.errCode === '00'){
                        Swal.fire('OK', 'Save success', 'success');

                        if (this.isCash) {
                            this.router.navigate(['/main/direct-sales']);
                        } else {
                            this.router.navigate(['/main/sales-order']);
                        }
                        
                    } else {
                        Swal.fire('Failed', res.body.errDesc, 'warning');
                    }
                },
                () => { this.spinner.hide()},
                () => {  }
            );
    }

    isValidDataApprove(): boolean {
        if (this.salesOrder.id ===0) {
            Swal.fire('Error', 'Data no order belum di save !', 'error');
            return false;
        }
        if (this.salesOrderDetails.length <= 0) {
            Swal.fire('Error', 'Data Barang belum ada', 'error');
            return false;
        }
        return true;
    }

    rejectProccess(){
        this.orderService.reject(this.salesOrder)
            .subscribe(
                (res) => { 
                    // console.log('success');
                    if (this.isCash) {
                        this.router.navigate(['/main/direct-sales']);
                    } else {
                        this.router.navigate(['/main/sales-order']);
                    }
                }
            )

        Swal.fire('OK', 'Reject success', 'success');
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
        this.orderService
            .preview(this.salesOrder.id, tipeReport)
            .subscribe(dataBlob => {
                console.log('data blob ==> ', dataBlob);
                const newBlob = new Blob([dataBlob], { type: 'application/pdf' });
                const objBlob = window.URL.createObjectURL(newBlob);
                this.spinner.hide();

                window.open(objBlob);
            });

    }

    getTotal(salesOrderDetail : SalesOrderDetail){

        var total : number;

        total = salesOrderDetail.price * salesOrderDetail.qtyOrder;
        total = total - ( total * salesOrderDetail.disc1 /100)
        total = total - ( total * salesOrderDetail.disc2 /100)

        return total;

    }

    createInvoice() {

        this.spinner.show();
        this.orderService.createInvoice(this.salesOrder.id)
            .subscribe(
                (res) => {
                    this.spinner.hide();
                    if (res.body.errCode === '00'){
                        Swal.fire('OK', 'Invoice created  success', 'success');
                        this.router.navigate(['/main/sales-order']);
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
            case 0:
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
                statusName = 'Invoice';
                break;
            case 50:
                statusName = 'Paid';
                break;
        }
        return statusName;
    }

    loadPage(){
        this.reloadDetail(this.salesOrder.id);
    }


    openEdit(obj) {
        console.log( obj);

        const modalRef = this.modalService.open(SalesOrderModalComponent, { size: 'lg' });
        modalRef.componentInstance.salesOrderDetail = obj;

        modalRef.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
            console.log(this.closeResult);
            this.curPage = 1;
            this.reloadDetail(this.salesOrder.id);
        }, (reason) => {
            console.log(reason);
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            console.log(this.closeResult);
            this.reloadDetail(this.salesOrder.id);
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
