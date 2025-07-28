import { ClinicalNotesForm } from "@/components/forms/clinical-notes-form";
import { ProfileImage } from "@/components/profile-image";
import { checkRole } from "@/utils/roles";
import { getAppointmentById } from "@/utils/services/appointment";
import { Appointment, Doctor, Patient } from "@prisma/client";
import { format } from "date-fns";
import { ArrowLeft, Calendar, Clock, MapPin, User } from "lucide-react";
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

  if (!isDoctor) {
    notFound();
  }

  const appointmentData = appointment.data as AppointmentWithRelations;
  const patient = appointmentData.patient;
  const doctor = appointmentData.doctor;
  const patientName = `${patient.first_name} ${patient.last_name}`;
  const doctorName = doctor.name;

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
          <h1 className="text-2xl font-bold">
            Clinical Notes - Appointment #{id}
          </h1>
        </div>
      </div>

      {/* Appointment Summary Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Appointment Summary</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Patient Info */}
          <div className="flex items-center gap-4">
            <ProfileImage
              url={patient.img || undefined}
              name={patientName}
              bgColor={patient.colorCode || undefined}
              textClassName="text-black"
            />
            <div>
              <h3 className="font-semibold text-lg">{patientName}</h3>
              <p className="text-gray-600">{patient.phone}</p>
              <p className="text-gray-600">{patient.email}</p>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-500" />
              <span className="text-sm">
                {format(
                  appointmentData.appointment_date,
                  "EEEE, MMMM dd, yyyy"
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-gray-500" />
              <span className="text-sm">{appointmentData.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-gray-500" />
              <span className="text-sm">{doctor.department}</span>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <span className="text-sm text-gray-600">Status: </span>
          <span
            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
              appointmentData.status === "COMPLETED"
                ? "bg-green-100 text-green-800"
                : appointmentData.status === "CANCELLED"
                ? "bg-red-100 text-red-800"
                : appointmentData.status === "PENDING"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {appointmentData.status}
          </span>
        </div>
      </div>

      {/* Clinical Notes Form */}
      {appointmentData.status !== "COMPLETED" && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Enter Clinical Notes</h2>
          <ClinicalNotesForm
            appointmentId={parseInt(id)}
            patientId={appointmentData.patient_id}
            doctorId={appointmentData.doctor_id}
          />
        </div>
      )}

      {/* Existing Medical Records */}
      {appointmentData.status === "COMPLETED" && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Medical Records</h2>
          <div className="text-center py-8 text-gray-500">
            <p>Medical records will be displayed here once created.</p>
            <p className="text-sm mt-2">
              Use the "Add Clinical Notes" button above to create medical
              records.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
