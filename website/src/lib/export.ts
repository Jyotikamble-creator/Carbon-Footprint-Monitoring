// Data export utilities for CSV, Excel, and PDF formats

export interface ExportColumn {
  key: string;
  label: string;
  format?: (value: any) => string;
}

export interface ExportOptions {
  filename: string;
  columns: ExportColumn[];
  data: any[];
}

// CSV Export
export function exportToCSV(options: ExportOptions): void {
  const { filename, columns, data } = options;

  // Create CSV header
  const header = columns.map(col => `"${col.label}"`).join(',');

  // Create CSV rows
  const rows = data.map(item =>
    columns.map(col => {
      const value = col.format ? col.format(item[col.key]) : item[col.key];
      // Escape quotes and wrap in quotes if contains comma, quote, or newline
      const stringValue = String(value || '');
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(',')
  );

  // Combine header and rows
  const csvContent = [header, ...rows].join('\n');

  // Download file
  downloadFile(csvContent, `${filename}.csv`, 'text/csv');
}

// Excel Export (using a simple approach with HTML table that Excel can open)
export function exportToExcel(options: ExportOptions): void {
  const { filename, columns, data } = options;

  // Create HTML table
  const tableHeader = columns.map(col => `<th>${col.label}</th>`).join('');
  const tableRows = data.map(item =>
    `<tr>${
      columns.map(col => {
        const value = col.format ? col.format(item[col.key]) : item[col.key];
        return `<td>${String(value || '')}</td>`;
      }).join('')
    }</tr>`
  ).join('');

  const htmlContent = `
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          table { border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
        </style>
      </head>
      <body>
        <table>
          <thead><tr>${tableHeader}</tr></thead>
          <tbody>${tableRows}</tbody>
        </table>
      </body>
    </html>
  `;

  // Download as HTML file (Excel can open HTML files)
  downloadFile(htmlContent, `${filename}.html`, 'application/vnd.ms-excel');
}

// PDF Export (basic implementation using browser print)
export async function exportToPDF(options: ExportOptions): Promise<void> {
  const { filename, columns, data } = options;

  // Create a temporary HTML element for printing
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to export PDF');
    return;
  }

  // Create HTML table
  const tableHeader = columns.map(col => `<th>${col.label}</th>`).join('');
  const tableRows = data.map(item =>
    `<tr>${
      columns.map(col => {
        const value = col.format ? col.format(item[col.key]) : item[col.key];
        return `<td>${String(value || '')}</td>`;
      }).join('')
    }</tr>`
  ).join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${filename}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { border-collapse: collapse; width: 100%; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
          h1 { color: #333; }
          @media print {
            body { margin: 0; }
            table { font-size: 12px; }
          }
        </style>
      </head>
      <body>
        <h1>${filename}</h1>
        <table>
          <thead><tr>${tableHeader}</tr></thead>
          <tbody>${tableRows}</tbody>
        </table>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();

  // Wait for content to load, then print
  printWindow.onload = () => {
    printWindow.print();
    // Close window after printing (with a delay to allow print dialog)
    setTimeout(() => {
      printWindow.close();
    }, 1000);
  };
}

// JSON Export
export function exportToJSON(options: ExportOptions): void {
  const { filename, data } = options;
  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, `${filename}.json`, 'application/json');
}

// Utility function to download files
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up
  URL.revokeObjectURL(url);
}

// Export formats available
export const EXPORT_FORMATS = {
  csv: { label: 'CSV', function: exportToCSV },
  excel: { label: 'Excel (HTML)', function: exportToExcel },
  pdf: { label: 'PDF', function: exportToPDF },
  json: { label: 'JSON', function: exportToJSON }
} as const;

export type ExportFormat = keyof typeof EXPORT_FORMATS;