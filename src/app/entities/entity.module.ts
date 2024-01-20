import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { LookupModule } from './lookup/lookup.module';
import { LoginModule } from './login/login.module';
import { AppParameterModule } from './app-parameter/app-parameter.module';
import { SystemParameterModule } from './system-parameter/system-parameter.module';
import { AccessMatrixModule } from './access-matrix/access-matrix.module';
import { LookupGroupModule } from './lookup-group/lookup-group.module';
import { ProductGroupModule } from './product-group/product-group.module';
import { BrandModule } from './brand/brand.module';
import { CustomerModule } from './customer/customer.module';
import { SupplierModule } from './supplier/supplier.module';
import { ProductModule } from './product/product.module';
import { SalesOrderModule } from './sales-order/sales-order.module';
import { ReceivingModule } from './receiving/receiving.module';
import { AdjustmentModule } from './adjustment/adjustment.module';

import { SalesOrderPaymentModule } from './sales-order-payment/sales-order-payment.module';
import { SalesOrderReturnModule } from './sales-order-return/sales-order-return.module';

import { SalesmanModule } from './salesman/salesman.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { ReturnReceivingModule } from './return-receiving/return-receiving.module';
import { PaymentModule } from './payment/payment.module';
import { StockMutationModule } from './stock-mutation/stock-mutation.module';
import { OnlyNumberModule } from './app-directive/only-number.module';
import { HistoryStockModule } from './history-stock/history-stock.module';
import { StockModule } from './stock/stock.module';
import { PurchaseOrderModule } from './purchase-order/purchase-order.module';
import { DirectSalesPaymentModule } from './direct-sales-payment/direct-sales-payment.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { StockOpnameModule } from './stock-opname/stock-opname.module';
import { ReportPaymentModule } from './report/report-payment/report-payment.module';
import { ReportSalesModule } from './report/report-sales/report-sales.module';
import { StockInfoBatchModule } from './stock-info-batch/stock-info-batch.module';
import { PaymentSupplierModule } from './payment-supplier/payment-supplier.module';
import { ReportServiceService } from './report/report-service/report-service.service';
import { ReportServiceModule } from './report/report-service/report-service.module';
import { ReportPaymentSupplierModule } from './report/report-payment-supplier/report-payment-supplier.module';
import { ApotikParamModule } from './apotik-param/apotik-param.module';

@NgModule({
    imports: [
        UserModule,
        RoleModule,
        LookupModule,
        LoginModule,
        AppParameterModule,
        SystemParameterModule,
        AccessMatrixModule,
        // ReportModule,
        LookupGroupModule,
        ProductGroupModule,
        BrandModule,
        CustomerModule,
        SupplierModule,
        ProductModule,
        SalesOrderModule,
        ReceivingModule,
        AdjustmentModule,
        SalesOrderPaymentModule,
        SalesOrderReturnModule,
        SalesmanModule,
        WarehouseModule, 
        ReturnReceivingModule,
        PaymentModule,
        StockMutationModule,
        OnlyNumberModule,
        HistoryStockModule,
        StockModule,
        PurchaseOrderModule,
        DirectSalesPaymentModule,
        DashboardModule,
        StockOpnameModule,
        ReportPaymentModule,
        ReportSalesModule,
        StockInfoBatchModule,
        PaymentSupplierModule,
        ReportServiceModule,
        ReportPaymentSupplierModule,
        ApotikParamModule
    ],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    declarations: [],
    exports: []

})
export class EntityModule { }
