/*
  Warnings:

  - Added the required column `subtotal` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('CONSULTATION', 'MEDICATION', 'LAB_TEST', 'PROCEDURE', 'OTHER');

-- AlterTable
ALTER TABLE "PatientBills" ADD COLUMN     "dosage" TEXT,
ADD COLUMN     "instructions" TEXT,
ADD COLUMN     "medication_name" TEXT;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "notes" TEXT,
ADD COLUMN     "subtotal" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "tax_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ALTER COLUMN "discount" SET DEFAULT 0,
ALTER COLUMN "amount_paid" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Services" ADD COLUMN     "service_type" "ServiceType" NOT NULL DEFAULT 'CONSULTATION';

-- CreateTable
CREATE TABLE "ClinicalNotesVersion" (
    "id" SERIAL NOT NULL,
    "medical_record_id" INTEGER NOT NULL,
    "doctor_id" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "version_number" INTEGER NOT NULL,
    "change_reason" TEXT,
    "is_current" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClinicalNotesVersion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClinicalNotesVersion_medical_record_id_version_number_key" ON "ClinicalNotesVersion"("medical_record_id", "version_number");

-- AddForeignKey
ALTER TABLE "ClinicalNotesVersion" ADD CONSTRAINT "ClinicalNotesVersion_medical_record_id_fkey" FOREIGN KEY ("medical_record_id") REFERENCES "MedicalRecords"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalNotesVersion" ADD CONSTRAINT "ClinicalNotesVersion_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
