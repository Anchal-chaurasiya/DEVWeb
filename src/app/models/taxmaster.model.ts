export interface TaxMaster {
  taxGuid:string | null;
  taxId?: number;
  taxName: string;
  taxPercentage: number;
  isActive: boolean;
  remarks?: string;
}
