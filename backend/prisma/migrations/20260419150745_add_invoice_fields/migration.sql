-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'MAD',
ADD COLUMN     "invoiceDate" TIMESTAMP(3),
ADD COLUMN     "logo" TEXT,
ADD COLUMN     "paymentTerms" TEXT,
ADD COLUMN     "poNumber" TEXT;
