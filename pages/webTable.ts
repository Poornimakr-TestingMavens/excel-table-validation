import { Page } from '@playwright/test';

// Page Object Model (POM) class for interacting with the Web Table page
export class WebTablePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Navigate to the target web table page
  async goto() {
    await this.page.goto('https://cosmocode.io/automation-practice-webtable/');
  }

  /**
   * Extract the entire table as a 2D array
   * - Each row is an array of cell values
   * - Returns: string[][]
   */
  async getTableData(): Promise<string[][]> {
    const rows = this.page.locator('#countries tbody tr'); // all rows inside table body
    const rowCount = await rows.count();
    const tableData: string[][] = [];

    for (let i = 0; i < rowCount; i++) {
      const cells = rows.nth(i).locator('td'); // all cells in current row
      const cellCount = await cells.count();
      const rowData: string[] = [];

      for (let j = 0; j < cellCount; j++) {
        // Extract text content of each cell
        rowData.push(await cells.nth(j).innerText());
      }

      // Push the full row into tableData
      tableData.push(rowData);
    }

    return tableData;
  }

  /**
   * Extract a specific column by index
   * @param columnIndex - 1-based index of column (1 = first column)
   * - Returns: string[] (all values from that column)
   */
  async getColumnData(columnIndex: number): Promise<string[]> {
    const column = this.page.locator(
      `#countries tbody tr td:nth-child(${columnIndex})`
    );
    const count = await column.count();
    const colData: string[] = [];

    for (let i = 0; i < count; i++) {
      colData.push(await column.nth(i).innerText());
    }

    return colData;
  }

  /**
   * Extract a specific row by index
   * @param rowIndex - 1-based index of row (1 = first row)
   * - Returns: string[] (all cell values from that row)
   */
  async getRowData(rowIndex: number): Promise<string[]> {
    const row = this.page.locator(
      `#countries tbody tr:nth-child(${rowIndex}) td`
    );
    const count = await row.count();
    const rowData: string[] = [];

    for (let i = 0; i < count; i++) {
      rowData.push(await row.nth(i).innerText());
    }

    return rowData;
  }
}
