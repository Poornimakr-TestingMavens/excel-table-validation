import { test, expect } from '@playwright/test';
import { WebTablePage } from '../pages/webTable';
import { ExcelHelper } from '../utils/excelHelper';

const excelPath = 'data/webtable.xlsx';

test.describe('Web Table Data Extraction & Validation', () => {
  test('Step 1: Export full table to Excel', async ({ page }) => {
    const webTable = new WebTablePage(page);
    await webTable.goto();
    const tableData = await webTable.getTableData();
    ExcelHelper.writeExcel(excelPath, tableData);
  });

  test('Step 2: Export a specific column to Excel', async ({ page }) => {
    const webTable = new WebTablePage(page);
    await webTable.goto();

    const colData = await webTable.getColumnData(1);
    ExcelHelper.writeExcel('data/column.xlsx', colData.map(item => [item]));
  });

  test('Step 3: Export a specific row to Excel', async ({ page }) => {
    const webTable = new WebTablePage(page);
    await webTable.goto();

    const rowData = await webTable.getRowData(2);
    ExcelHelper.writeExcel('data/row.xlsx', [rowData]);
  });

  test('Step 4: Validate site data with Excel data (type + value)', async ({ page }) => {
    const webTable = new WebTablePage(page);
    await webTable.goto();

    const siteData = await webTable.getTableData();
    const excelData = ExcelHelper.readExcel(excelPath);

    expect(siteData.length).toBe(excelData.length);

    // Compare row by row, cell by cell
    for (let i = 0; i < siteData.length; i++) {
      expect(siteData[i].length).toBe(excelData[i].length);

      for (let j = 0; j < siteData[i].length; j++) {
        // Normalize values: trim + collapse multiple spaces/newlines
        const siteValue = String(siteData[i][j]).trim().replace(/\s+/g, ' ');
        const excelValue = String(excelData[i][j]).trim().replace(/\s+/g, ' ');

        // Debug log if mismatch occurs
        if (siteValue !== excelValue) {
          console.error(
            `Mismatch at [${i + 1},${j + 1}] → Site: "${siteValue}" | Excel: "${excelValue}"`
          );
        }

        // Check type
        expect(typeof excelValue, `Type mismatch at row ${i + 1}, col ${j + 1}`)
          .toBe(typeof siteValue);

        // Check value
        expect(excelValue, `Value mismatch at row ${i + 1}, col ${j + 1}`)
          .toBe(siteValue);
      }
    }
  });
});
