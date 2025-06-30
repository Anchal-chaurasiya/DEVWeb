 export interface CommonReqDto<T>{
    CompanyId: number;
    mCompanyGuid : string | null;
    PageSize: number;
    PageRecordCount: number;
    UserId:number;
    Data: T;
}

 export interface CommonResDto<T>{
    CompanyId: number;
    PageSize: number;
    PageRecordCount: number;
    UserId:number;
    data: T;
    message: string;
    flag:number
}