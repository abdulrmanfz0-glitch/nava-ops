// src/utils/exportUtils.js
import { saveAs } from 'file-saver';
import logger from '../lib/logger';

// Number and currency formatting
export const formatters = {
  formatMoney: (amount, currency = 'SAR') => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount || 0);
  },

  formatNumber: (number) => {
    return new Intl.NumberFormat('ar-SA').format(number || 0);
  },

  formatPercent: (number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format((number || 0) / 100);
  },

  formatDate: (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  },

  formatDateTime: (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};

// CSV export utilities
export const csvUtils = {
  exportToCSV(data, filename = 'data', options = {}) {
    try {
      const {
        headers = null,
        delimiter = ',',
        includeHeaders = true
      } = options;

      // Determine headers
      const actualHeaders = headers || Object.keys(data[0] || {});

      // Create CSV content
      const csvContent = [
        // Headers (if required)
        includeHeaders ? actualHeaders.join(delimiter) : null,

        // Data rows
        ...data.map(row =>
          actualHeaders.map(header => {
            const value = row[header];
            // Handle special values
            if (value === null || value === undefined) return '';
            const stringValue = String(value).replace(/"/g, '""');
            return `"${stringValue}"`;
          }).join(delimiter)
        )
      ].filter(Boolean).join('\n');

      // Create and download file
      const blob = new Blob(['\uFEFF' + csvContent], {
        type: 'text/csv;charset=utf-8;'
      });

      saveAs(blob, `${filename}_${new Date().toISOString().split('T')[0]}.csv`);

      return { success: true, filename: `${filename}.csv` };
    } catch (error) {
      logger.error('CSV export error', { error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Export specific data with transformations
  exportDataToCSV(data, columns, filename = 'export') {
    const formattedData = data.map(item => {
      const row = {};
      columns.forEach(col => {
        let value = item[col.key];

        // Apply formatter if available
        if (col.formatter) {
          value = col.formatter(value, item);
        }

        // Use display name for column
        row[col.label || col.key] = value;
      });
      return row;
    });

    return this.exportToCSV(formattedData, filename);
  }
};

// Excel export utilities (using xlsx)
export const excelUtils = {
  async exportToExcel(data, filename = 'data', options = {}) {
    try {
      const {
        sheetName = 'Sheet1',
        headers = null,
        includeHeaders = true
      } = options;

      // Dynamically load xlsx library
      const XLSX = await import('xlsx');

      // Determine headers
      const actualHeaders = headers || Object.keys(data[0] || {});

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(data, {
        header: actualHeaders,
        skipHeader: !includeHeaders
      });

      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

      // Write file
      XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);

      return { success: true, filename: `${filename}.xlsx` };
    } catch (error) {
      console.error('Excel export error:', error);
      return { success: false, error: error.message };
    }
  },

  // Export multi-sheet data
  async exportMultiSheetExcel(sheets, filename = 'workbook') {
    try {
      const XLSX = await import('xlsx');
      const workbook = XLSX.utils.book_new();

      sheets.forEach(({ name, data, headers }) => {
        const worksheet = XLSX.utils.json_to_sheet(data, {
          header: headers || Object.keys(data[0] || {})
        });
        XLSX.utils.book_append_sheet(workbook, worksheet, name);
      });

      XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
      return { success: true, filename: `${filename}.xlsx` };
    } catch (error) {
      console.error('Multi-sheet Excel export error:', error);
      return { success: false, error: error.message };
    }
  }
};

// PDF export utilities (using jsPDF)
export const pdfUtils = {
  async exportToPDF(elementId, filename = 'document', options = {}) {
    try {
      const {
        title = 'NAVA Report',
        orientation = 'portrait',
        format = 'a4'
      } = options;

      // Dynamically load jsPDF library
      const { jsPDF } = await import('jspdf');

      // Create new PDF document
      const doc = new jsPDF({
        orientation,
        unit: 'mm',
        format
      });

      // Add title
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(18);
      doc.text(title, 105, 20, { align: 'center' });

      // Add export date
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(
        `Exported on: ${new Date().toLocaleDateString('en-US')}`,
        105,
        30,
        { align: 'center' }
      );

      // Attempt to capture element if it exists
      if (elementId && typeof window !== 'undefined') {
        const element = document.getElementById(elementId);
        if (element) {
          // Can add html2canvas library here for screenshots
          logger.debug('Element found for PDF export:', elementId);
        }
      }

      // Save file
      doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);

      return { success: true, filename: `${filename}.pdf` };
    } catch (error) {
      logger.error('PDF export error', { error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Create table report
  async exportTableToPDF(headers, data, filename = 'table') {
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();

      // Setup table
      const tableColumn = headers.map(h => h.label || h.key);
      const tableRows = data.map(item =>
        headers.map(header => {
          let value = item[header.key];
          if (header.formatter) {
            value = header.formatter(value, item);
          }
          return value || '';
        })
      );

      // Add table to PDF
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        styles: { font: 'Helvetica', fontSize: 10 },
        headStyles: { fillColor: [0, 136, 255] }, // NAVA blue color
        margin: { top: 20 }
      });

      doc.save(`${filename}.pdf`);
      return { success: true };
    } catch (error) {
      logger.error('Table PDF export error', { error: error.message });
      return { success: false, error: error.message };
    }
  }
};

// General helper utilities
export const generalUtils = {
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Load images
  loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  },

  // Download data as JSON file
  exportToJSON(data, filename = 'data') {
    try {
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
      });
      saveAs(blob, `${filename}.json`);
      return { success: true };
    } catch (error) {
      logger.error('JSON export error', { error: error.message });
      return { success: false, error: error.message };
    }
  }
};

// Main export
export const exportUtils = {
  ...formatters,
  ...csvUtils,
  ...excelUtils,
  ...pdfUtils,
  ...generalUtils,

  // Export to all formats
  exportMultipleFormats(data, baseFilename, options = {}) {
    const formats = options.formats || ['csv', 'pdf', 'json', 'excel'];
    const results = [];

    formats.forEach(format => {
      switch (format) {
        case 'csv':
          results.push(this.exportToCSV(data, baseFilename));
          break;
        case 'excel':
          results.push(this.exportToExcel(data, baseFilename));
          break;
        case 'pdf':
          results.push(this.exportToPDF(null, baseFilename));
          break;
        case 'json':
          results.push(this.exportToJSON(data, baseFilename));
          break;
      }
    });

    return results;
  }
};

// 🔥 Named exports for individual functions
export const formatMoney = formatters.formatMoney;
export const formatNumber = formatters.formatNumber;
export const formatPercent = formatters.formatPercent;
export const formatDate = formatters.formatDate;
export const formatDateTime = formatters.formatDateTime;

export const exportToCSV = csvUtils.exportToCSV;
export const exportToExcel = excelUtils.exportToExcel;
export const exportToPDF = pdfUtils.exportTableToPDF;
export const exportToJSON = generalUtils.exportToJSON;

// Default export
export default exportUtils;