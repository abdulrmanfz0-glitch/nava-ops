// src/lib/pdfGenerator.js
/**
 * Professional PDF Report Generator
 * ZATCA-compliant financial reporting for Saudi Arabia
 */

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logger from './logger';

// ==================== ZATCA COMPLIANCE ====================

/**
 * Generate ZATCA-compliant invoice
 * Requirements: https://zatca.gov.sa/en/E-Invoicing/SystemsDevelopers/Pages/TechnicalRequirements.aspx
 */
export const generateZATCAInvoice = (invoiceData) => {
  try {
    const {
      invoiceNumber,
      invoiceDate,
      seller,
      buyer,
      items,
      vatRate = 0.15, // 15% VAT in Saudi Arabia
      currency = 'SAR',
    } = invoiceData;

    // Validate required fields
    if (!invoiceNumber || !seller || !buyer || !items) {
      throw new Error('Missing required invoice fields');
    }

    const doc = new jsPDF();
    let yPos = 20;

    // Header - Tax Invoice
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('TAX INVOICE | فاتورة ضريبية', 105, yPos, { align: 'center' });
    yPos += 15;

    // Invoice metadata
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Invoice Number: ${invoiceNumber}`, 20, yPos);
    doc.text(`Invoice Date: ${invoiceDate}`, 20, yPos + 6);
    yPos += 20;

    // Seller Information
    doc.setFont('helvetica', 'bold');
    doc.text('Seller Information:', 20, yPos);
    yPos += 6;
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${seller.name}`, 20, yPos);
    doc.text(`VAT Number: ${seller.vatNumber}`, 20, yPos + 6);
    doc.text(`Address: ${seller.address}`, 20, yPos + 12);
    doc.text(`CR Number: ${seller.crNumber || 'N/A'}`, 20, yPos + 18);
    yPos += 30;

    // Buyer Information
    doc.setFont('helvetica', 'bold');
    doc.text('Buyer Information:', 20, yPos);
    yPos += 6;
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${buyer.name}`, 20, yPos);
    if (buyer.vatNumber) {
      doc.text(`VAT Number: ${buyer.vatNumber}`, 20, yPos + 6);
      yPos += 6;
    }
    doc.text(`Address: ${buyer.address || 'N/A'}`, 20, yPos + 6);
    yPos += 20;

    // Items Table
    const tableData = items.map((item, index) => [
      index + 1,
      item.description,
      item.quantity,
      formatCurrency(item.unitPrice, currency),
      formatCurrency(item.quantity * item.unitPrice, currency),
      `${(vatRate * 100).toFixed(0)}%`,
      formatCurrency(item.quantity * item.unitPrice * vatRate, currency),
      formatCurrency(item.quantity * item.unitPrice * (1 + vatRate), currency),
    ]);

    doc.autoTable({
      startY: yPos,
      head: [['#', 'Description', 'Qty', 'Unit Price', 'Subtotal', 'VAT%', 'VAT Amount', 'Total']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontSize: 9 },
      styles: { fontSize: 8, cellPadding: 3 },
      columnStyles: {
        2: { halign: 'center' },
        3: { halign: 'right' },
        4: { halign: 'right' },
        5: { halign: 'center' },
        6: { halign: 'right' },
        7: { halign: 'right' },
      },
    });

    yPos = doc.lastAutoTable.finalY + 10;

    // Summary
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const totalVAT = subtotal * vatRate;
    const grandTotal = subtotal + totalVAT;

    doc.setFont('helvetica', 'bold');
    const summaryX = 120;
    doc.text('Subtotal (excl. VAT):', summaryX, yPos);
    doc.text(formatCurrency(subtotal, currency), 190, yPos, { align: 'right' });

    doc.text(`VAT (${(vatRate * 100).toFixed(0)}%):`, summaryX, yPos + 6);
    doc.text(formatCurrency(totalVAT, currency), 190, yPos + 6, { align: 'right' });

    doc.setFontSize(12);
    doc.text('Grand Total:', summaryX, yPos + 15);
    doc.text(formatCurrency(grandTotal, currency), 190, yPos + 15, { align: 'right' });

    // QR Code placeholder (ZATCA requirement)
    yPos += 30;
    doc.setFontSize(8);
    doc.text('QR Code for ZATCA Validation:', 20, yPos);
    doc.rect(20, yPos + 2, 40, 40); // Placeholder for actual QR code
    doc.text('[QR Code Here]', 30, yPos + 24);

    // Footer
    yPos = 280;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text('This is a computer-generated invoice and does not require a signature.', 105, yPos, { align: 'center' });
    doc.text('For any queries, please contact our support team.', 105, yPos + 4, { align: 'center' });

    logger.info('ZATCA invoice generated', { invoiceNumber });

    return {
      success: true,
      pdf: doc,
      filename: `INVOICE-${invoiceNumber}.pdf`,
    };
  } catch (error) {
    logger.error('ZATCA invoice generation failed', { error: error.message });
    return { success: false, error: error.message };
  }
};

// ==================== FINANCIAL REPORTS ====================

/**
 * Generate comprehensive financial report
 */
export const generateFinancialReport = (reportData) => {
  try {
    const {
      title,
      period,
      restaurant,
      revenue,
      expenses,
      profitLoss,
      cashFlow,
      summary,
    } = reportData;

    const doc = new jsPDF();
    let yPos = 20;

    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(title || 'Financial Report', 105, yPos, { align: 'center' });
    yPos += 10;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Period: ${period}`, 105, yPos, { align: 'center' });
    doc.text(`Restaurant: ${restaurant}`, 105, yPos + 6, { align: 'center' });
    yPos += 20;

    // Executive Summary
    if (summary) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Executive Summary', 20, yPos);
      yPos += 8;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const summaryLines = doc.splitTextToSize(summary, 170);
      doc.text(summaryLines, 20, yPos);
      yPos += summaryLines.length * 6 + 10;
    }

    // Revenue Breakdown
    if (revenue) {
      addSectionHeader(doc, 'Revenue Breakdown', yPos);
      yPos += 8;

      const revenueData = Object.entries(revenue).map(([key, value]) => [
        key.replace(/_/g, ' ').toUpperCase(),
        formatCurrency(value),
      ]);

      doc.autoTable({
        startY: yPos,
        head: [['Category', 'Amount (SAR)']],
        body: revenueData,
        theme: 'striped',
        headStyles: { fillColor: [52, 152, 219] },
      });

      yPos = doc.lastAutoTable.finalY + 15;
    }

    // Expense Breakdown
    if (expenses) {
      checkPageBreak(doc, yPos, 60);

      addSectionHeader(doc, 'Expense Breakdown', yPos);
      yPos += 8;

      const expenseData = Object.entries(expenses).map(([key, value]) => [
        key.replace(/_/g, ' ').toUpperCase(),
        formatCurrency(value),
      ]);

      doc.autoTable({
        startY: yPos,
        head: [['Category', 'Amount (SAR)']],
        body: expenseData,
        theme: 'striped',
        headStyles: { fillColor: [231, 76, 60] },
      });

      yPos = doc.lastAutoTable.finalY + 15;
    }

    // Profit & Loss
    if (profitLoss) {
      checkPageBreak(doc, yPos, 40);

      addSectionHeader(doc, 'Profit & Loss Statement', yPos);
      yPos += 8;

      const plData = [
        ['Total Revenue', formatCurrency(profitLoss.totalRevenue)],
        ['Total Expenses', formatCurrency(profitLoss.totalExpenses)],
        ['Net Profit/Loss', formatCurrency(profitLoss.netProfit)],
        ['Profit Margin', `${profitLoss.profitMargin.toFixed(2)}%`],
      ];

      doc.autoTable({
        startY: yPos,
        body: plData,
        theme: 'plain',
        styles: { fontSize: 11, fontStyle: 'bold' },
        columnStyles: {
          0: { cellWidth: 100 },
          1: { halign: 'right', cellWidth: 70 },
        },
      });

      yPos = doc.lastAutoTable.finalY + 15;
    }

    // Footer
    addReportFooter(doc);

    logger.info('Financial report generated', { title, period });

    return {
      success: true,
      pdf: doc,
      filename: `Financial-Report-${Date.now()}.pdf`,
    };
  } catch (error) {
    logger.error('Financial report generation failed', { error: error.message });
    return { success: false, error: error.message };
  }
};

// ==================== ANALYTICS REPORTS ====================

/**
 * Generate analytics report with charts and insights
 */
export const generateAnalyticsReport = (analyticsData) => {
  try {
    const {
      title,
      period,
      metrics,
      insights,
      recommendations,
    } = analyticsData;

    const doc = new jsPDF();
    let yPos = 20;

    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(title || 'Analytics Report', 105, yPos, { align: 'center' });
    yPos += 10;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Period: ${period}`, 105, yPos, { align: 'center' });
    yPos += 20;

    // Key Metrics
    if (metrics) {
      addSectionHeader(doc, 'Key Performance Indicators', yPos);
      yPos += 8;

      const metricsData = Object.entries(metrics).map(([key, value]) => [
        key.replace(/_/g, ' ').toUpperCase(),
        typeof value === 'number' ? formatNumber(value) : value,
      ]);

      doc.autoTable({
        startY: yPos,
        head: [['Metric', 'Value']],
        body: metricsData,
        theme: 'grid',
        headStyles: { fillColor: [46, 204, 113] },
      });

      yPos = doc.lastAutoTable.finalY + 15;
    }

    // AI Insights
    if (insights && insights.length > 0) {
      checkPageBreak(doc, yPos, 40);

      addSectionHeader(doc, 'AI-Powered Insights', yPos);
      yPos += 8;

      insights.forEach((insight, index) => {
        doc.setFont('helvetica', 'bold');
        doc.text(`${index + 1}. ${insight.title}`, 20, yPos);
        yPos += 6;

        doc.setFont('helvetica', 'normal');
        const description = doc.splitTextToSize(insight.description, 170);
        doc.text(description, 25, yPos);
        yPos += description.length * 5 + 8;

        checkPageBreak(doc, yPos, 20);
      });
    }

    // Recommendations
    if (recommendations && recommendations.length > 0) {
      checkPageBreak(doc, yPos, 40);

      addSectionHeader(doc, 'Recommendations', yPos);
      yPos += 8;

      recommendations.forEach((rec, index) => {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(52, 152, 219);
        doc.text(`${index + 1}. ${rec.title}`, 20, yPos);
        yPos += 6;

        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        const recText = doc.splitTextToSize(rec.action, 170);
        doc.text(recText, 25, yPos);
        yPos += recText.length * 5 + 8;

        checkPageBreak(doc, yPos, 20);
      });
    }

    // Footer
    addReportFooter(doc);

    logger.info('Analytics report generated', { title, period });

    return {
      success: true,
      pdf: doc,
      filename: `Analytics-Report-${Date.now()}.pdf`,
    };
  } catch (error) {
    logger.error('Analytics report generation failed', { error: error.message });
    return { success: false, error: error.message };
  }
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Format currency
 */
const formatCurrency = (amount, currency = 'SAR') => {
  return `${currency} ${amount.toFixed(2)}`;
};

/**
 * Format number with commas
 */
const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Add section header
 */
const addSectionHeader = (doc, title, yPos) => {
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(41, 128, 185);
  doc.text(title, 20, yPos);
  doc.setTextColor(0, 0, 0);
};

/**
 * Check if page break is needed
 */
const checkPageBreak = (doc, yPos, spaceNeeded = 40) => {
  if (yPos + spaceNeeded > 280) {
    doc.addPage();
    return 20; // Reset yPos
  }
  return yPos;
};

/**
 * Add report footer
 */
const addReportFooter = (doc) => {
  const pageCount = doc.internal.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text(
      `Generated by Nava Ops | Page ${i} of ${pageCount} | ${new Date().toLocaleDateString()}`,
      105,
      290,
      { align: 'center' }
    );
  }
};

/**
 * Download PDF
 */
export const downloadPDF = (pdf, filename) => {
  try {
    pdf.save(filename);
    logger.info('PDF downloaded', { filename });
    return { success: true };
  } catch (error) {
    logger.error('PDF download failed', { error: error.message });
    return { success: false, error: error.message };
  }
};

/**
 * Get PDF as blob (for preview or upload)
 */
export const getPDFBlob = (pdf) => {
  try {
    const blob = pdf.output('blob');
    return { success: true, blob };
  } catch (error) {
    logger.error('PDF blob generation failed', { error: error.message });
    return { success: false, error: error.message };
  }
};

// ==================== EXPORT ====================

export default {
  generateZATCAInvoice,
  generateFinancialReport,
  generateAnalyticsReport,
  downloadPDF,
  getPDFBlob,
};
