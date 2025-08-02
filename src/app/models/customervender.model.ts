import { BaseDto } from "./base.model";
import { State } from "./state.model";

export class CustomerVendorResponseDto {
  customerGuid: string | null = null;
  customerCode: string | null = null;
  customerName: string | null = null;
  email: string | null = null;
  mobile: string | null = null;
  gSTIN: string | null = null;
  customerType: number | null = null; // 'Customer' or 'Vendor'
  customerTypeName: string | null = null; // 'Customer' or 'Vendor'
  isActive: boolean = true;
  remarks: string | null = null;
}

export interface CustomerVendorAddress  extends BaseDto{
  addressGuid: string | null ;
  addressType: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  stateId: number | null;
  zipCode: string;
  countryId: number | null;
  stateName?: string | null; // Optional, can be used for display purposes
  countryName?: string | null; // Optional, can be used for display purposes
  states?:State[];
  gstn?: string | null;
}

export interface CustomerVendorRequestDto extends BaseDto {
  customerGuid: string | null;
  customerId: number;
  customerCode: string;
  customerName: string;
  email: string;
  mobile: string;
  gstn: string | "";
  Remarks: string;
  CustomerType: string;
  shippingTermType:Number | null,
  paymentTermType:Number | null,
  shippingTermTypeName?: string;  
  paymentTermTypeName?: string;
  contactPersonName?:string;
  contachPersonNo?:string;
  contachPersonEmail?:string;
  gsttype:string;
  addresses: CustomerVendorAddress[];
}

export interface CustomerVendorListResDto {
  customerId: number;
  customerGuid: string | null;
  customerName: string;
  shippingTermId: number | null;
  shippingTerm: string | null;
  paymentTermId: number | null;
  paymentTerm: string | null;
}

export interface CustomerVendorListReqDto {
  CustomerType: string;
}

export interface CustomerVendorListAddressReqDto{
  customerGuid: string;
}

export interface CustomerVendorListAddressResDto{
  addressId: number;
  addressType: string;
  address: string;
  city: string;
  stateId: number | null;
  stateName: string;
  countryId: number | null;
  addressTypeName: string ; 
}