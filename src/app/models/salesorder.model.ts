import { BaseDto } from "./base.model";

export interface SalesOrder extends BaseDto {
  sellGuid: string;
  sellId: number;
  customerId: number;
  customerGuid:string;
  sellOrderNo:number;
  placeOfSupply: string;
  sellOrderDate: Date;
  deliveryDate: Date;
  shippingTermId: number;
  paymentTermId: number;
  refNo: string;
  contactPersonName: string;
  contachPersonNo: string;
  contachPersonEmail?: string;
  totalAmount: number;
  isCancel: boolean;
  sellType:string;
  addressId:number;
  sAddressId:number,
  sellOrderDetailReqDtos: SalesOrderDetailReqDto[];
  sellOrderPaymentReqDtos: SalesOrderPaymentReqDto[];
  
}

export interface SalesOrderDetailReqDto {
  rowId: number;
  sellDetailGuid: string | null;
  sellDetailId: number;
  sellId: number;
  sno: number;
  itemGuid: string|null;
  itemId: number| null;
  itemdescription:string | null;
  qty: number ;
  price: number;
  discountPercentage?: number;
  discountAmount?: number;
  cgstRate?: number;
  cgstAmount?: number;
  sgstRate?: number;
  sgstAmount?: number;
  igstRate?: number;
  igstAmount?: number;
  totalAmount: number;
}

export interface SalesOrderPaymentReqDto {
  sellPaymentGuid: string | null;
  sellPaymentId: number;
  sellId: number;
  amount: number;
  paymentMode: string;
  refrenceNo?: string;
}

export interface SalesOrderPaymentHeaderDto   {
  sellGuid: string | null;
  sellOrderPaymentReqDtos: SalesOrderPaymentReqDto[];
}

export interface SalesOrderListResponse{
  sellGuid: string;
  sellId: number;
  sellOrderNo: number;
  customerCode: string;
  customerName: string;
  refNo:string;
  isActive: boolean;
  isCancel: boolean;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  createdDate: string
} 

export interface SalesOrderUpdateDto{
  sellGuid: string;
  cancelRemark:string
}

export interface GetMaxSalesOrderNoResponse {
  sellOrderNo: number;
}

export interface SalesItemViewDto{
  sno:number;
  itemCode:string;
  itemName: string;
  qty:number;
  price: number;
  discountPercentage?: number;
  discountAmount?: number;
  igstRate?: number;
  igstAmount?: number;
  cgstRate?: number;
  cgstAmount?: number;
  sgstRate?: number;
  sgstAmount?: number;
  totalAmount:number;
}

export interface SalesPaymentViewDto{
  amount: number;
  paymentMode: string;
  refrenceNo?: string;
  createdOn: string;
}

export interface  SalesOrderViewResponse {
  sellOrderNo:number;  
  customerCode : string;
  customerName : string;
  contactPersonName: string;
  contachPersonNo: string;  
  contachPersonEmail?: string;
  bAddress: string;
  sAddress: string;
  bStateName:string;
  sStateName:string;
  refNo: string;
  placeOfSupply: string;
  sellOrderDate: string;
  deliveryDate:string;
  shippingTerm: string;
  paymentTerm: string;
  totalAmount: number;
  sellType:string;
  items: SalesItemViewDto[];
  payments: SalesPaymentViewDto[];
}