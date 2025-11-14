// NAVA OPS - Advanced Export Engine
// Comprehensive export utilities for PDF, Excel, CSV with rich formatting

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { logger } from './logger';

/**
 * PDF Export with Advanced Formatting
 */
export class PDFExporter {
  constructor(options = {}) {
    this.pdf = new jsPDF({
      orientation: options.orientation || 'portrait',
      unit: 'mm',
      format: options.format || 'a4'
    });

    this.pageWidth = this.pdf.internal.pageSize.getWidth();
    this.pageHeight = this.pdf.internal.pageSize.getHeight();
    this.margins = { top: 20, right: 15, bottom: 20, left: 15 };
    this.currentY = this.margins.top;
    this.primaryColor = options.primaryColor || [0, 136, 255];
    this.secondaryColor = options.secondaryColor || [107, 114, 128];
  }

  /**
   * Add header with logo and title
   */
  addHeader(title, subtitle = '') {
    // Background banner
    this.pdf.setFillColor(...this.primaryColor);
    this.pdf.rect(0, 0, this.pageWidth, 40, 'F');

    // Title
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(24);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(title, this.margins.left, 20);

    // Subtitle
    if (subtitle) {
      this.pdf.setFontSize(12);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.text(subtitle, this.margins.left, 30);
    }

    // Company info
    this.pdf.setFontSize(10);
    this.pdf.text('NAVA OPS', this.pageWidth - this.margins.right - 30, 20);
    this.pdf.text(new Date().toLocaleDateString(), this.pageWidth - this.margins.right - 30, 27);

    this.currentY = 50;
    this.pdf.setTextColor(0, 0, 0);
  }

  /**
   * Add section header
   */
  addSection(title, color = null) {
    this.checkPageBreak(20);

    const sectionColor = color || this.primaryColor;
    this.pdf.setFillColor(...sectionColor);
    this.pdf.rect(this.margins.left, this.currentY, 5, 8, 'F');

    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(60, 60, 60);
    this.pdf.text(title, this.margins.left + 10, this.currentY + 6);

    this.currentY += 15;
  }

  /**
   * Add key metrics cards
   */
  addMetricsCards(metrics) {
    this.checkPageBreak(40);

    const cardWidth = (this.pageWidth - this.margins.left - this.margins.right - 15) / 4;
    const cardHeight = 30;
    let x = this.margins.left;

    metrics.forEach((metric, index) => {
      // Card background
      this.pdf.setFillColor(249, 250, 251);
      this.pdf.roundedRect(x, this.currentY, cardWidth, cardHeight, 3, 3, 'F');

      // Metric label
      this.pdf.setFontSize(9);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.setTextColor(107, 114, 128);
      this.pdf.text(metric.label, x + 5, this.currentY + 8);

      // Metric value
      this.pdf.setFontSize(16);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.setTextColor(31, 41, 55);
      this.pdf.text(String(metric.value), x + 5, this.currentY + 18);

      // Trend indicator
      if (metric.trend) {
        const trendColor = metric.trend.direction === 'up' ? [16, 185, 129] : [239, 68, 68];
        this.pdf.setFontSize(9);
        this.pdf.setTextColor(...trendColor);
        this.pdf.text(`${metric.trend.direction === 'up' ? '↑' : '↓'} ${metric.trend.value}`, x + 5, this.currentY + 25);
      }

      x += cardWidth + 5;
    });

    this.currentY += cardHeight + 10;
  }

  /**
   * Add data table with auto-formatting
   */
  addTable(headers, data, options = {}) {
    this.checkPageBreak(50);

    this.pdf.autoTable({
      startY: this.currentY,
      head: [headers],
      body: data,
      theme: options.theme || 'striped',
      headStyles: {
        fillColor: this.primaryColor,
        fontStyle: 'bold',
        fontSize: 10
      },
      bodyStyles: {
        fontSize: 9
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251]
      },
      margin: { left: this.margins.left, right: this.margins.right },
      ...options
    });

    this.currentY = this.pdf.lastAutoTable.finalY + 10;
  }

  /**
   * Add chart placeholder (for chart images)
   */
  addChart(chartDataUrl, title = '', height = 60) {
    this.checkPageBreak(height + 15);

    if (title) {
      this.pdf.setFontSize(12);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text(title, this.margins.left, this.currentY);
      this.currentY += 8;
    }

    try {
      const chartWidth = this.pageWidth - this.margins.left - this.margins.right;
      this.pdf.addImage(chartDataUrl, 'PNG', this.margins.left, this.currentY, chartWidth, height);
      this.currentY += height + 10;
    } catch (error) {
      logger.error('Failed to add chart to PDF', error);
    }
  }

  /**
   * Add insights section
   */
  addInsights(insights) {
    this.addSection('AI-Generated Insights', [16, 185, 129]);

    insights.forEach((insight, index) => {
      this.checkPageBreak(25);

      // Insight box
      const boxColor = this.getInsightColor(insight.severity);
      this.pdf.setFillColor(...boxColor);
      this.pdf.rect(this.margins.left, this.currentY, 5, 8, 'F');

      // Title
      this.pdf.setFontSize(11);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.setTextColor(31, 41, 55);
      this.pdf.text(insight.title, this.margins.left + 10, this.currentY + 5);

      // Description
      this.pdf.setFontSize(9);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.setTextColor(107, 114, 128);
      const lines = this.pdf.splitTextToSize(insight.description, this.pageWidth - this.margins.left - this.margins.right - 15);
      this.pdf.text(lines, this.margins.left + 10, this.currentY + 12);

      this.currentY += 12 + (lines.length * 4) + 8;
    });
  }

  /**
   * Add executive summary
   */
  addExecutiveSummary(summary) {
    this.addSection('Executive Summary');

    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(60, 60, 60);

    const summaryLines = this.pdf.splitTextToSize(summary, this.pageWidth - this.margins.left - this.margins.right);
    summaryLines.forEach(line => {
      this.checkPageBreak(10);
      this.pdf.text(line, this.margins.left, this.currentY);
      this.currentY += 6;
    });

    this.currentY += 5;
  }

  /**
   * Add footer
   */
  addFooter() {
    const pageCount = this.pdf.internal.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      this.pdf.setPage(i);
      this.pdf.setFontSize(8);
      this.pdf.setTextColor(150, 150, 150);
      this.pdf.text(
        `Page ${i} of ${pageCount}`,
        this.pageWidth / 2,
        this.pageHeight - 10,
        { align: 'center' }
      );
      this.pdf.text(
        'Generated by NAVA OPS',
        this.margins.left,
        this.pageHeight - 10
      );
      this.pdf.text(
        new Date().toLocaleString(),
        this.pageWidth - this.margins.right,
        this.pageHeight - 10,
        { align: 'right' }
      );
    }
  }

  /**
   * Check if page break is needed
   */
  checkPageBreak(requiredSpace) {
    if (this.currentY + requiredSpace > this.pageHeight - this.margins.bottom - 15) {
      this.pdf.addPage();
      this.currentY = this.margins.top;
    }
  }

  /**
   * Get color for insight severity
   */
  getInsightColor(severity) {
    const colors = {
      high: [239, 68, 68],
      medium: [251, 191, 36],
      low: [59, 130, 246],
      info: [16, 185, 129]
    };
    return colors[severity] || colors.info;
  }

  /**
   * Save PDF
   */
  save(filename) {
    this.addFooter();
    this.pdf.save(filename);
    logger.info('PDF exported successfully', { filename });
  }

  /**
   * Get PDF as blob
   */
  getBlob() {
    this.addFooter();
    return this.pdf.output('blob');
  }
}

/**
 * Excel Export Utility with Professional Formatting
 */
export class ExcelExporter {
  constructor(options = {}) {
    this.workbook = new ExcelJS.Workbook();
    this.workbook.creator = 'NAVA OPS';
    this.workbook.created = new Date();
    this.workbook.modified = new Date();
    this.sheets = [];
    this.primaryColor = options.primaryColor || '0088FF';
    this.accentColor = options.accentColor || '10B981';
  }

  /**
   * Add worksheet with data and styling
   */
  addSheet(name, data, options = {}) {
    const worksheet = this.workbook.addWorksheet(name);

    if (!data || data.length === 0) return;

    const headers = options.headers || Object.keys(data[0] || {});

    // Add header row
    const headerRow = worksheet.addRow(headers);

    // Style header row
    headerRow.font = {
      bold: true,
      color: { argb: 'FFFFFFFF' },
      size: 12
    };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: this.primaryColor }
    };
    headerRow.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    headerRow.height = 25;

    // Add data rows
    data.forEach((row, rowIndex) => {
      const dataRow = worksheet.addRow(headers.map(header => row[header]));

      // Alternate row colors
      if (rowIndex % 2 === 0) {
        dataRow.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF9FAFB' }
        };
      }

      // Set font and alignment
      dataRow.font = { size: 10 };
      dataRow.alignment = { vertical: 'middle', wrapText: true };

      // Style numeric columns
      dataRow.eachCell((cell, colNumber) => {
        const value = cell.value;
        if (typeof value === 'number') {
          cell.numFmt = options.numFmt || '#,##0.00';
          cell.alignment = { horizontal: 'right', vertical: 'middle' };
        } else if (typeof value === 'string' && value.startsWith('$')) {
          cell.numFmt = '$#,##0.00';
          cell.alignment = { horizontal: 'right', vertical: 'middle' };
        }
      });
    });

    // Auto-fit column widths
    worksheet.columns.forEach((column, index) => {
      let maxLength = headers[index]?.length || 10;
      data.forEach(row => {
        const cellValue = String(row[headers[index]] || '');
        maxLength = Math.max(maxLength, cellValue.length);
      });
      column.width = Math.min(maxLength + 2, 50);
    });

    // Freeze header row
    worksheet.views = [{ state: 'frozen', ySplit: 1 }];

    this.sheets.push({ name, worksheet });
  }

  /**
   * Add summary sheet with metrics
   */
  addSummarySheet(title, metrics = {}) {
    const worksheet = this.workbook.addWorksheet('Summary');

    // Title
    const titleRow = worksheet.addRow([title]);
    titleRow.font = { bold: true, size: 16, color: { argb: 'FFFFFFFF' } };
    titleRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: this.primaryColor }
    };
    titleRow.height = 30;
    worksheet.mergeCells('A1:D1');

    // Add generation date
    const dateRow = worksheet.addRow(['Generated:', new Date().toLocaleDateString()]);
    dateRow.font = { size: 10, italic: true };

    // Empty row for spacing
    worksheet.addRow([]);

    // Add metrics
    if (Object.keys(metrics).length > 0) {
      const metricsHeader = worksheet.addRow(['Metric', 'Value']);
      metricsHeader.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
      metricsHeader.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: this.accentColor }
      };

      Object.entries(metrics).forEach(([key, value]) => {
        const row = worksheet.addRow([key, value]);
        row.font = { size: 10 };
        if (typeof value === 'number') {
          row.getCell(2).numFmt = '#,##0.00';
        }
      });
    }

    // Auto-fit columns
    worksheet.columns = [
      { width: 25 },
      { width: 20 }
    ];
  }

  /**
   * Save as Excel XLSX file
   */
  async saveAsExcel(filename) {
    try {
      const buffer = await this.workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      saveAs(blob, filename);
      logger.info('Excel file exported successfully', { filename });
    } catch (error) {
      logger.error('Failed to export Excel file', error);
      throw error;
    }
  }

  /**
   * Convert to CSV (fallback)
   */
  toCSV(sheetIndex = 0) {
    const worksheet = this.workbook.worksheets[sheetIndex];
    if (!worksheet) return '';

    let csv = '';
    worksheet.eachRow((row) => {
      const values = row.values.slice(1).map(value => {
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value || '';
      });
      csv += values.join(',') + '\n';
    });

    return csv;
  }

  /**
   * Save as CSV (fallback)
   */
  saveAsCSV(filename, sheetIndex = 0) {
    const csv = this.toCSV(sheetIndex);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, filename);
    logger.info('CSV exported successfully', { filename });
  }
}

/**
 * CSV Export Utility
 */
export class CSVExporter {
  /**
   * Convert data to CSV
   */
  static toCSV(data, options = {}) {
    if (!data || data.length === 0) return '';

    const headers = options.headers || Object.keys(data[0]);
    const delimiter = options.delimiter || ',';
    const includeHeaders = options.includeHeaders !== false;

    let csv = '';

    if (includeHeaders) {
      csv = headers.join(delimiter) + '\n';
    }

    data.forEach(row => {
      const values = headers.map(header => {
        let value = row[header];

        // Handle different data types
        if (value === null || value === undefined) {
          value = '';
        } else if (typeof value === 'object') {
          value = JSON.stringify(value);
        } else {
          value = String(value);
        }

        // Escape values
        if (value.includes(delimiter) || value.includes('"') || value.includes('\n')) {
          value = `"${value.replace(/"/g, '""')}"`;
        }

        return value;
      });

      csv += values.join(delimiter) + '\n';
    });

    return csv;
  }

  /**
   * Download CSV
   */
  static download(data, filename, options = {}) {
    const csv = this.toCSV(data, options);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, filename);
    logger.info('CSV downloaded successfully', { filename, rows: data.length });
  }
}

/**
 * JSON Export Utility
 */
export class JSONExporter {
  /**
   * Download JSON
   */
  static download(data, filename, pretty = true) {
    const json = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    saveAs(blob, filename);
    logger.info('JSON downloaded successfully', { filename });
  }
}

/**
 * Print Report
 */
export const printReport = (reportData) => {
  const printWindow = window.open('', '', 'width=900,height=800');

  // Build HTML content
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${reportData.title || 'Report'}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background: white;
        }
        .page-break {
          page-break-after: always;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #0088FF 0%, #0066CC 100%);
          color: white;
          padding: 40px 20px;
          margin-bottom: 30px;
          text-align: center;
          page-break-after: avoid;
        }
        .header h1 {
          font-size: 28px;
          margin-bottom: 10px;
        }
        .header p {
          font-size: 14px;
          opacity: 0.9;
        }
        .meta {
          background: #f5f5f5;
          padding: 15px 20px;
          font-size: 12px;
          color: #666;
          margin-bottom: 30px;
          page-break-after: avoid;
          border-bottom: 1px solid #ddd;
        }
        .section {
          margin-bottom: 40px;
          page-break-inside: avoid;
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          color: #0088FF;
          padding: 10px 0;
          border-bottom: 2px solid #0088FF;
          margin-bottom: 20px;
          page-break-after: avoid;
        }
        .metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
          page-break-inside: avoid;
        }
        .metric-card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
        }
        .metric-label {
          font-size: 12px;
          color: #6b7280;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .metric-value {
          font-size: 24px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 8px;
        }
        .metric-trend {
          font-size: 11px;
          color: #10b981;
        }
        .metric-trend.down {
          color: #ef4444;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
          page-break-inside: avoid;
        }
        table thead {
          background: #0088FF;
          color: white;
        }
        table th {
          padding: 12px;
          text-align: left;
          font-weight: 600;
          border: 1px solid #0088FF;
        }
        table td {
          padding: 12px;
          border: 1px solid #e5e7eb;
        }
        table tbody tr:nth-child(even) {
          background: #f9fafb;
        }
        table tbody tr:hover {
          background: #f3f4f6;
        }
        .insights {
          background: #eff6ff;
          border-left: 4px solid #0088FF;
          padding: 15px;
          margin-bottom: 20px;
          border-radius: 4px;
          page-break-inside: avoid;
        }
        .insights-title {
          font-weight: bold;
          color: #1e40af;
          margin-bottom: 8px;
        }
        .insights-text {
          font-size: 13px;
          color: #1f2937;
          line-height: 1.5;
        }
        .footer {
          background: #f5f5f5;
          padding: 20px;
          text-align: center;
          font-size: 11px;
          color: #999;
          margin-top: 50px;
          border-top: 1px solid #ddd;
          page-break-before: avoid;
        }
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .page-break {
            padding: 0;
          }
          a {
            text-decoration: none;
          }
        }
      </style>
    </head>
    <body>
  `;

  // Add header
  html += `
    <div class="header">
      <h1>${reportData.title || 'Report'}</h1>
      ${reportData.subtitle ? `<p>${reportData.subtitle}</p>` : ''}
    </div>
    <div class="meta">
      <strong>Generated:</strong> ${new Date().toLocaleString()} |
      <strong>System:</strong> NAVA OPS
    </div>
  `;

  // Add executive summary
  if (reportData.executiveSummary) {
    html += `
      <div class="section">
        <div class="section-title">Executive Summary</div>
        <p style="line-height: 1.8; color: #555;">${reportData.executiveSummary}</p>
      </div>
    `;
  }

  // Add metrics
  if (reportData.metrics && Array.isArray(reportData.metrics) && reportData.metrics.length > 0) {
    html += '<div class="section"><div class="section-title">Key Metrics</div><div class="metrics">';
    reportData.metrics.forEach(metric => {
      const trendClass = metric.trend?.direction === 'down' ? 'down' : '';
      const trendHtml = metric.trend ?
        `<div class="metric-trend ${trendClass}">${metric.trend.direction === 'up' ? '↑' : '↓'} ${metric.trend.value}</div>` : '';
      html += `
        <div class="metric-card">
          <div class="metric-label">${metric.label}</div>
          <div class="metric-value">${metric.value}</div>
          ${trendHtml}
        </div>
      `;
    });
    html += '</div></div>';
  }

  // Add sections with tables
  if (reportData.sections && Array.isArray(reportData.sections)) {
    reportData.sections.forEach(section => {
      html += `<div class="section"><div class="section-title">${section.title}</div>`;

      if (section.table && section.table.data && section.table.data.length > 0) {
        html += '<table><thead><tr>';
        section.table.headers.forEach(header => {
          html += `<th>${header}</th>`;
        });
        html += '</tr></thead><tbody>';

        section.table.data.forEach(row => {
          html += '<tr>';
          section.table.headers.forEach(header => {
            html += `<td>${row[header] || ''}</td>`;
          });
          html += '</tr>';
        });

        html += '</tbody></table>';
      }

      html += '</div>';
    });
  }

  // Add insights
  if (reportData.insights && Array.isArray(reportData.insights)) {
    html += '<div class="section"><div class="section-title">AI-Generated Insights</div>';
    reportData.insights.forEach(insight => {
      html += `
        <div class="insights">
          <div class="insights-title">${insight.title}</div>
          <div class="insights-text">${insight.description}</div>
        </div>
      `;
    });
    html += '</div>';
  }

  // Add footer
  html += `
    <div class="footer">
      <p>This report was generated by NAVA OPS on ${new Date().toLocaleDateString()}. For internal use only.</p>
    </div>
  `;

  html += '</body></html>';

  // Write to print window
  printWindow.document.write(html);
  printWindow.document.close();

  // Trigger print dialog
  setTimeout(() => {
    printWindow.print();
    // Close window after printing
    setTimeout(() => {
      printWindow.close();
    }, 100);
  }, 250);

  logger.info('Report sent to printer');
};

/**
 * Main Export Function - Auto-detects format
 */
export const exportReport = async (reportData, format, filename) => {
  try {
    logger.info('Starting report export', { format, filename });

    switch (format.toLowerCase()) {
      case 'pdf':
        return await exportAsPDF(reportData, filename);
      case 'excel':
      case 'xlsx':
        return await exportAsExcel(reportData, filename);
      case 'csv':
        return await exportAsCSV(reportData, filename);
      case 'json':
        return JSONExporter.download(reportData, filename);
      case 'print':
        return printReport(reportData);
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  } catch (error) {
    logger.error('Export failed', { format, filename, error: error.message });
    throw error;
  }
};

/**
 * Export as PDF with full report formatting
 */
const exportAsPDF = async (reportData, filename) => {
  const pdf = new PDFExporter();

  pdf.addHeader(reportData.title, reportData.subtitle);

  if (reportData.executiveSummary) {
    pdf.addExecutiveSummary(reportData.executiveSummary);
  }

  if (reportData.metrics) {
    pdf.addMetricsCards(reportData.metrics);
  }

  if (reportData.sections) {
    reportData.sections.forEach(section => {
      pdf.addSection(section.title);

      if (section.table) {
        pdf.addTable(section.table.headers, section.table.data);
      }

      if (section.chart) {
        pdf.addChart(section.chart.dataUrl, section.chart.title);
      }
    });
  }

  if (reportData.insights) {
    pdf.addInsights(reportData.insights);
  }

  pdf.save(filename);
};

/**
 * Export as Excel
 */
const exportAsExcel = async (reportData, filename) => {
  const excel = new ExcelExporter();

  // Add summary sheet with metrics
  const metrics = {};
  if (reportData.metrics && Array.isArray(reportData.metrics)) {
    reportData.metrics.forEach(metric => {
      metrics[metric.label] = metric.value;
    });
  }
  excel.addSummarySheet(reportData.title || 'Report Summary', metrics);

  // Add data sheets
  if (reportData.sections && Array.isArray(reportData.sections)) {
    reportData.sections.forEach(section => {
      if (section.table && section.table.data) {
        excel.addSheet(section.title, section.table.data, {
          headers: section.table.headers
        });
      }
    });
  }

  // If no sections, add metrics as a sheet
  if (!reportData.sections || reportData.sections.length === 0) {
    if (reportData.metrics && Array.isArray(reportData.metrics)) {
      excel.addSheet('Metrics', reportData.metrics);
    }
  }

  await excel.saveAsExcel(filename);
};

/**
 * Export as CSV
 */
const exportAsCSV = async (reportData, filename) => {
  let data = [];

  if (reportData.sections && reportData.sections[0]?.table) {
    data = reportData.sections[0].table.data;
  } else if (reportData.data) {
    data = reportData.data;
  }

  CSVExporter.download(data, filename);
};

export default {
  PDFExporter,
  ExcelExporter,
  CSVExporter,
  JSONExporter,
  exportReport
};
