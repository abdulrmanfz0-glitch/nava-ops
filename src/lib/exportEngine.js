// NAVA OPS - Advanced Export Engine
// Comprehensive export utilities for PDF, Excel, CSV with rich formatting

import jsPDF from 'jspdf';
import 'jspdf-autotable';
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

  addHeader(title, subtitle = '', reportId = '', confidence = 'High') {
    // Premium gradient background
    this.pdf.setFillColor(...this.primaryColor);
    this.pdf.rect(0, 0, this.pageWidth, 50, 'F');
 

    // Restalyze branding box
    this.pdf.setFillColor(255, 255, 255);
    this.pdf.rect(this.margins.left, 8, 35, 12, 'F');
    this.pdf.setFontSize(14);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(0, 136, 255);
    this.pdf.text('RESTALYZE', this.margins.left + 3, 15);

    // Professional Analytics Platform label
    this.pdf.setFontSize(7);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(100, 116, 139);
    this.pdf.text('Professional Analytics Platform', this.margins.left + 3, 18);

    // Report metadata (right side)
    this.pdf.setFontSize(9);
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('Report ID: ' + reportId, this.pageWidth - this.margins.right - 50, 15);
    this.pdf.text('Confidence: ' + confidence, this.pageWidth - this.margins.right - 50, 20);
    this.pdf.text('Generated: ' + new Date().toLocaleDateString(), this.pageWidth - this.margins.right - 50, 25);

    // Title and subtitle
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(20);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(title, this.margins.left, 35);

    this.pdf.text(title, this.margins.left, 38);
 

    if (subtitle) {
      this.pdf.setFontSize(10);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.text(subtitle, this.margins.left, 42);
    }

    // Right side - Date and Report ID
    this.pdf.setFontSize(8);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text(new Date().toLocaleDateString(), this.pageWidth - this.margins.right - 50, 8);
    this.pdf.text(new Date().toLocaleTimeString(), this.pageWidth - this.margins.right - 50, 12);

    this.currentY = 60;

      this.pdf.setFontSize(11);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.text(subtitle, this.margins.left, 44);
    }

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
 * Excel Export Utility
 */
export class ExcelExporter {
  constructor() {
    this.workbook = {
      sheets: [],
      creator: 'NAVA OPS',
      created: new Date()
    };
  }

  /**
   * Add worksheet with data
   */
  addSheet(name, data, options = {}) {
    const sheet = {
      name,
      data,
      headers: options.headers || Object.keys(data[0] || {}),
      styling: options.styling || {}
    };
    this.workbook.sheets.push(sheet);
  }

  /**
   * Convert to CSV (simplified Excel export)
   */
  toCSV(sheetIndex = 0) {
    const sheet = this.workbook.sheets[sheetIndex];
    if (!sheet) return '';

    let csv = sheet.headers.join(',') + '\n';

    sheet.data.forEach(row => {
      const values = sheet.headers.map(header => {
        const value = row[header];
        // Escape values containing commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
      csv += values.join(',') + '\n';
    });

    return csv;
  }

  /**
   * Save as CSV
   */
  saveAsCSV(filename, sheetIndex = 0) {
    const csv = this.toCSV(sheetIndex);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, filename);
    logger.info('CSV exported successfully', { filename });
  }

  /**
   * Save as Excel (using simple XML format)
   */
  saveAsExcel(filename) {
    // For now, we'll export the first sheet as CSV
    // In a real implementation, you'd use a library like xlsx
    this.saveAsCSV(filename.replace('.xlsx', '.csv'));
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
  if (reportData.metrics) {
    excel.addSheet('Summary', reportData.metrics);
  }

  // Add data sheets
  if (reportData.sections) {
    reportData.sections.forEach(section => {
      if (section.table) {
        excel.addSheet(section.title, section.table.data, {
          headers: section.table.headers
        });
      }
    });
  }

  excel.saveAsExcel(filename);
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

export default {
  PDFExporter,
  ExcelExporter,
  CSVExporter,
  JSONExporter,
  exportReport
};
