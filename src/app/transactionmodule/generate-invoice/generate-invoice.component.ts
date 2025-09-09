import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../modules/shared/navbar/navbar.component';
import { FooterComponent } from '../../modules/shared/footer/footer.component';
import { toWords } from 'number-to-words';
import { format } from 'date-fns';
@Component({
  selector: 'app-generate-invoice',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './generate-invoice.component.html',
  styleUrls: ['./generate-invoice.component.css']
})
export class GenerateInvoiceComponent {
  loading= false;
  isIntraState=false;
  invoice = {
    invoiceNumber: '',
    invoiceDate: '',
    deliveryNote: '',
    referenceNo: '',
    buyersorderno: '',
    dispatchDocNo: '',
    referenceDate: '',
    consigneeaddress:'',
    consigneemobileno: '',
    consigneegstno: '',
    buyergstno: '',
    buyermobileno: '',
    buyeraddress:'',
    consigneestate:'',
    buyerstate:'',
    subtotal:0.0,
    t_cgstamount:0.0,
    t_sgstamount:0,
    t_igstamount:0,
    totaltaxamount:0,
    aftertaxamounttotal:0,
    items: [
      { description: '', hsn: '', qty: 1, rate: 0,amount:0,discountPercentage:0,discountAmount:0,cgstRate:0,cgstAmount:0,sgstRate:0,sgstAmount:0,igstRate:0,igstAmount:0,totaltaxamount:0,totalAmount:0 }
    ]
  };

  constructor(private cdr: ChangeDetectorRef){}

  addItem() {
    this.invoice.items.push({ description: '', hsn: '', qty: 1, rate: 0,amount:0,discountPercentage:0, discountAmount:0,cgstRate: 0,cgstAmount:0 ,sgstRate:0,sgstAmount:0,igstRate:0,igstAmount:0,totaltaxamount:0, totalAmount:0 });
  }

  removeItem(index: number) {
    this.invoice.items.splice(index, 1);
    this.updateAmount(index);
  }

 generateInvoice() {
  const printHtml = `
   <html lang="en"><head>
  <meta charset="UTF-8">
  <title>Invoice ${this.invoice.invoiceNumber}</title>
  <style>
    body { font-family: 'Courier New', monospace; font-size: 14px; margin: 20px; }
    .invoice-box { width: 100%; border: 1px solid #000; padding: 10px; }
    .title { text-align: center; font-weight: bold; font-size: 16px; }
    .subtitle { text-align: center; margin-bottom: 10px; }
    .row { display: flex; border-bottom: 1px solid #000; }
    .col { flex: 1; padding: 5px; border-right: 1px solid #000; }
    .col:last-child { border-right: none; }
    table { width: 100%; border-collapse: collapse; margin-top: 5px; }
    th, td { border: 1px solid #000; padding: 4px; font-size: 13px; }
    th { background: #f1f1f1; text-align: center; }
    .right { text-align: right; }
    .center { text-align: center; }
    .small { font-size: 12px; }
    .footer { margin-top: 15px; border-top: 1px solid #000; padding-top: 10px; }
    .sign { text-align: right; margin-top: 50px; }
  </style>
</head>
<body onload="window.print(); window.onafterprint = window.close;">

<div class="invoice-box">

  <div class="title">Accounting Voucher Display</div>
  <div class="subtitle">Tax Invoice (ORIGINAL FOR RECIPIENT)</div>

  <!-- Company + Consignee + Buyer -->
  <div class="row">
    <div class="col">
      <strong>Divika IT & Digital Services</strong><br>
      UG-5, Plot No. 751, Nitikhand 1, Indirapuram, Ghaziabad, UP-201014<br>
      GSTIN/UIN: 09EJTPS7117A1ZT<br>
      State: Uttar Pradesh<br>
      Contact: 9575695798 <br>
      Email: Info@divika.net
    </div>
    <div class="col">
      <strong>Consignee (Ship to)</strong><br>
      ${this.invoice.consigneeaddress}<br>
      Mob: ${this.invoice.consigneemobileno}<br>
      GSTIN/UIN: ${this.invoice.consigneegstno}<br>
      State: ${this.invoice.consigneestate}
    </div>
    <div class="col">
      <strong>Buyer (Bill to)</strong><br>
      ${this.invoice.buyeraddress}<br>
      Mob: ${this.invoice.buyermobileno}<br>
      GSTIN/UIN: ${this.invoice.buyergstno}<br>
      State: ${this.invoice.buyerstate}
    </div>
  </div>

  <!-- Invoice details -->
  <table>
    <tbody><tr>
      <td><strong>Invoice No.</strong>${this.invoice.invoiceNumber}</td>
      <td><strong>Dated:</strong> ${this.formattedDate}</td>
      <td><strong>Delivery Note</strong> ${this.invoice.deliveryNote}</td>
    </tr>
    <tr>
      <td><strong>Reference No. &amp; Date</strong> ${this.invoice.referenceNo} ${this.invoice.referenceDate}</td>
      <td><strong>Buyer's Order No.</strong> ${this.invoice.buyersorderno}</td>
      <td><strong>Dispatch Doc No.</strong> ${this.invoice.dispatchDocNo}</td>
    </tr>
  </tbody></table>

  <!-- Items -->
  <table>
    <thead>
      <tr>
        <th>Sl No.</th>
        <th>Description of Goods/Services</th>
        <th>HSN/SAC</th>
        <th class="center">Qty</th>
        <th class="right">Rate</th>
        <th class="right">Amount</th>
      </tr>
    </thead>
    <tbody>
 ${this.invoice.items.map((item, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td>${item.description}</td>
                  <td>${item.hsn}</td>
                  <td style="text-align:right">${item.qty}</td>
                  <td style="text-align:right">${item.rate.toFixed(2)}</td>
                  <td style="text-align:right">${item.amount}</td>
                </tr>
              `).join('')}
    </tbody>
    <tfoot>
      <tr>
        <td colspan="5" class="right"><strong>Sub Total</strong></td>
        <td class="right">${this.invoice.subtotal}</td>
      </tr>
      ${!this.isIntraState ? `
    <tr>
      <td colspan="5" class="right">CGST</td>
      <td class="right">${this.invoice.t_cgstamount}</td>
    </tr>
    <tr>
      <td colspan="5" class="right">SGST</td>
      <td class="right">${this.invoice.t_sgstamount}</td>
    </tr>
  ` : `
    <tr>
      <td colspan="5" class="right">IGST</td>
      <td class="right">${this.invoice.t_igstamount}</td>
    </tr>
  `}
      <tr>
        <td colspan="5" class="right"><strong>Total</strong></td>
        <td class="right"><strong>${this.invoice.aftertaxamounttotal}</strong></td>
      </tr>
    </tfoot>
  </table>

  <p><strong>Amount in words:</strong>${this.amountInWords}</p>
  <p><strong>Tax Amount in words:</strong> ${this.taxamountInWords} </p>

  <div class="footer">
    <h4>Company's Bank Details</h4>
    Bank: Yes Bank Ltd. | A/c No.: 134761900001392<br>
    Branch: Sector 10D, Vasundhara | IFSC: YESB0001347<br>
    PAN: EJTPS7117A
  </div>

  <div class="footer small">
    <strong>Declaration:</strong><br>
    1. Payment should be made in favour of Divika IT & Digital Services<br>
    2. All Warranties as per principal's terms.<br>
    3. All disputes subject to Uttar Pradesh jurisdiction.
  </div>

  <div class="sign">
    for Divika IT & Digital Services<br><br>
    Authorised Signatory
  </div>

  <p class="center small">This is a Computer Generated Invoice</p>
</div>





</body></html>
  `;

  const printWindow = window.open('', '_blank', 'height=800,width=800');
  printWindow?.document.write(printHtml);
  printWindow?.document.close();
  printWindow?.focus();
}



updateAmount(index: number) {
    const item = this.invoice.items[index];
    const qty = Number(item.qty) || 0;
    const price = Number(item.rate) || 0;
    const discountPercent = Number(item.discountPercentage) || 0;
    const cgstRate = Number(item.cgstRate) || 0;
    const sgstRate = Number(item.sgstRate) || 0;
    const igstRate = Number(item.igstRate) || 0;
    item.amount = parseFloat((qty * price).toFixed(2));
    item.discountAmount = ((qty * price) * discountPercent) / 100;
    const taxable = (qty * price) - item.discountAmount;
    console.log("isIntraState",this.isIntraState);
    if(this.isIntraState==false){

    item.cgstAmount = parseFloat(((taxable * cgstRate) / 100).toFixed(2));
    item.sgstAmount = parseFloat(((taxable * sgstRate) / 100).toFixed(2));
    item.igstAmount = 0;
    }
   if(this.isIntraState==true){
      item.cgstAmount = 0;
      item.sgstAmount = 0;
      item.igstAmount = parseFloat(((taxable * igstRate) / 100).toFixed(2));
   }
    item.totalAmount =parseFloat(( taxable + item.cgstAmount + item.sgstAmount + item.igstAmount).toFixed(2));
    item.totaltaxamount = parseFloat((item.cgstAmount + item.sgstAmount + item.igstAmount).toFixed(2));
    this.updateSummary();
  }

  updateSummary() {
    this.invoice.subtotal = parseFloat( this.invoice.items.reduce((sum: number, item: any) => sum + Number((item.amount) || 0), 0).toFixed(2));
    this.invoice.t_cgstamount = parseFloat(this.invoice.items.reduce((sum: number, item: any) => sum + (Number(item.cgstAmount)|| 0), 0).toFixed(2));
    this.invoice.t_sgstamount = parseFloat(this.invoice.items.reduce((sum: number, item: any) => sum + (Number(item.sgstAmount)|| 0), 0).toFixed(2));
    this.invoice.t_igstamount = parseFloat(this.invoice.items.reduce((sum: number, item: any) => sum + (Number(item.igstAmount)|| 0), 0).toFixed(2));
    this.invoice.aftertaxamounttotal = parseFloat(this.invoice.items.reduce((sum: number, item: any) => sum + (Number(item.totalAmount)|| 0), 0).toFixed(2));
  }

 

 get amountInWords(): string {

    if (!this.invoice.aftertaxamounttotal) return '';

    // Split the amount into integer and decimal parts
    const [integerPart, decimalPart] = this.invoice.aftertaxamounttotal.toFixed(2).split('.');
    const integerWords = toWords(parseInt(integerPart)); // Convert integer part to words
    let decimalWords = '';

    // Convert decimal part to words if it exists and is not zero
    if (decimalPart && parseInt(decimalPart) > 0) {
      decimalWords = `and ${toWords(parseInt(decimalPart))} paise`;
    }

    // Capitalize first letter and format the output
    const capitalizedWords = integerWords.charAt(0).toUpperCase() + integerWords.slice(1);
    return `${capitalizedWords} rupees ${decimalWords} only`.trim();
  }

  get taxamountInWords(): string {
    const tax_amount= this.invoice.t_cgstamount + this.invoice.t_sgstamount + this.invoice.t_igstamount;

    if (!tax_amount) return '';

    // Split the amount into integer and decimal parts
    const [integerPart, decimalPart] = tax_amount.toFixed(2).split('.');
    const integerWords = toWords(parseInt(integerPart)); // Convert integer part to words
    let decimalWords = '';

    // Convert decimal part to words if it exists and is not zero
    if (decimalPart && parseInt(decimalPart) > 0) {
      decimalWords = `and ${toWords(parseInt(decimalPart))} paise`;
    }

    // Capitalize first letter and format the output
    const capitalizedWords = integerWords.charAt(0).toUpperCase() + integerWords.slice(1);
    return `${capitalizedWords} rupees ${decimalWords} only`.trim();
  }


  get formattedDate(): string {
    if (this.invoice.invoiceDate) {
      return format(this.invoice.invoiceDate, 'dd-MMM-yyyy'); // Format to dd-MMM-yyyy
    }
    return ''; // Return empty string if no date is selected
  }

  onIgstChange() {
   
      this.invoice.items.forEach(item => {
        this.updateAmount(this.invoice.items.indexOf(item));
      });
  }
}


