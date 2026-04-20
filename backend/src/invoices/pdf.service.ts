import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';

@Injectable()
export class PdfService {
  async generateInvoicePdf(invoice: any): Promise<Buffer> {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          font-size: 14px;
          line-height: 1.6;
          color: #2d3748;
          background: #ffffff;
          padding: 0;
        }

        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px;
          background: white;
          position: relative;
        }

        /* Header avec logo et informations */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 50px;
          padding-bottom: 30px;
          border-bottom: 2px solid #e2e8f0;
        }

        .logo-section {
          flex: 0 0 200px;
          text-align: center;
        }

        .logo {
          max-width: 150px;
          max-height: 100px;
          object-fit: contain;
          margin-bottom: 15px;
        }

        .company-info {
          font-size: 12px;
          color: #718096;
          line-height: 1.4;
        }

        .invoice-section {
          flex: 1;
          text-align: right;
          padding-left: 40px;
        }

        .invoice-title {
          font-size: 36px;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 10px;
          letter-spacing: -1px;
        }

        .invoice-number {
          font-size: 18px;
          font-weight: 600;
          color: #4a5568;
          margin-bottom: 15px;
        }

        .status-badge {
          display: inline-block;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-PAID { background: #c6f6d5; color: #22543d; }
        .status-UNPAID { background: #fed7d7; color: #742a2a; }
        .status-PENDING { background: #fef5e7; color: #744210; }

        .invoice-details {
          margin-top: 20px;
          font-size: 13px;
          color: #718096;
        }

        .invoice-details div {
          margin-bottom: 4px;
        }

        /* Informations client et facture */
        .info-section {
          display: flex;
          justify-content: space-between;
          margin-bottom: 50px;
          gap: 40px;
        }

        .info-block {
          flex: 1;
        }

        .info-title {
          font-size: 11px;
          font-weight: 600;
          color: #a0aec0;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 12px;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 4px;
        }

        .client-name {
          font-size: 18px;
          font-weight: 600;
          color: #1a202c;
          margin-bottom: 8px;
        }

        .client-details {
          font-size: 13px;
          color: #718096;
          line-height: 1.5;
        }

        .invoice-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          font-size: 13px;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
        }

        .info-label {
          color: #718096;
          font-weight: 500;
        }

        .info-value {
          color: #2d3748;
          font-weight: 600;
        }

        /* Table des prestations */
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin: 40px 0;
          font-size: 13px;
        }

        .items-table thead th {
          background: #f7fafc;
          color: #4a5568;
          font-weight: 600;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 16px 20px;
          text-align: left;
          border-bottom: 2px solid #e2e8f0;
        }

        .items-table tbody td {
          padding: 16px 20px;
          border-bottom: 1px solid #f1f5f9;
          color: #2d3748;
        }

        .items-table tbody tr:hover {
          background: #f8fafc;
        }

        .description-cell {
          font-weight: 500;
        }

        .quantity-cell, .unit-price-cell {
          text-align: center;
          color: #718096;
        }

        .total-cell {
          text-align: right;
          font-weight: 600;
          color: #2d3748;
        }

        /* Ligne total */
        .total-row {
          background: #f7fafc;
          border-top: 2px solid #e2e8f0;
          font-weight: 700;
          font-size: 16px;
        }

        .total-row td {
          padding: 20px;
          color: #1a202c;
        }

        .total-row .total-cell {
          color: #2563eb;
          font-size: 18px;
        }

        /* Pied de page */
        .footer {
          margin-top: 60px;
          padding-top: 30px;
          border-top: 1px solid #e2e8f0;
          text-align: center;
          color: #a0aec0;
          font-size: 12px;
          line-height: 1.5;
        }

        .footer strong {
          color: #4a5568;
        }

        /* Responsive */
        @media print {
          body { background: white; }
          .container { padding: 20px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header avec logo -->
        <div class="header">
          <div class="logo-section">
            ${invoice.logo ? `<img src="${invoice.logo}" alt="Logo" class="logo">` : '<div style="height: 60px;"></div>'}
            <div class="company-info">
              Facture Pro<br>
              <span style="font-size: 11px;">Solution de facturation</span>
            </div>
          </div>

          <div class="invoice-section">
            <div class="invoice-title">FACTURE</div>
            <div class="invoice-number">${invoice.number}</div>
            <div class="status-badge status-${invoice.status}">${invoice.status === 'PAID' ? 'PAYÉE' : invoice.status === 'UNPAID' ? 'IMPAYÉE' : 'EN ATTENTE'}</div>

            <div class="invoice-details">
              <div><strong>Date de facture:</strong> ${invoice.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString('fr-FR') : new Date(invoice.createdAt).toLocaleDateString('fr-FR')}</div>
              <div><strong>Échéance:</strong> ${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('fr-FR') : 'N/A'}</div>
              ${invoice.poNumber ? `<div><strong>N° commande:</strong> ${invoice.poNumber}</div>` : ''}
              ${invoice.paymentTerms ? `<div><strong>Modalités:</strong> ${invoice.paymentTerms}</div>` : ''}
            </div>
          </div>
        </div>

        <!-- Informations client et détails facture -->
        <div class="info-section">
          <div class="info-block">
            <div class="info-title">Facturé à</div>
            <div class="client-name">${invoice.client.name}</div>
            <div class="client-details">
              ${invoice.client.email ? `${invoice.client.email}<br>` : ''}
              ${invoice.client.phone ? `${invoice.client.phone}<br>` : ''}
              ${invoice.client.address ? invoice.client.address.replace(/\\n/g, '<br>') : ''}
            </div>
          </div>

          <div class="info-block">
            <div class="info-title">Détails de la facture</div>
            <div class="invoice-info-grid">
              <div class="info-item">
                <span class="info-label">Numéro:</span>
                <span class="info-value">${invoice.number}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Date:</span>
                <span class="info-value">${new Date(invoice.createdAt).toLocaleDateString('fr-FR')}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Devise:</span>
                <span class="info-value">${invoice.currency || 'MAD'}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Statut:</span>
                <span class="info-value">${invoice.status === 'PAID' ? 'Payée' : invoice.status === 'UNPAID' ? 'Impayée' : 'En attente'}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Table des prestations -->
        <table class="items-table">
          <thead>
            <tr>
              <th style="width: 50%;">Description</th>
              <th style="width: 15%; text-align: center;">Qté</th>
              <th style="width: 20%; text-align: center;">Prix unitaire</th>
              <th style="width: 15%; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map((item: any) => `
              <tr>
                <td class="description-cell">${item.description}</td>
                <td class="quantity-cell">${item.quantity}</td>
                <td class="unit-price-cell">${item.unitPrice.toLocaleString('fr-FR')} ${invoice.currency || 'MAD'}</td>
                <td class="total-cell">${item.total.toLocaleString('fr-FR')} ${invoice.currency || 'MAD'}</td>
              </tr>
            `).join('')}
            <tr class="total-row">
              <td colspan="3" style="text-align: right; font-size: 14px;">TOTAL</td>
              <td class="total-cell">${invoice.total.toLocaleString('fr-FR')} ${invoice.currency || 'MAD'}</td>
            </tr>
          </tbody>
        </table>

        <!-- Pied de page -->
        <div class="footer">
          <div>
            <strong>Merci pour votre confiance !</strong><br>
            Cette facture a été générée automatiquement par Facture Pro<br>
            Pour toute question, contactez-nous à support@facturepro.com
          </div>
        </div>
      </div>
    </body>
    </html>
    `;

    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });
    await browser.close();

    return Buffer.from(pdf);
  }
}