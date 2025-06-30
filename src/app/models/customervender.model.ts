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

export interface CustomerVendorAddress {
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

export interface CustomerVendorRequestDto {
  customerGuid: string | null;
  customerId: number;
  customerCode: string;
  customerName: string;
  email: string;
  mobile: string;
  gstn: string | "";
  Remarks: string;
  CustomerType: string;
   isActive: boolean;
  addresses: CustomerVendorAddress[];
}
