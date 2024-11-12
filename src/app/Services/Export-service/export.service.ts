import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }

  exportAsExcelFile(data: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(data, `${fileName}.xlsx`);
  }


  exportBulkExcel(data: any[], excelFileName: string): void {

    const workbook: XLSX.WorkBook = { Sheets: {}, SheetNames: [] };

  // Loop through each data array and create a sheet for it
  data.forEach((dataArray, index) => {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataArray.data);
    const sheetName = dataArray.fileName || `Sheet${index + 1}`; // Use sheetNames if provided, otherwise fallback to default names
    workbook.Sheets[sheetName] = worksheet;
    workbook.SheetNames.push(sheetName);
  });

  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  this.saveAsExcelFile(excelBuffer, excelFileName);
  }
}
