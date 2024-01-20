import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { isNumber, result } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalStorageService } from 'ngx-webstorage';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { GlobalComponent } from 'src/app/shared/global-component';
import Swal from 'sweetalert2';
import { Customer, CustomerPageDto } from '../../customer/customer.model';
import { CustomerService } from '../../customer/customer.service';
import { Product, ProductPageDto } from '../../product/product.model';
import { SalesOrderDetailPageDto } from '../../sales-order/sales-order.model';
import { Salesman, SalesmanDto } from '../../salesman/salesman.model';
import { SalesmanService } from '../../salesman/salesman.service';
import { Warehouse, WarehouseDto } from '../../warehouse/warehouse.model';
import { WarehouseService } from '../../warehouse/warehouse.service';
import { SalesOrderReturnDetailService } from '../sales-order-return-detail.service';
import { SalesOrderReturn, SalesOrderReturnDetail } from '../sales-order-return.model';
import { SalesOrderReturnService } from '../sales-order-return.service';

@Component({
  selector: 'op-sales-order-return-edit',
  templateUrl: './sales-order-return-edit.component.html',
  styleUrls: ['./sales-order-return-edit.component.css']
})
export class SalesOrderReturnEditComponent implements OnInit {

    selectedDate: NgbDateStruct;
    salesOrderReturn: SalesOrderReturn;
    salesOrderReturnDetails: SalesOrderReturnDetail[];

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
    loadedWarehouse =false;
    loadedSalesman =false;
    loadedCustomer =false;

    isCash: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private customerService: CustomerService,
        private http: HttpClient,
        private salesOrderReturnService: SalesOrderReturnService,
        private salesOrderReturnDetailService: SalesOrderReturnDetailService,
        private spinner: NgxSpinnerService,
        private salesmanService: SalesmanService,
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
        this.route.data.subscribe(
            data => {
                console.log("data===>",data.cash);
                this.isCash = data.cash;
                this.loadData(+id);
                this.setToday();
            }
        );
    }

    // checkIsNumber(numb): any {
    //     return isNaN(numb);
    // }

    backToLIst() {
        this.router.navigate(['/main/sales-order-return']);
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
        this.priceAdded = event.item.sellPrice;
        this.productNameAdded = event.item.name;
        this.uomAdded = event.item.smallUomId;
        this.uomAddedName = event.item.smallUom.name;
    }

    loadDataByOrderId(orderId: number) {

        this.spinner.show();
        let orderReq = this.salesOrderReturnService.findById(orderId);
        let customerReq = this.customerService.filter({
            page: 1,
            count: 10000,
            filter: {
                code: '',
                name: '',
            }
        });
        let orderItemReq = this.salesOrderReturnDetailService
            .findBySalesOrderReturnId({
                count: 10,
                page: 1,
                filter : {
                    orderReturnId: orderId,
                }
            });

        const requestArray = [];
        requestArray.push(orderReq);
        requestArray.push(customerReq);
        requestArray.push(orderItemReq)

        forkJoin(requestArray).subscribe(results => {
            this.processOrder(results[0]);
            this.processCustomer(results[1]);
            this.processOrderDetail(results[2]);
            this.setCustomerDefault();
            this.setWarehouseSalesmanSelected();
            this.spinner.hide();
        });

    }

    processOrder(result: SalesOrderReturn) {
        console.log('isi sales order result', result);
        this.salesOrderReturn = result;

        this.salesOrderReturnDetails = result.detail;
        console.log('isi sales order detauil', this.salesOrderReturnDetails);
        this.calculateTotal();

        this.salesOrderReturn.detail = null;
    }

    processOrderDetail(result: HttpResponse<SalesOrderDetailPageDto>) {
        this.fillDetail(result),
        this.spinner.hide();
    }

    calculateTotal() {
        this.total = 0;

        this.salesOrderReturnDetails.forEach(salesOrderDetail => {
            this.total += this.getTotal(salesOrderDetail)
        });

        this.taxAmount = this.isTax === true ? Math.floor(this.total / 10) : 0;
        this.grandTotal = this.total + this.taxAmount;
    }

    processCustomer(result: HttpResponse<CustomerPageDto>) {
        if (result.body.contents.length < 0) {
            return;
        }
        this.customers = result.body.contents;
    }

    setCustomerDefault() {
        this.customerSelected = this.salesOrderReturn.customer;
        console.log('set selected customer =>', this.customerSelected );
    }

    setWarehouseSalesmanSelected() {
        this.salesmanSelected = this.salesOrderReturn.salesmanId;
        this.warehouseSelected = this.salesOrderReturn.warehouseId;
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
                this.loadedCustomer = true ;
                this.loadNewData();
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
                    this.loadedSalesman = true;
                    this.loadNewData();   
                }
            );
    }

    loadWarehouse() {
        this.warehouseService
            .getWarehouseOut()
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

       let returnOrderDetail = this.composeOrderReturnDetail();

       this.spinner.show();
       this.salesOrderReturnDetailService
            .save(returnOrderDetail)
            .subscribe(
                (res => {
                    this.spinner.hide();
                    if (res.body.errCode === '00') {
                        this.reloadDetail(this.salesOrderReturn.id);
                       
                    } else {
                        Swal.fire('Error', res.body.errDesc, 'error');
                    }
                }),
                () => {
                    this.spinner.hide();
                },
            );
    }

    composeOrderReturnDetail(): SalesOrderReturnDetail {
        let orderDetail = new SalesOrderReturnDetail();
        orderDetail.returnSalesOrderId = this.salesOrderReturn.id;
        orderDetail.disc1 = this.discAdded;
        orderDetail.disc2 = this.disc2Added;
        orderDetail.price = this.priceAdded;
        orderDetail.productId = this.productIdAdded;
        orderDetail.qty = this.qtyAdded;
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

    reloadDetail(orderReturnId: number) {
        this.spinner.show();
        this.salesOrderReturnDetailService
            .findBySalesOrderReturnId({
                count: 10,
                page: 1,
                filter : {
                    orderReturnId: orderReturnId,
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
        this.salesOrderReturnDetails = [];
        if (res.body.contents.length > 0) {

            this.salesOrderReturnDetails = res.body.contents;
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

    confirmDelItem (salesOrderReturnDetail: SalesOrderReturnDetail) {
        Swal.fire({
            title : 'Confirm',
            text : 'Are you sure to cancel [ ' + salesOrderReturnDetail.product.name + ' ] ?',
            type : 'info',
            showCancelButton: true,
            confirmButtonText : 'Ok',
            cancelButtonText : 'Cancel'
        })
        .then(
            (result) => {
            if (result.value) {
                    this.delItem(salesOrderReturnDetail.id);
                }
            });
    }

    delItem(idDetail: number) {
        this.spinner.show();
        this.salesOrderReturnDetailService
            .deleteById(idDetail)
            .subscribe(
                (res: SalesOrderReturnDetail) => {
                    if (res.errCode === '00') {
                        Swal.fire('Success', 'Data cancelled', 'info');
                        this.reloadDetail(this.salesOrderReturn.id);
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

    confirmUpdateItem(salesOrderReturnDetail: SalesOrderReturnDetail) {

        Swal.fire({
            title : 'Confirm',
            text : 'Are you sure to Update  [' + salesOrderReturnDetail.qty + ']  ?',
            type : 'info',
            showCancelButton: true,
            confirmButtonText : 'Ok',
            cancelButtonText : 'Cancel'
        })
        .then(
            (result) => {
            if (result.value) {
                    this.updateQty(salesOrderReturnDetail.id, salesOrderReturnDetail.qty );
                }
            });
    }

    updateQty(idDetail: number, qtyReceive: number) {
        this.spinner.show();
        this.salesOrderReturnDetailService
            .updateQty(idDetail, qtyReceive)
            .subscribe(
                (res: HttpResponse<SalesOrderReturnDetail>) => {
                    this.spinner.hide();
                    if (res.body.errCode === '00') {
                        Swal.fire('Success', 'Data Update Success', 'info');
                        this.reloadDetail(this.salesOrderReturn.id);
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
        this.salesOrderReturn = new SalesOrderReturn();
        this.salesOrderReturn.id = 0;
        this.salesOrderReturn.status = 0;
        this.salesOrderReturnDetails = [];
        this.setToday() ;
        this.clearDataAdded();

        if ( this.loadedWarehouse) {
            if ( this.warehouses.length>0) {
                this.warehouseSelected = this.warehouses[0].id;
            }
        }

        if ( this.loadedSalesman) {
            if (this.salesmans.length >0 ) {
                this.salesmanSelected = this.salesmans[0].id;
            }
        }

        if (this.loadedCustomer) {
            if (this.customers.length > 0) {
                this.salesOrderReturn.customer = this.customers[0];
                this.setCustomerDefault();
            }
        }
      
    }

    saveHdr() {
        this.spinner.show();
        this.salesOrderReturn.customer = null;
        this.salesOrderReturn.customerId = this.customerSelected.id;
        this.salesOrderReturn.warehouseId = +this.warehouseSelected;
        this.salesOrderReturn.returnDate = this.getSelectedDate();
        this.salesOrderReturn.salesmanId = +this.salesmanSelected;
        this.salesOrderReturnService
            .save(this.salesOrderReturn)
            .subscribe(
                (res => {
                    if (res.body.errCode === '00') {
                        this.salesOrderReturn.id = res.body.id;
                        this.salesOrderReturn.returnNo = res.body.returnNo;
                        this.salesOrderReturn.status = res.body.status;
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
        this.salesOrderReturn.customer = null;
        this.salesOrderReturn.customerId = this.customerSelected.id;
        this.salesOrderReturn.warehouseId = +this.warehouseSelected;
        this.salesOrderReturn.returnDate = this.getSelectedDate();
        this.salesOrderReturn.salesmanId = +this.salesmanSelected;
        this.salesOrderReturnService.approve(this.salesOrderReturn)
            .subscribe(
                (res) => {
                    this.spinner.hide();
                    if (res.body.errCode === '00'){
                        Swal.fire('OK', 'Save success', 'success');
                        this.router.navigate(['/main/sales-order-return']);
                    } else {
                        Swal.fire('Failed', res.body.errDesc, 'warning');
                    }
                },
                () => { this.spinner.hide()},
                () => {  }
            );
    }

    isValidDataApprove(): boolean {
        if (this.salesOrderReturn.id ===0) {
            Swal.fire('Error', 'Data no order belum di save !', 'error');
            return false;
        }
        if (this.salesOrderReturnDetails.length <= 0) {
            Swal.fire('Error', 'Data Barang belum ada', 'error');
            return false;
        }
        return true;
    }

    rejectProccess(){
        this.salesOrderReturnService.reject(this.salesOrderReturn)
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
        this.salesOrderReturnService
            .preview(this.salesOrderReturn.id, tipeReport)
            .subscribe(dataBlob => {
                console.log('data blob ==> ', dataBlob);
                const newBlob = new Blob([dataBlob], { type: 'application/pdf' });
                const objBlob = window.URL.createObjectURL(newBlob);
                this.spinner.hide();

                window.open(objBlob);
            });

    }

    getTotal(salesOrderReturnDetail : SalesOrderReturnDetail){

        var total : number;

        total = salesOrderReturnDetail.price * salesOrderReturnDetail.qty;
        total = total - ( total * salesOrderReturnDetail.disc1 /100)
        total = total - ( total * salesOrderReturnDetail.disc2 /100)

        return total;

    }

    createInvoice() {

        this.spinner.show();
        this.salesOrderReturnService.createInvoice(this.salesOrderReturn.id)
            .subscribe(
                (res) => {
                    this.spinner.hide();
                    if (res.body.errCode === '00'){
                        Swal.fire('OK', 'created  success', 'success');
                        this.router.navigate(['/main/sales-order-return']);
                    } else {
                        Swal.fire('Failed', res.body.errDesc, 'warning');
                    }
                },
                () => { this.spinner.hide()},
                () => {  }
            );
    }
}
