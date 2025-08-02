import { BaseDto } from "./base.model";

export interface PurchaseOrder extends BaseDto {
  purchaseGuid: string;
  purchaseId: number;
  vendorId: number;
  vendorGuid: string|null;
  addressId: number|null;
  purchaseOrderNo: number;
  placeOfSupply: string;
  purchaseOrderDate: Date;
  deliveryDate: Date;
  shippingTermId: number;
  paymentTermId: number;
  refNo: string;
  contactPersonName: string;
  contachPersonNo: string;
  contachPersonEmail?: string;
  totalAmount: number;
  isCancel: boolean;
  isActive: boolean;
  purchaseOrderDetailReqDtos: PurchaseOrderDetailReqDto[];
  purchaseOrderPaymentReqDtos: PurchaseOrderPaymentReqDto[];
  purchaseType:string;
}

export interface PurchaseOrderDetailReqDto {
  rowId: number;
  purchaseDetailGuid: string | null;
  purchaseDetailId: number;
  purchaseId: number;
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

export interface PurchaseOrderPaymentReqDto {
  purchasePaymentGuid: string | null;
  purchasePaymentId: number;
  purchaseId: number;
  amount: number;
  paymentMode: string;
  refrenceNo?: string;
}

export interface PurchaseOrderPaymentHeaderDto   {
  purchaseGuid: string | null;
  PurchaseOrderPaymentReqDtos: PurchaseOrderPaymentReqDto[];
}

export interface PurchaseOrderListResponse{
  purchaseGuid: string;
  purchaseId: number;
  purchaseOrderNo: number;
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

export interface PurchaseOrderUpdateDto{
  purchaseGuid: string;
  cancelRemark:string
}

export interface GetMaxPurchaseOrderNoResponse {
  purchaseOrderNo: number;
}

export interface PurchaseItemViewDto{
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
}

export interface PurchasePaymentViewDto{
  amount: number;
  paymentMode: string;
  refrenceNo?: string;
  createdOn: string;
}

export interface PurchaseOrderViewResponse {
  customerCode : string;
  customerName : string;
  contactPersonName: string;
  contachPersonNo: string;  
  contachPersonEmail?: string;
  bAddress: string;
  sAddress: string;
  bStateName:string;
  sStateName:string;
  purchaseType:string;
  refNo: string;
  placeOfSupply: string;
  purchaseOrderNo:number;
  purchaseOrderDate: string;
  deliveryDate:string;
  shippingTerm: string;
  paymentTerm: string;
  totalAmount: number;
  items: PurchaseItemViewDto[];
  payments: PurchasePaymentViewDto[];
}