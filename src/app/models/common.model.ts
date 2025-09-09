 export interface CommonReqDto<T>{
    companyGuid : string | null;
    mCompanyGuid : string | null;
    PageSize: number;
    PageRecordCount: number;
    UserId:number;
    Data: T;
}

 export interface CommonResDto<T>{
    pageSize: number;
    pageRecordCount: number;
    totalRecordCount:number;
    UserId:number;
    data: T;
    message: string;
    flag:number
}