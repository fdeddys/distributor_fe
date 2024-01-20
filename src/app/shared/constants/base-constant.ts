import { environment } from "src/environments/environment";


// develop
// export const SERVER = 'http://localhost:8800/';
// export const SERVER = 'http://103.82.242.11:8800/';
export const SERVER = environment.APIEndpoint;

// server LOCAL
// export const SERVER = 'http://192.168.100.200:8800/';
// PROD
// export const SERVER = '/rosebe/';

export const PATH_IMAGES = 'api/images/uploadFile';
export const PATH_UPLOAD_IMAGES_MERCHANT = 'api/images/uploadFileMerchant';


export const SERVER_PATH = SERVER + 'api/';
export const AUTH_PATH = SERVER + 'auth/';
export const REPORT_PATH = SERVER + 'report/';
export const TOTAL_RECORD_PER_PAGE = 10;



// 
export const CUSTOMER_CASH_ID = 99999999;
export const APPNAME = 'LOGITECH INDONESIA';
export const APP_VERSION = 'F18062022';
export const APP_DATE = '281021';
