import { Component, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Adjustment, AdjustmentDetail, AdjustmentDetailPageDto } from '../adjustment.model';
import { Observable, forkJoin, of } from 'rxjs';
import { Product, ProductPageDto } from '../../product/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { AdjustmentService } from '../adjustment.service';
import { AdjustmentDetailService } from '../adjustment-detail.service';
import { debounceTime, distinctUntilChanged, switchMap, catchError, map } from 'rxjs/operators';
import { SERVER_PATH, TOTAL_RECORD_PER_PAGE } from 'src/app/shared/constants/base-constant';
import Swal from 'sweetalert2';
import { Warehouse, WarehouseDto } from '../../warehouse/warehouse.model';
import { WarehouseService } from '../../warehouse/warehouse.service';
import { GlobalComponent } from 'src/app/shared/global-component';
import { LocalStorageService } from 'ngx-webstorage';
import { isNumber } from 'lodash';

@Component({
  selector: 'op-adjustment-edit',
  templateUrl: './adjustment-edit.component.html',
  styleUrls: ['./adjustment-edit.component.css']
})
export class AdjustmentEditComponent implements OnInit {


    selectedDate: NgbDateStruct;
    adjustment: Adjustment;
    adjustmentDetails: AdjustmentDetail[];
    totalData = 0;
    total: number;
    totalRecord = TOTAL_RECORD_PER_PAGE;
    curPage = 1;
    /* Untuk search product
     * http
     */
    model: Observable<Product[]>;
    searching = false;
    searchFailed = false;
    totalRecordProduct = GlobalComponent.maxRecord;

    productIdAdded = 0;
    productNameAdded = '';
    hppAdded = 0;
    qtyAdded = 0;
    uomAdded = 0;
    uomAddedName = '';
    userLogin='';

    warehouses: Warehouse[];
    warehouseSelected: Warehouse;
    
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private http: HttpClient,
        private adjustmentService: AdjustmentService,
        private adjustmentDetailService: AdjustmentDetailService,
        private warehouseService: WarehouseService,
        private localStorage: LocalStorageService,
    ) {
        this.total = 0;
        this.qtyAdded = 0;
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
        this.userLogin = this.localStorage.retrieve('user-login').toUpperCase()

    }


    backToLIst() {
        this.router.navigate(['/main/adjustment']);
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
        if (orderId === 0) {
            this.loadWarehouse();
            this.loadNewData();
            return;
        }
        this.loadDataByOrderId(orderId);
    }

    loadNewData() {
        this.addNew();
    }

    loadWarehouse() {
        this.warehouseService.getWarehouse()
            .subscribe(
            (response: HttpResponse<WarehouseDto>) => {
                if (response.body.contents.length <= 0) {
                    Swal.fire('error', 'failed get warehouse data !', 'error');
                    return;
                }
                this.warehouses = response.body.contents;
                this.warehouseSelected = this.warehouses[0] ;
            });
    }
    
    addNew() {
        this.total = 0;
        this.qtyAdded = 0;
        this.adjustment = new Adjustment();
        this.adjustment.id = 0;
        this.adjustment.status = 0;
        this.adjustmentDetails = [];
        if (this.warehouses !== undefined) {
            this.adjustment.warehouse = this.warehouses[0];
        }
        this.setToday() ;
        this.clearDataAdded();
    }

    clearDataAdded() {
        this.productIdAdded = null;
        this.hppAdded = 0;
        this.productNameAdded = null;
        this.uomAdded = 0;
        this.qtyAdded = 1;
        this.model = null;
        this.uomAddedName = '';
    }

    loadDataByOrderId(orderId: number) {

        let adjustmentReq = this.adjustmentService.findById(orderId, this.totalRecord);
        let warehouseReq = this.warehouseService.getWarehouse();


        const requestArray = [];
        requestArray.push(adjustmentReq);
        requestArray.push(warehouseReq);
        forkJoin(requestArray).subscribe(results => {
            this.processAdjustment(results[0]);
            this.processWarehouse(results[1]);
            this.setDefaultWarehouse();
        });

    }

    processAdjustment(result: Adjustment) {
        console.log('isi adjustment result', result);
        this.totalData = result.totalRow;
        this.adjustment = result;
        this.adjustmentDetails = result.detail;

        console.log('isi adjustment detauil', this.adjustmentDetails);
        this.calculateTotal();
        this.curPage=0;
        this.adjustment.detail = null;
    }

    processWarehouse(result: HttpResponse<WarehouseDto>) {
        if (result.body.contents.length < 0) {
            return;
        }
        this.warehouses = result.body.contents;
       
        
    }

    setDefaultWarehouse() {
        if (this.adjustment.warehouse.id==0){
            this.warehouseSelected = this.warehouses[0] ;
            this.adjustment.warehouseId = this.warehouseSelected.id;
        } else {
            this.warehouseSelected = this.adjustment.warehouse ;
        }
        
    }

    calculateTotal() {
        // this.total = 0;

        // this.adjustmentDetails.forEach(adjustmentDetail => {
        //     this.total = this.total + (adjustmentDetail.hpp * adjustmentDetail.qty) ;
        // });
        this.adjustmentService
            .findByIdAdj(this.adjustment.id)
            .subscribe(
                (res => {
                    this.adjustment.total  = res.total
                }),
                () => {
                },
        );
    }

    getItem(event: any) {
        // event.preventDefault();
        console.log('get item ==>', event);
        this.productIdAdded = event.item.id;
        this.qtyAdded = 0;
        this.productNameAdded = event.item.name;
        this.uomAdded = event.item.smallUomId;
        this.uomAddedName = event.item.smallUom.name;
        this.hppAdded = event.item.hpp
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

       let adjustmentDetail = this.composeAdjustmentDetail();

       this.adjustmentDetailService
            .save(adjustmentDetail)
            .subscribe(
                (res => {
                    if (res.body.errCode === '00') {
                        this.reloadDetail(this.adjustment.id);
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
        // Swal.fire('Error', 'Product belum terpilih, silahlan pilih lagi [x]! ', 'error');
        // return result;
    }

    checkInputNumberValid(): boolean {
        // let result = true;

        if ( (isNaN(this.qtyAdded)) || (this.qtyAdded === null) ) {
            // result = false;
            return false;
        }

        if (this.qtyAdded == 0) {
            return false;
        }

        return true;
    }

    composeAdjustmentDetail(): AdjustmentDetail {
        let adjustmentDetail = new AdjustmentDetail();
        adjustmentDetail.adjustmentId = this.adjustment.id;
        adjustmentDetail.hpp = this.hppAdded;
        adjustmentDetail.productId = this.productIdAdded;
        adjustmentDetail.qty = this.qtyAdded;
        adjustmentDetail.uomId = this.uomAdded;
        return adjustmentDetail;
    }

    reloadDetail(id: number) {
        console.log("Total record : ", this.totalRecord)
        this.adjustmentDetailService
            .findByAdjustmentId({
                count: this.totalRecord,
                page: this.curPage,
                filter : {
                    adjustmentId: id,
                }
            }).subscribe(
                (res: HttpResponse<AdjustmentDetailPageDto>) => this.fillDetail(res),
                (res: HttpErrorResponse) => console.log(res.message),
                () => {}
            );
    }

    fillDetail(res: HttpResponse<AdjustmentDetailPageDto>) {
        this.adjustmentDetails = [];
        if (res.body.contents.length > 0) {

            this.adjustmentDetails = res.body.contents;
            this.totalData = res.body.totalRow;
           
        }
        this.calculateTotal();
        this.clearDataAdded();
    }

    confirmDelItem (adjustmentDtl: AdjustmentDetail) {
        Swal.fire({
            title : 'Confirm',
            text : 'Are you sure to cancel [ ' + adjustmentDtl.product.name + ' ] ?',
            type : 'info',
            showCancelButton: true,
            confirmButtonText : 'Ok',
            cancelButtonText : 'Cancel'
        })
        .then(
            (result) => {
            if (result.value) {
                    this.delItem(adjustmentDtl.id, adjustmentDtl.adjustmentId);
                }
            });
    }

    updateQty(adjustmentDtl: AdjustmentDetail) {
        this.adjustmentDetailService
            .updateQtyById(adjustmentDtl)
            .subscribe
                (res => {
                    if (res.body.errCode === '00') {
                        Swal.fire('Success', "Success", 'info');
                        this.reloadDetail(this.adjustment.id);
                    } else {
                        Swal.fire('Error', res.body.errDesc, 'error');
                    }
                }
            ); 
    }

    delItem(idDetail: number, idAdjustment: number) {
        this.adjustmentDetailService
            .deleteById(idDetail, idAdjustment)
            .subscribe(
                (res: AdjustmentDetail) => {
                    if (res.errCode === '00') {
                        Swal.fire('Success', 'Data cancelled', 'info');
                        this.reloadDetail(this.adjustment.id);
                    } else {
                        Swal.fire('Failed', 'Data failed cancelled', 'info');
                    }
                },
            );
    }

    saveHdr() {
        this.adjustment.adjustmentDate = this.getSelectedDate();
        this.adjustment.warehouseId = this.warehouseSelected.id;
        this.adjustmentService
            .save(this.adjustment)
            .subscribe(
                (res => {
                    if (res.body.errCode === '00') {
                        this.adjustment.id = res.body.id;
                        this.adjustment.adjustmentNo = res.body.adjustmentNo;
                        this.adjustment.status = res.body.status;
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

        if (!this.isValidDataApprove()) {
            return;
        }

        Swal.fire({
            title : 'Confirm',
            text : 'Are you sure to approve ' + this.userLogin + '  ?',
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
        // this.adjustment.warehouse = this.warehouseSelected;
        console.log('selected : ' , this.warehouseSelected.id)
        this.adjustment.warehouseId = this.warehouseSelected.id;
        this.adjustmentService.approve(this.adjustment)
            .subscribe(
                (res) => {
                    if (res.body.errCode === '00'){
                        Swal.fire('OK', 'Save success', 'success');
                        this.router.navigate(['/main/adjustment']);
                    } else {
                        Swal.fire('Failed', res.body.errDesc, 'warning');
                    }
                }
            );
    }

    isValidDataApprove(): boolean {
        if (this.adjustment.id ===0) {
            Swal.fire('Error', 'Data no order belum di save !', 'error');
            return false;
        }
        if (this.adjustmentDetails.length <= 0) {
            Swal.fire('Error', 'Data Barang belum ada', 'error');
            return false;
        }
        return true;
    }

    preview() {
        this.adjustmentService
            .preview(this.adjustment.id)
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

    loadPage(){
        this.reloadDetail(this.adjustment.id);
    }

}
