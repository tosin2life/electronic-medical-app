-- AddForeignKey
ALTER TABLE "MedicalRecords" ADD CONSTRAINT "MedicalRecords_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
