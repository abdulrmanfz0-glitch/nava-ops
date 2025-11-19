// NAVA OPS - Advanced Export Engine
// Comprehensive export utilities for PDF, Excel, CSV with rich formatting
// Now includes html2canvas integration for full report exports

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { logger } from './logger';

/**
 * Lazy load html2canvas for chart and HTML element capture
 * Install with: npm install html2canvas
 */
let html2canvas = null;
const loadHtml2Canvas = async () => {
  if (!html2canvas) {
    try {
      const module = await import('html2canvas');
      html2canvas = module.default;
      logger.info('html2canvas loaded successfully');
    } catch (error) {
      logger.warn('html2canvas not available. Install with: npm install html2canvas', { error: error.message });
      throw new Error('html2canvas not installed. Run: npm install html2canvas');
    }
  }
  return html2canvas;
};

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
   * Add header with logo and title (Restalyze branding)
   */
  addHeader(title, subtitle = '', restaurantInfo = {}) {
    // Background banner with gradient effect (using Restalyze blue)
    this.pdf.setFillColor(0, 136, 255);
    this.pdf.rect(0, 0, this.pageWidth, 50, 'F');

    // Restalyze branding
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(8);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('RESTALYZE', this.margins.left, 8);

    this.pdf.setFontSize(7);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('Premium Restaurant Analytics Platform', this.margins.left, 12);

    // Restaurant info
    if (restaurantInfo.name) {
      this.pdf.setFontSize(9);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text(restaurantInfo.name, this.margins.left, 20);

      if (restaurantInfo.branch) {
        this.pdf.setFontSize(8);
        this.pdf.setFont('helvetica', 'normal');
        this.pdf.text(`Branch: ${restaurantInfo.branch}`, this.margins.left, 25);
      }
    }

    // Title
    this.pdf.setFontSize(18);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(title, this.margins.left, 38);

    // Subtitle
    if (subtitle) {
      this.pdf.setFontSize(10);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.text(subtitle, this.margins.left, 44);
    }

    // Right side - Date and time
    this.pdf.setFontSize(8);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text(new Date().toLocaleDateString(), this.pageWidth - this.margins.right - 50, 8);
    this.pdf.text(new Date().toLocaleTimeString(), this.pageWidth - this.margins.right - 50, 12);

    this.currentY = 55;
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
   * Capture and add HTML element as image using html2canvas
   *
   * @param {HTMLElement} element - DOM element to capture
   * @param {string} title - Optional title for the chart
   * @param {Object} options - html2canvas options
   * @returns {Promise<void>}
   */
  async addChartFromElement(element, title = '', options = {}) {
    try {
      const html2canvasLib = await loadHtml2Canvas();

      // Default options for high-quality capture
      const captureOptions = {
        scale: 2, // Higher resolution
        useCORS: true, // Allow cross-origin images
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        ...options
      };

      // Capture element as canvas
      const canvas = await html2canvasLib(element, captureOptions);

      // Convert canvas to data URL
      const chartDataUrl = canvas.toDataURL('image/png', 1.0);

      // Calculate height to maintain aspect ratio
      const chartWidth = this.pageWidth - this.margins.left - this.margins.right;
      const aspectRatio = canvas.height / canvas.width;
      const chartHeight = chartWidth * aspectRatio;

      // Add to PDF
      this.addChart(chartDataUrl, title, chartHeight);

      logger.info('Chart captured and added to PDF', { title, width: chartWidth, height: chartHeight });
    } catch (error) {
      logger.error('Failed to capture and add chart from element', { error: error.message });
      // Add error placeholder
      this.checkPageBreak(20);
      this.pdf.setFontSize(10);
      this.pdf.setTextColor(239, 68, 68); // Red
      this.pdf.text('Failed to capture chart. Please try again.', this.margins.left, this.currentY);
      this.currentY += 15;
    }
  }

  /**
   * Add multiple charts from element selectors
   *
   * @param {Array<Object>} charts - Array of {selector, title} objects
   * @returns {Promise<void>}
   */
  async addMultipleCharts(charts) {
    for (const chart of charts) {
      const element = typeof chart.selector === 'string'
        ? document.querySelector(chart.selector)
        : chart.selector;

      if (element) {
        await this.addChartFromElement(element, chart.title || '', chart.options || {});
      } else {
        logger.warn('Chart element not found', { selector: chart.selector });
      }
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
   * Add footer with Restalyze branding
   */
  addFooter() {
    const pageCount = this.pdf.internal.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      this.pdf.setPage(i);
      this.pdf.setFontSize(7);
      this.pdf.setTextColor(150, 150, 150);

      // Page number center


      // Top separator line
      this.pdf.setDrawColor(200, 200, 200);
      this.pdf.line(this.margins.left, this.pageHeight - 15, this.pageWidth - this.margins.right, this.pageHeight - 15);

      this.pdf.setFontSize(8);
      this.pdf.setTextColor(120, 120, 120);
      this.pdf.setFont('helvetica', 'normal');

      // Left: Restalyze branding
      this.pdf.text(
        'Restalyze Professional Report',
        this.margins.left,
        this.pageHeight - 10
      );

      // Center: Page number
 
      this.pdf.text(
        `Page ${i} of ${pageCount}`,
        this.pageWidth / 2,
        this.pageHeight - 10,
        { align: 'center' }
      );

      // Left: Restalyze branding
      this.pdf.text(
        'Generated by Restalyze',
        this.margins.left,
        this.pageHeight - 10
      );


 
      // Right: Timestamp
      this.pdf.text(
        new Date().toLocaleString(),
        this.pageWidth - this.margins.right,
        this.pageHeight - 10,
        { align: 'right' }
      );

      // Bottom: Copyright
      this.pdf.setFontSize(6);
      this.pdf.text(
        '© Restalyze - Premium Restaurant Analytics Platform | All Rights Reserved',
        this.pageWidth / 2,
        this.pageHeight - 5,
        { align: 'center' }
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
export const exportReport = async (reportData, format, filename, restaurantInfo = {}) => {
  try {
    logger.info('Starting report export', { format, filename, restaurant: restaurantInfo.name });

    switch (format.toLowerCase()) {
      case 'pdf':
        return await exportAsPDF(reportData, filename, restaurantInfo);
      case 'excel':
      case 'xlsx':
        return await exportAsExcel(reportData, filename, restaurantInfo);
      case 'csv':
        return await exportAsCSV(reportData, filename, restaurantInfo);
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
const exportAsPDF = async (reportData, filename, restaurantInfo = {}) => {
  const pdf = new PDFExporter();

  pdf.addHeader(reportData.title, reportData.subtitle, restaurantInfo);

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
 * Export as Excel with Restalyze branding
 */
const exportAsExcel = async (reportData, filename, restaurantInfo = {}) => {
  const excel = new ExcelExporter();

  // Add summary sheet with metrics
  const metrics = {};
  if (reportData.metrics && Array.isArray(reportData.metrics)) {
    reportData.metrics.forEach(metric => {
      metrics[metric.label] = metric.value;
    });
  }

  // Add cover sheet with metadata
  if (restaurantInfo.name || reportData.title) {
    const metadata = [
      { key: 'Report', value: reportData.title },
      { key: 'Restaurant', value: restaurantInfo.name || 'N/A' },
      { key: 'Branch', value: restaurantInfo.branch || 'N/A' },
      { key: 'Generated', value: new Date().toLocaleString() },
      { key: 'Platform', value: 'Restalyze - Premium Restaurant Analytics' },
    ];
    excel.addSheet('Report Info', metadata, { headers: ['key', 'value'] });
  }

  // Add summary sheet
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
 * Export as CSV with Restalyze branding metadata
 */
const exportAsCSV = async (reportData, filename, restaurantInfo = {}) => {
  let data = [];

  if (reportData.sections && reportData.sections[0]?.table) {
    data = reportData.sections[0].table.data;
  } else if (reportData.data) {
    data = reportData.data;
  }

  // Create CSV with metadata header comments
  const csv = CSVExporter.toCSV(data);
  const metadata = `# Report: ${reportData.title}\n# Restaurant: ${restaurantInfo.name || 'N/A'}\n# Branch: ${restaurantInfo.branch || 'N/A'}\n# Generated: ${new Date().toLocaleString()}\n# Platform: Restalyze - Premium Restaurant Analytics\n# ---\n`;

  const blob = new Blob([metadata + csv], { type: 'text/csv;charset=utf-8;' });
  const { saveAs } = await import('file-saver');
  saveAs(blob, filename);
  logger.info('CSV exported successfully with metadata', { filename, restaurant: restaurantInfo.name });
};

/**
 * Export full report with charts using html2canvas
 *
 * @param {Object} options - Configuration options
 * @param {string} options.containerId - Container element ID (default: 'report-container')
 * @param {string} options.filename - Output filename
 * @param {string} options.title - Report title
 * @param {string} options.subtitle - Report subtitle
 * @param {Array<string>} options.chartSelectors - CSS selectors for chart elements
 * @param {Object} options.restaurantInfo - Restaurant information
 * @returns {Promise<void>}
 */
export const exportFullReportWithCharts = async (options = {}) => {
  try {
    const {
      containerId = 'report-container',
      filename = 'full-report.pdf',
      title = 'Full Report',
      subtitle = '',
      chartSelectors = [],
      restaurantInfo = {}
    } = options;

    logger.info('Starting full report export with charts', { filename, chartCount: chartSelectors.length });

    // Create PDF exporter
    const pdf = new PDFExporter();

    // Add header
    pdf.addHeader(title, subtitle, restaurantInfo);

    // Add charts from selectors
    if (chartSelectors.length > 0) {
      for (const selector of chartSelectors) {
        const element = document.querySelector(selector);
        if (element) {
          const chartTitle = element.getAttribute('data-chart-title') || '';
          await pdf.addChartFromElement(element, chartTitle);
        } else {
          logger.warn('Chart element not found', { selector });
        }
      }
    } else {
      // If no specific selectors, try to capture entire container
      const container = document.getElementById(containerId);
      if (container) {
        await pdf.addChartFromElement(container, '');
      }
    }

    // Save PDF
    pdf.save(filename);

    logger.info('Full report with charts exported successfully', { filename });
  } catch (error) {
    logger.error('Failed to export full report with charts', { error: error.message });
    throw error;
  }
};

/**
 * Capture element as image and download
 *
 * @param {HTMLElement|string} elementOrSelector - Element or CSS selector
 * @param {string} filename - Output filename
 * @param {Object} options - html2canvas options
 * @returns {Promise<void>}
 */
export const captureElementAsImage = async (elementOrSelector, filename = 'capture.png', options = {}) => {
  try {
    const html2canvasLib = await loadHtml2Canvas();

    // Get element
    const element = typeof elementOrSelector === 'string'
      ? document.querySelector(elementOrSelector)
      : elementOrSelector;

    if (!element) {
      throw new Error('Element not found');
    }

    // Capture options
    const captureOptions = {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      logging: false,
      ...options
    };

    // Capture element
    const canvas = await html2canvasLib(element, captureOptions);

    // Convert to blob and download
    canvas.toBlob((blob) => {
      saveAs(blob, filename);
      logger.info('Element captured and downloaded as image', { filename });
    }, 'image/png', 1.0);
  } catch (error) {
    logger.error('Failed to capture element as image', { error: error.message });
    throw error;
  }
};

/**
 * Export report section by section with page breaks
 *
 * @param {Array<Object>} sections - Array of section configurations
 * @param {string} filename - Output filename
 * @param {Object} reportInfo - Report metadata
 * @returns {Promise<void>}
 */
export const exportReportBySections = async (sections, filename = 'report.pdf', reportInfo = {}) => {
  try {
    logger.info('Starting section-by-section report export', { sectionCount: sections.length });

    const pdf = new PDFExporter();

    // Add header
    pdf.addHeader(
      reportInfo.title || 'Report',
      reportInfo.subtitle || '',
      reportInfo.restaurantInfo || {}
    );

    // Process each section
    for (const section of sections) {
      // Add section header
      if (section.sectionTitle) {
        pdf.addSection(section.sectionTitle);
      }

      // Add executive summary if present
      if (section.summary) {
        pdf.addExecutiveSummary(section.summary);
      }

      // Add metrics cards if present
      if (section.metrics) {
        pdf.addMetricsCards(section.metrics);
      }

      // Add table if present
      if (section.table) {
        pdf.addTable(section.table.headers, section.table.data, section.table.options);
      }

      // Add chart from element if present
      if (section.chartSelector) {
        const element = document.querySelector(section.chartSelector);
        if (element) {
          await pdf.addChartFromElement(element, section.chartTitle || '');
        }
      }

      // Add chart from data URL if present
      if (section.chartDataUrl) {
        pdf.addChart(section.chartDataUrl, section.chartTitle || '');
      }

      // Add insights if present
      if (section.insights) {
        pdf.addInsights(section.insights);
      }

      // Add custom text if present
      if (section.text) {
        pdf.checkPageBreak(20);
        pdf.pdf.setFontSize(10);
        pdf.pdf.setFont('helvetica', 'normal');
        pdf.pdf.setTextColor(60, 60, 60);
        const lines = pdf.pdf.splitTextToSize(section.text, pdf.pageWidth - pdf.margins.left - pdf.margins.right);
        lines.forEach(line => {
          pdf.checkPageBreak(10);
          pdf.pdf.text(line, pdf.margins.left, pdf.currentY);
          pdf.currentY += 6;
        });
        pdf.currentY += 5;
      }
    }

    // Save PDF
    pdf.save(filename);

    logger.info('Section-by-section report exported successfully', { filename, sections: sections.length });
  } catch (error) {
    logger.error('Failed to export report by sections', { error: error.message });
    throw error;
  }
};

export default {
  PDFExporter,
  ExcelExporter,
  CSVExporter,
  JSONExporter,
  exportReport,
  exportFullReportWithCharts,
  captureElementAsImage,
  exportReportBySections,
  loadHtml2Canvas
};
