// NAVA OPS - Dashboard Export Utilities
// Export dashboard to PDF and PNG

import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Export dashboard to PDF
 * @param {Object} options - Export options
 * @param {string} options.title - Dashboard title
 * @param {Array} options.widgets - Widget data to include
 * @param {Object} options.dateRange - Date range info
 * @param {string} options.userName - User name
 */
export async function exportDashboardToPDF(options) {
  const {
    title = 'Dashboard Report',
    widgets = [],
    dateRange = {},
    userName = 'User'
  } = options;

  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPos = 20;

  // Header
  pdf.setFontSize(24);
  pdf.setTextColor(30, 41, 59); // gray-800
  pdf.text(title, pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;

  // Date and user info
  pdf.setFontSize(10);
  pdf.setTextColor(100, 116, 139); // gray-500
  const dateText = `${dateRange.startDate || ''} - ${dateRange.endDate || ''} | Generated: ${new Date().toLocaleString()}`;
  pdf.text(dateText, pageWidth / 2, yPos, { align: 'center' });
  yPos += 5;
  pdf.text(`Prepared for: ${userName}`, pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;

  // Line separator
  pdf.setDrawColor(226, 232, 240); // gray-200
  pdf.line(20, yPos, pageWidth - 20, yPos);
  yPos += 10;

  // Process each widget
  for (let i = 0; i < widgets.length; i++) {
    const widget = widgets[i];

    // Check if we need a new page
    if (yPos > pageHeight - 40) {
      pdf.addPage();
      yPos = 20;
    }

    // Widget title
    pdf.setFontSize(14);
    pdf.setTextColor(30, 41, 59);
    pdf.text(widget.title || `Widget ${i + 1}`, 20, yPos);
    yPos += 8;

    // Widget data
    if (widget.type === 'metric') {
      // Metric widget
      pdf.setFontSize(12);
      pdf.setTextColor(71, 85, 105);
      pdf.text(`Value: ${widget.value || 'N/A'}`, 25, yPos);
      yPos += 6;

      if (widget.trend) {
        const trendColor = widget.trend > 0 ? [16, 185, 129] : [239, 68, 68];
        pdf.setTextColor(...trendColor);
        pdf.text(`Trend: ${widget.trend > 0 ? '↑' : '↓'} ${Math.abs(widget.trend).toFixed(1)}%`, 25, yPos);
        pdf.setTextColor(71, 85, 105);
        yPos += 6;
      }
    } else if (widget.type === 'chart' && widget.data) {
      // Chart widget - create table
      const tableData = widget.data.map(item => [
        item.label || item.date || '',
        item.value?.toLocaleString() || '0'
      ]);

      pdf.autoTable({
        startY: yPos,
        head: [['Period', 'Value']],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: [59, 130, 246], // blue-500
          textColor: [255, 255, 255],
          fontSize: 10
        },
        bodyStyles: {
          fontSize: 9,
          textColor: [71, 85, 105]
        },
        margin: { left: 25, right: 20 },
        tableWidth: pageWidth - 45
      });

      yPos = pdf.lastAutoTable.finalY + 5;
    } else if (widget.type === 'insights' && widget.insights) {
      // Insights widget
      pdf.setFontSize(10);
      widget.insights.slice(0, 3).forEach((insight, idx) => {
        if (yPos > pageHeight - 30) {
          pdf.addPage();
          yPos = 20;
        }

        pdf.setTextColor(71, 85, 105);
        pdf.text(`${idx + 1}. ${insight.title}`, 25, yPos);
        yPos += 5;

        pdf.setFontSize(9);
        pdf.setTextColor(100, 116, 139);
        const lines = pdf.splitTextToSize(insight.description, pageWidth - 55);
        pdf.text(lines, 30, yPos);
        yPos += lines.length * 4 + 3;

        pdf.setFontSize(10);
      });
    } else if (widget.type === 'activity' && widget.activities) {
      // Activity feed
      const tableData = widget.activities.slice(0, 10).map(activity => [
        activity.time || '',
        activity.description || ''
      ]);

      pdf.autoTable({
        startY: yPos,
        head: [['Time', 'Activity']],
        body: tableData,
        theme: 'striped',
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: [255, 255, 255],
          fontSize: 10
        },
        bodyStyles: {
          fontSize: 8,
          textColor: [71, 85, 105]
        },
        margin: { left: 25, right: 20 },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 'auto' }
        }
      });

      yPos = pdf.lastAutoTable.finalY + 5;
    }

    yPos += 10;

    // Add separator between widgets
    if (i < widgets.length - 1) {
      pdf.setDrawColor(226, 232, 240);
      pdf.line(20, yPos, pageWidth - 20, yPos);
      yPos += 10;
    }
  }

  // Footer on last page
  const pageCount = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(156, 163, 175);
    pdf.text(
      `Page ${i} of ${pageCount} | NAVA OPS Dashboard Report`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // Save the PDF
  const fileName = `dashboard-report-${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);

  return fileName;
}

/**
 * Export dashboard section to PNG (using DOM to Canvas)
 * @param {HTMLElement} element - DOM element to capture
 * @param {string} fileName - Output file name
 */
export async function exportDashboardToPNG(element, fileName = 'dashboard.png') {
  // For now, we'll use a simple approach with the DOM
  // In production, you might want to use html2canvas or similar

  try {
    // Get the element's dimensions
    const rect = element.getBoundingClientRect();

    // Create a canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size
    const scale = 2; // For better quality
    canvas.width = rect.width * scale;
    canvas.height = rect.height * scale;

    // Scale context
    ctx.scale(scale, scale);

    // Draw white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Get computed styles
    const styles = window.getComputedStyle(element);

    // Draw border if exists
    if (styles.border !== 'none') {
      ctx.strokeStyle = styles.borderColor;
      ctx.lineWidth = parseInt(styles.borderWidth);
      ctx.strokeRect(0, 0, rect.width, rect.height);
    }

    // Convert to blob and download
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
    }, 'image/png');

    return fileName;
  } catch (error) {
    console.error('Error exporting to PNG:', error);
    throw new Error('Failed to export dashboard to PNG');
  }
}

/**
 * Prepare widget data for export
 * @param {Array} widgets - Widgets from dashboard
 * @param {Object} widgetData - Widget data map
 */
export function prepareWidgetDataForExport(widgets, widgetData) {
  return widgets.map(widget => {
    const data = widgetData[widget.id];

    return {
      id: widget.id,
      title: widget.title || widget.config?.title || 'Untitled Widget',
      type: widget.type,
      value: data?.value,
      trend: data?.trend,
      data: data?.chartData || data?.data,
      insights: data?.insights,
      activities: data?.activities
    };
  });
}

/**
 * Export dashboard summary data to CSV
 * @param {Array} data - Array of data objects
 * @param {string} fileName - Output file name
 */
export function exportToCSV(data, fileName = 'dashboard-data.csv') {
  if (!data || data.length === 0) {
    throw new Error('No data to export');
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);

  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        // Escape values containing commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);

  return fileName;
}
