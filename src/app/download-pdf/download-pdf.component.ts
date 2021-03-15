import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { CatalogService } from '@app/_services/catalog.service';
declare var jsPDF: any;
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-download-pdf',
  templateUrl: './download-pdf.component.html',
  styleUrls: ['./download-pdf.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DownloadPdfComponent implements OnInit {

  pdfData;
  @ViewChild('pdfTable', {static: false}) pdfTable: ElementRef;

  constructor(public catalogService : CatalogService) { }

  ngOnInit() {
    console.log(this.catalogService);
    this.pdfData = localStorage.getItem('pdfData');
    
  }

  public downloadAsPDF() {
    const doc = new jsPDF();

    const specialElementHandlers = {
      '#editor': function (element, renderer) {
        return true;
      }
    };

    const pdfTable = this.pdfTable.nativeElement;

    doc.fromHTML(pdfTable.innerHTML, 15, 15, {
      'width': 190,
      'elementHandlers': specialElementHandlers
    }, function  (dispose) { 
            doc.save('tableToPdf.pdf');
    });
  }

}
