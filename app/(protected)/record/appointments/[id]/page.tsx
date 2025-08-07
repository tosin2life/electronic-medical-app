import { AppointmentActionOptions } from "@/components/appointment-actions";
import { ClinicalNotesForm } from "@/components/forms/clinical-notes-form";
import { ProfileImage } from "@/components/profile-image";
import { checkRole } from "@/utils/roles";
import { getAppointmentById } from "@/utils/services/appointment";
import { getBillingByAppointment } from "@/utils/services/billing";
import { Appointment, Doctor, Patient } from "@prisma/client";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  FileText,
  DollarSign,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

interface AppointmentWithRelations extends Appointment {
  patient: Patient;
  doctor: Doctor;
}

interface AppointmentPageProps {
  params: Promise<{ id: string }>;
}

export default async function AppointmentPage({
  params,
}: AppointmentPageProps) {
  const { id } = await params;
  const appointment = await getAppointmentById(parseInt(id));

  if (!appointment || !appointment.success || !appointment.data) {
    notFound();
  }

  const isAdmin = await checkRole("ADMIN");
  const isDoctor = await checkRole("DOCTOR");

  const appointmentData = appointment.data as AppointmentWithRelations;
  const patient = appointmentData.patient;
  const doctor = appointmentData.doctor;
  const patientName = `${patient.first_name} ${patient.last_name}`;
  const doctorName = doctor.name;

  // Get billing information
  const billing = await getBillingByAppointment(parseInt(id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/record/appointments"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
            Back to Appointments
          </Link>
          <div className="h-6 w-px bg-gray-300" />
          <h1 className="text-2xl font-bold">Appointment #{id}</h1>
        </div>
        <div className="flex items-center gap-2">
          {(isAdmin || isDoctor) && (
            <AppointmentActionOptions
              appointmentId={parseInt(id)}
              userId={appointmentData.patient_id}
              patientId={appointmentData.patient_id}
              doctorId={appointmentData.doctor_id}
              status={appointmentData.status}
            />
          )}
          {isDoctor && appointmentData.status !== "COMPLETED" && (
            <Link
              href={`/record/appointments/${id}/clinical-notes`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FileText size={16} />
              Add Clinical Notes
            </Link>
          )}
        </div>
      </div>

      {/* Appointment Details Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Patient Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User size={20} />
                Patient Information
              </h2>
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
            </div>

            <div>
              <h3 className="font-medium mb-2">Patient Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Gender:</span>
                  <span className="capitalize">{patient.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date of Birth:</span>
                  <span>{format(patient.date_of_birth, "MMM dd, yyyy")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Blood Group:</span>
                  <span>{patient.blood_group || "Not specified"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Address:</span>
                  <span className="text-right max-w-xs">{patient.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Doctor & Appointment Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Doctor Information</h2>
              <div className="flex items-center gap-4">
                <ProfileImage
                  url={doctor.img || undefined}
                  name={doctorName}
                  bgColor={doctor.colorCode || undefined}
                  textClassName="text-black"
                />
                <div>
                  <h3 className="font-semibold text-lg">{doctorName}</h3>
                  <p className="text-gray-600">{doctor.specialization}</p>
                  <p className="text-gray-600">{doctor.department}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Appointment Details</h3>
              <div className="space-y-3">
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
                  <span className="text-sm">
                    {doctor.department} - Room{" "}
                    {appointmentData.id.toString().slice(-3)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Appointment Status & Type */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-sm text-gray-600">Status</span>
              <div className="mt-1">
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
            <div>
              <span className="text-sm text-gray-600">Type</span>
              <div className="mt-1">
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                  {appointmentData.type}
                </span>
              </div>
            </div>
            <div>
              <span className="text-sm text-gray-600">Created</span>
              <div className="mt-1 text-sm">
                {format(appointmentData.created_at, "MMM dd, yyyy")}
              </div>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        {appointmentData.note && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-medium mb-2">Notes</h3>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
              {appointmentData.note}
            </p>
          </div>
        )}
      </div>

      {/* Medical Records Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Medical Records</h2>
        {appointmentData.status === "COMPLETED" ? (
          <div className="text-center py-8 text-gray-500">
            <p>Medical records will be displayed here once created.</p>
            <p className="text-sm mt-2">
              Use the "Add Clinical Notes" button above to create medical
              records.
            </p>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No medical records found for this appointment.</p>
            <p className="text-sm mt-2">
              Medical records will appear here once the appointment is
              completed.
            </p>
          </div>
        )}
      </div>

      {/* Billing Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <DollarSign size={20} />
            Billing Information
          </h2>
          {appointmentData.status === "COMPLETED" && (isAdmin || isDoctor) && (
            <Link
              href={`/record/appointments/${id}/billing`}
              className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
            >
              <Plus size={16} />
              Create Bill
            </Link>
          )}
        </div>

        {billing.success && billing.data ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-sm text-gray-600">Total Amount</span>
                <div className="mt-1 font-semibold text-lg">
                  ${billing.data.total_amount.toFixed(2)}
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Status</span>
                <div className="mt-1">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      billing.data.status === "PAID"
                        ? "bg-green-100 text-green-800"
                        : billing.data.status === "UNPAID"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {billing.data.status}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Amount Paid</span>
                <div className="mt-1 font-semibold">
                  ${billing.data.amount_paid.toFixed(2)}
                </div>
              </div>
            </div>

            {billing.data.bills && billing.data.bills.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Bill Items</h4>
                <div className="space-y-2">
                  {billing.data.bills.map((bill: any) => (
                    <div
                      key={bill.id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <div className="font-medium">
                          {bill.service.service_name}
                        </div>
                        {bill.medication_name && (
                          <div className="text-sm text-gray-600">
                            {bill.medication_name}{" "}
                            {bill.dosage && `- ${bill.dosage}`}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          ${bill.total_cost.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">
                          Qty: {bill.quantity}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No billing information found for this appointment.</p>
            <p className="text-sm mt-2">
              {appointmentData.status === "COMPLETED"
                ? "Create a bill using the button above."
                : "Billing details will appear here once the appointment is completed."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
