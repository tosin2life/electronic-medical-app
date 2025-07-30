import { ProfileImage } from "@/components/profile-image";
import { ClinicalNotesEditor } from "@/components/clinical-notes-editor";
import { checkRole } from "@/utils/roles";
import { getMedicalRecordById } from "@/utils/services/medical";
import {
  MedicalRecords,
  Patient,
  Doctor,
  Diagnosis,
  VitalSigns,
  Appointment,
} from "@prisma/client";
import { format } from "date-fns";
import {
  ArrowLeft,
  FileText,
  User,
  Calendar,
  Thermometer,
  Heart,
  Weight,
  Ruler,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

interface MedicalRecordWithRelations extends MedicalRecords {
  patient: Patient;
  diagnosis: Diagnosis[];
  vital_signs: VitalSigns[];
  appointment: Appointment & {
    doctor: Doctor;
  };
}

interface MedicalRecordPageProps {
  params: Promise<{ id: string }>;
}

export default async function MedicalRecordPage({
  params,
}: MedicalRecordPageProps) {
  const { id } = await params;
  const record = await getMedicalRecordById(parseInt(id));

  if (!record || !record.success || !record.data) {
    notFound();
  }

  const isAdmin = await checkRole("ADMIN");
  const isDoctor = await checkRole("DOCTOR");

  const recordData = record.data as MedicalRecordWithRelations;
  const patient = recordData.patient;
  const doctor = recordData.appointment.doctor;
  const diagnosis = recordData.diagnosis[0]; // Get first diagnosis
  const vitalSigns = recordData.vital_signs[0]; // Get first vital signs
  const appointment = recordData.appointment;

  const patientName = `${patient.first_name} ${patient.last_name}`;
  const doctorName = doctor.name;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/record/medical-records"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
            Back to Medical Records
          </Link>
          <div className="h-6 w-px bg-gray-300" />
          <h1 className="text-2xl font-bold">Medical Record #{id}</h1>
        </div>
      </div>

      {/* Patient and Doctor Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <User size={20} />
            Patient Information
          </h2>
          <div className="flex items-center gap-4 mb-4">
            <ProfileImage
              url={patient?.img!}
              name={patientName}
              bgColor={patient?.colorCode!}
              textClassName="text-black"
            />
            <div>
              <h3 className="font-medium text-lg">{patientName}</h3>
              <p className="text-gray-600">ID: {patient.id.slice(-6)}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Email:</span>
              <p>{patient.email}</p>
            </div>
            <div>
              <span className="text-gray-600">Phone:</span>
              <p>{patient.phone}</p>
            </div>
            <div>
              <span className="text-gray-600">Gender:</span>
              <p className="capitalize">{patient.gender.toLowerCase()}</p>
            </div>
            <div>
              <span className="text-gray-600">Age:</span>
              <p>
                {new Date().getFullYear() -
                  new Date(patient.date_of_birth).getFullYear()}{" "}
                years
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <User size={20} />
            Doctor Information
          </h2>
          <div className="flex items-center gap-4 mb-4">
            <ProfileImage
              url={doctor?.img!}
              name={doctorName}
              bgColor={doctor?.colorCode!}
              textClassName="text-black"
            />
            <div>
              <h3 className="font-medium text-lg">{doctorName}</h3>
              <p className="text-gray-600">{doctor.specialization}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Department:</span>
              <p>{doctor.department}</p>
            </div>
            <div>
              <span className="text-gray-600">License:</span>
              <p>{doctor.license_number}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Information */}
      <div className="bg-white rounded-xl p-6 border">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar size={20} />
          Appointment Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span className="text-gray-600 text-sm">Appointment Date:</span>
            <p className="font-medium">
              {format(appointment.appointment_date, "MMM dd, yyyy")}
            </p>
          </div>
          <div>
            <span className="text-gray-600 text-sm">Time:</span>
            <p className="font-medium">{appointment.time}</p>
          </div>
          <div>
            <span className="text-gray-600 text-sm">Type:</span>
            <p className="font-medium capitalize">
              {appointment.type.toLowerCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Diagnosis Section */}
      {diagnosis && (
        <div className="bg-white rounded-xl p-6 border">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText size={20} />
            Diagnosis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Symptoms</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                {diagnosis.symptoms}
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Diagnosis</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                {diagnosis.diagnosis}
              </p>
            </div>
            {diagnosis.prescribed_medications && (
              <div>
                <h3 className="font-medium mb-2">Prescribed Medications</h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                  {diagnosis.prescribed_medications}
                </p>
              </div>
            )}
            {diagnosis.follow_up_plan && (
              <div>
                <h3 className="font-medium mb-2">Follow-up Plan</h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                  {diagnosis.follow_up_plan}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Vital Signs Section */}
      {vitalSigns && (
        <div className="bg-white rounded-xl p-6 border">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Thermometer size={20} />
            Vital Signs
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Thermometer size={16} className="text-blue-600" />
                <span className="font-medium text-sm">Temperature</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {vitalSigns.body_temperature}°C
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Heart size={16} className="text-red-600" />
                <span className="font-medium text-sm">Blood Pressure</span>
              </div>
              <p className="text-2xl font-bold text-red-600">
                {vitalSigns.systolic}/{vitalSigns.diastolic} mmHg
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Heart size={16} className="text-green-600" />
                <span className="font-medium text-sm">Heart Rate</span>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {vitalSigns.heartRate}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Weight size={16} className="text-purple-600" />
                <span className="font-medium text-sm">Weight</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">
                {vitalSigns.weight} kg
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {vitalSigns.respiratory_rate && (
              <div className="bg-orange-50 p-4 rounded-lg">
                <span className="font-medium text-sm">Respiratory Rate</span>
                <p className="text-xl font-bold text-orange-600">
                  {vitalSigns.respiratory_rate} bpm
                </p>
              </div>
            )}
            {vitalSigns.oxygen_saturation && (
              <div className="bg-teal-50 p-4 rounded-lg">
                <span className="font-medium text-sm">O2 Saturation</span>
                <p className="text-xl font-bold text-teal-600">
                  {vitalSigns.oxygen_saturation}%
                </p>
              </div>
            )}
            <div className="bg-indigo-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Ruler size={16} className="text-indigo-600" />
                <span className="font-medium text-sm">Height</span>
              </div>
              <p className="text-xl font-bold text-indigo-600">
                {vitalSigns.height} cm
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Treatment Plan Section */}
      {recordData.treatment_plan && (
        <div className="bg-white rounded-xl p-6 border">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText size={20} />
            Treatment Plan
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 whitespace-pre-wrap">
              {recordData.treatment_plan}
            </p>
          </div>
        </div>
      )}

      {/* Clinical Notes Section */}
      <div className="bg-white rounded-xl p-6 border">
        <ClinicalNotesEditor
          medicalRecordId={recordData.id}
          initialNotes={recordData.notes || ""}
          canEdit={isDoctor}
        />
      </div>

      {/* Record Metadata */}
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Created:</span>
            <p className="font-medium">
              {format(recordData.created_at, "MMM dd, yyyy 'at' HH:mm")}
            </p>
          </div>
          <div>
            <span className="text-gray-600">Last Updated:</span>
            <p className="font-medium">
              {format(recordData.updated_at, "MMM dd, yyyy 'at' HH:mm")}
            </p>
          </div>
          <div>
            <span className="text-gray-600">Record ID:</span>
            <p className="font-medium">#{recordData.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
