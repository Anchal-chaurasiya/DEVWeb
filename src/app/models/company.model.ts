import { State } from "./state.model";

export interface CompanyDto  {
  companyGuid: string | null;
  companyId: number;
  companyName: string;
  companyType?: string | null;
  mobileNo: string;
  emailId: string;
  logo?: string | null;
  gstn?: string | null;
  tin?: string | null;
  pan: string;
  bAddress: string;
  bAddress2?: string | null;
  bCity: string;
  bStateId: number | null;
  bCountryId: number;
  bZipCode: string;
  sAddress1: string;
  sAddress2?: string | null;
  sCity: string;
  sStateId: number | null;
  sCountryId: number;
  bZipCode1: string;
  bankName?: string | null;
  accountHolderName?: string | null;
  accountNo?: string | null;
  ifscCode?: string | null;
  accountType?: string | null;
  swiftCode?: string | null;
  upiId?: string | null;
  isActive: boolean;
  states?:State[];
  sstates?:State[];
  remarks?: string | null;
}