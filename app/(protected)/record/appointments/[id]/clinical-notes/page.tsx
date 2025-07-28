import { ClinicalNotesForm } from "@/components/forms/clinical-notes-form";
import { getAppointmentById } from "@/utils/services/appointment";
import { checkRole } from "@/utils/roles";
import { Appointment, Doctor, Patient } from "@prisma/client";
import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

interface AppointmentWithRelations extends Appointment {
  patient: Patient;
  doctor: Doctor;
}

interface ClinicalNotesPageProps {
  params: Promise<{ id: string }>;
}

export default async function ClinicalNotesPage({
  params,
}: ClinicalNotesPageProps) {
  const { id } = await params;
  const appointment = await getAppointmentById(parseInt(id));

  if (!appointment || !appointment.success || !appointment.data) {
    notFound();
  }

  const isDoctor = await checkRole("DOCTOR");
  const appointmentData = appointment.data as AppointmentWithRelations;
  const patient = appointmentData.patient;
  const doctor = appointmentData.doctor;
  const patientName = `${patient.first_name} ${patient.last_name}`;
  const doctorName = doctor.name;

  // Only doctors can access this page
  if (!isDoctor) {
    notFound();
  }

  // If appointment is already completed, show message
  if (appointmentData.status === "COMPLETED") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href={`/record/appointments/${id}`}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
            Back to Appointment
          </Link>
          <div className="h-6 w-px bg-gray-300" />
          <h1 className="text-2xl font-bold">Clinical Notes</h1>
        </div>

        <div className="bg-white rounded-xl p-6">
          <div className="text-center space-y-4">
            <FileText size={48} className="mx-auto text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-600">
              Appointment Already Completed
            </h2>
            <p className="text-gray-500">
              This appointment has already been completed and clinical notes
              have been recorded.
            </p>
            <Link
              href={`/record/appointments/${id}`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              View Appointment Details
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={`/record/appointments/${id}`}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
            Back to Appointment
          </Link>
          <div className="h-6 w-px bg-gray-300" />
          <h1 className="text-2xl font-bold">Clinical Notes</h1>
        </div>
      </div>

      {/* Appointment Info Card */}
      <div className="bg-white rounded-xl p-6 border">
        <h2 className="text-lg font-semibold mb-4">Appointment Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Patient</p>
            <p className="font-medium">{patientName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Doctor</p>
            <p className="font-medium">{doctorName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Appointment ID</p>
            <p className="font-medium">#{id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <p className="font-medium capitalize">
              {appointmentData.status.toLowerCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Clinical Notes Form */}
      <div className="bg-white rounded-xl p-6 border">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Enter Clinical Notes</h2>
          <p className="text-sm text-gray-600 mt-1">
            Complete the form below to record clinical notes for this
            appointment.
          </p>
        </div>

        <ClinicalNotesForm
          appointmentId={parseInt(id)}
          patientId={appointmentData.patient_id}
          doctorId={appointmentData.doctor_id}
        />
      </div>
    </div>
  );
}
