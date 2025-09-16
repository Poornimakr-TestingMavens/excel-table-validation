import * as XLSX from 'xlsx';
import * as fs from 'fs';

export class ExcelHelper {
  static writeExcel(filePath: string, data: string[][]) {
    const ws = XLSX.utils.aoa_to_sheet(data); // Array of Arrays -> Sheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, filePath);
  }

  static readExcel(filePath: string): (string | number)[][] {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Excel file not found: ${filePath}`);
    }
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as (string | number)[][];
  }
}
