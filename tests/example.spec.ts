import { test, expect } from '@playwright/test';
import { WebTablePage } from '../pages/webTable';
import { ExcelHelper } from '../utils/excelHelper';
import fs from 'fs';
import path from 'path';

// Define artifacts folder path
const artifactsDir = path.resolve(process.cwd(), '.artifacts/webtable');

// Ensure folder exists
if (!fs.existsSync(artifactsDir)) {
  fs.mkdirSync(artifactsDir, { recursive: true });
}

const fullTablePath = path.join(artifactsDir, 'fullTable.xlsx');
const columnPath = path.join(artifactsDir, 'column.xlsx');
const rowPath = path.join(artifactsDir, 'row.xlsx');

test.describe('Web Table Data Extraction & Validation', () => {
  
  test('Step 1: Export full table to Excel', async ({ page }) => {
    const webTable = new WebTablePage(page);
    await webTable.goto();
    const tableData = await webTable.getTableData();
    ExcelHelper.writeExcel(fullTablePath, tableData);
  });

  test('Step 2: Export a specific column to Excel', async ({ page }) => {
    const webTable = new WebTablePage(page);
    await webTable.goto();

    const colData = await webTable.getColumnData(1);
    ExcelHelper.writeExcel(columnPath, colData.map(item => [item]));
  });

  test('Step 3: Export a specific row to Excel', async ({ page }) => {
    const webTable = new WebTablePage(page);
    await webTable.goto();

    const rowData = await webTable.getRowData(2);
    ExcelHelper.writeExcel(rowPath, [rowData]);
  });

  test('Step 4: Validate site data with Excel data', async ({ page }) => {
    const webTable = new WebTablePage(page);
    await webTable.goto();

    const siteData = await webTable.getTableData();
    const excelData = ExcelHelper.readExcel(fullTablePath);

    expect(siteData.length).toBe(excelData.length);

    for (let i = 0; i < siteData.length; i++) {
      expect(siteData[i].length).toBe(excelData[i].length);

      for (let j = 0; j < siteData[i].length; j++) {
        const siteValue = String(siteData[i][j]).trim().replace(/\s+/g, ' ');
        const excelValue = String(excelData[i][j]).trim().replace(/\s+/g, ' ');

        if (siteValue !== excelValue) {
          console.error(
            `Mismatch at [${i + 1},${j + 1}] → Site: "${siteValue}" | Excel: "${excelValue}"`
          );
        }

        expect(typeof excelValue, `Type mismatch at row ${i + 1}, col ${j + 1}`)
          .toBe(typeof siteValue);
        expect(excelValue, `Value mismatch at row ${i + 1}, col ${j + 1}`)
          .toBe(siteValue);
      }
    }
  });
});
