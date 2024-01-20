import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LookupService } from '../../lookup/lookup.service';
import Swal from 'sweetalert2';
import { BrandService } from '../../brand/brand.service';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { Lookup, LookupDto, LookupPageDto } from '../../lookup/lookup.model';
import { HttpResponse } from '@angular/common/http';
import { Brand, BrandPageDto } from '../../brand/brand.model';
import { ProductGroupService } from '../../product-group/product-group.service';
import { ProductGroupPageDto, ProductGroup } from '../../product-group/product-group.model';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
    selector: 'op-product-modal',
    templateUrl: './product-modal.component.html',
    styleUrls: ['./product-modal.component.css']
})
export class ProductModalComponent implements OnInit {

    @Input() statusRec;
    @Input() objEdit: Product;
    @Input() viewMsg;

    showBrand = false;
    statuses = ['Active', 'Inactive'];
    statusSelected: string;

    sellPriceTypes = ['byPrice', 'byPercent'];
    sellPriceTypeSelected: string;

    product: Product;
    bankSelected: number;
    products: Product[];
    isFormDirty: Boolean = false;
    smallUoms: Lookup[];
    bigUoms: Lookup[];
    brands: Brand[];
    productGroups: ProductGroup[];
    productGroupSelected: number;
    brandSelected: number;
    smallUomSelected: number;
    bigUomSelected: number;
    userLogin='';

    constructor(
        public productService: ProductService,
        public modalService: NgbModal,
        public bankService: LookupService,
        public brandService: BrandService,
        public lookupService: LookupService,
        public productGroupService: ProductGroupService,
        private localStorage: LocalStorageService,
    ) { }

    ngOnInit() {
        console.log('obj to edit -> ', this.objEdit);
        console.log(this.statusRec);
        this.userLogin = this.localStorage.retrieve('user-login').toUpperCase()

        // ADDNEW
        if (this.statusRec === 'addnew') {
            this.setDefaultValue();
            this.findAllLookup();
            this.product = new Product();
            return ;
        } 
        
        // EDIT DATA
        // this.product = this.objEdit;
        this.productService.findById({
            id : this.objEdit.id
        }).subscribe(
            result  => {
                this.product = result.body.contents[0];
                if (this.product.status === 1) {
                    this.statusSelected = this.statuses[0];
                } else {
                    this.statusSelected = this.statuses[1];
                }
                this.sellPriceTypeSelected = this.sellPriceTypes[this.product.sellPriceType];
                this.findAllLookup();
            }
        );
    
    }

    findAllLookup() {
        let searchTerm = {
            code: '',
            name: '',
        };
        let brandReq = this.brandService.filter({
            page: 1,
            count: 10000,
            filter: searchTerm
        });
        let lookupReq = this.lookupService.findByName({
            groupName:  'UOM'
        });
        let productGroupReq = this.productGroupService.filter({
            page: 1,
            count: 10000,
            filter: searchTerm
        });

        const requestArray = [];
        requestArray.push(brandReq);
        requestArray.push(lookupReq);
        requestArray.push(productGroupReq);

        forkJoin(requestArray).subscribe(results => {
            this.processBrand(results[0]);
            this.processLookup(results[1]);
            this.processProductGroup(results[2]);
            this.setDefaultLookup();
        });

    }
    processLookup(result: HttpResponse<LookupPageDto>) {
        if (result.body.errCode === '00' ) {
            this.bigUoms = result.body.contents;
            this.smallUoms = result.body.contents;
        }
    }

    processBrand(result: HttpResponse<BrandPageDto>) {
        if (result.body.count > 0) {
            this.brands = result.body.contents;
        }
    }

    processProductGroup(result: HttpResponse<ProductGroupPageDto>) {
        if (result.body.count > 0) {
            this.productGroups = result.body.contents;
        }
    }

    setDefaultLookup(){
        if (this.statusRec === 'addnew') {
            this.bigUomSelected = this.bigUoms[0].id;
            this.smallUomSelected = this.smallUoms[0].id;
            this.brandSelected = this.brands[0].id;
            this.productGroupSelected = this.productGroups[0].id;
        } else {
            this.bigUomSelected = this.product.bigUomId;
            this.smallUomSelected = this.product.smallUomId;
            this.brandSelected = this.product.brandId;
            this.productGroupSelected = this.product.productGroupId;
        }
    }

    setDefaultValue() {
        this.product = {};
        this.product.qtyUom = 1;
        this.statusSelected = this.statuses[0];
        this.sellPriceTypeSelected = this.sellPriceTypes[0];
    }

    async save() {

        if (! await this.confirmSave()) {
            return ;
        }

        if (! await this.validateProduct()) {
            return ;
        }

        // return ;
        // this.lookup.lookupGroup = this.lookupGroupSelected;
        this.product.Brand = null;
        this.product.ProductGroup = null;
        this.smallUoms = null;
        this.bigUoms = null;
        this.product.status = (this.statusSelected === 'Active' ? 1 : 0);
        this.product.brandId = Number(this.brandSelected);
        this.product.productGroupId =  Number(this.productGroupSelected);
        this.product.smallUomId = Number(this.smallUomSelected);
        this.product.bigUomId = Number(this.bigUomSelected);
        this.product.sellPriceType = this.sellPriceTypes.findIndex(sellPrice=> sellPrice ===  this.sellPriceTypeSelected ) ;
        // this.product.bankId = this.bankSelected;
        this.productService.save(this.product).subscribe(result => {
            this.isFormDirty = true;
            if (result.body.errCode === '00') {
                console.log('success');
                Swal.fire('Success', 'Save success ', 'info');
                this.modalService.dismissAll('refresh');
            } else {
                Swal.fire('Error', result.body.errDesc, 'error');
                console.log('Toast err');
            }
        });
    }

    async confirmSave() {

        var isValid = true;
        
       
        await Swal.fire({
            title : 'Confirm',
            text : 'Apakah anda yakin untuk menyimpan data ini ' + this.userLogin + '  ?',
            type : 'info',
            showCancelButton: true,
            confirmButtonText : 'Ok',
            cancelButtonText : 'Cancel'
        })
        .then(
            (result) => {
                console.log('result confirm ===>', result)
                if (!result.value) {
                    isValid = false;   
                    return isValid;
                }
        });
        
        return isValid;
    }

    async validateProduct() {

        var isValid = true;
        
        console.log('name ===>', this.product.name)
        if (this.product.name === '') {
            isValid = false;
            await Swal.fire("Error", "Name kosong !", "error");
            return isValid;
        }

        if (this.sellPriceTypeSelected === 'byPercent' && this.product.sellPrice>100){
            console.log("exec swal  ", isValid);
            await Swal.fire({
                title : 'Confirm',
                text : 'Persentase Harga Jual melebihi 100%, Anda yakin untuk menyimpan  ?',
                type : 'info',
                showCancelButton: true,
                confirmButtonText : 'Ok',
                cancelButtonText : 'Cancel'
            })
            .then(
                (result) => {
                    console.log('result confirm ===>', result)
                    if (!result.value) {
                        isValid = false;   
                        return isValid;
                    }
            });
            
        }
        console.log("valid? ", isValid);
        return isValid;
    }

    closeForm(): void {
        if (this.isFormDirty === true) {
            this.modalService.dismissAll('refresh');
        } else {
            this.modalService.dismissAll('close');
        }
    }

    getSellPrice(product: Product) {

        if (this.sellPriceTypeSelected === 'byPrice') {
            return product.sellPrice;
        }
        return product.hpp;
    }
}
