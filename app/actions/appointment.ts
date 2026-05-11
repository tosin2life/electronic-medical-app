"use server";

import db from "@/lib/db";
import { AppointmentSchema } from "@/lib/schema";
import { AppointmentStatus } from "@prisma/client";

export async function appointmentAction(
  id: string | number,

  status: AppointmentStatus,
  reason: string
) {
  try {
    await db.appointment.update({
      where: { id: Number(id) },
      data: {
        status,
        reason,
      },
    });

    return {
      success: true,
      error: false,
      msg: `Appointment ${status.toLowerCase()} successfully`,
    };
  } catch (error) {
    console.log(error);
    return { success: false, msg: "Internal Server Error" };
  }
}

// export async function addVitalSigns(
//   data: VitalSignsFormData,
//   appointmentId: string,
//   doctorId: string
// ) {
//   try {
//     const { userId } = await auth();

//     if (!userId) {
//       return { success: false, msg: "Unauthorized" };
//     }

//     const validatedData = VitalSignsSchema.parse(data);

//     let medicalRecord = null;

//     if (!validatedData.medical_id) {
//       medicalRecord = await db.medicalRecords.create({
//         data: {
//           patient_id: validatedData.patient_id,
//           appointment_id: Number(appointmentId),
//           doctor_id: doctorId,
//         },
//       });
//     }

//     const med_id = validatedData.medical_id || medicalRecord?.id;

//     await db.vitalSigns.create({
//       data: {
//         ...validatedData,
//         medical_id: Number(med_id!),
//       },
//     });

//     return {
//       success: true,
//       msg: "Vital signs added successfully",
//     };
//   } catch (error) {
//     console.log(error);
//     return { success: false, msg: "Internal Server Error" };
//   }
// }
interface AppointmentFormData {
  patient_id: string;
  doctor_id: string;
  time: string;
  type: string;
  appointment_date: string;
  note?: string;
  [key: string]: unknown;
}

export async function createNewAppointment(data: AppointmentFormData) {
  try {
    const validatedData = AppointmentSchema.safeParse(data);

    if (!validatedData.success) {
      return { success: false, msg: "Invalid data" };
    }
    const validated = validatedData.data;

    await db.appointment.create({
      data: {
        patient_id: data.patient_id,
        doctor_id: validated.doctor_id,
        time: validated.time,
        type: validated.type,
        appointment_date: new Date(validated.appointment_date),
        note: validated.note,
      },
    });

    return {
      success: true,
      message: "Appointment booked successfully",
    };
  } catch (error) {
    console.log(error);
    return { success: false, msg: "Internal Server Error" };
  }
}

interface MedicalRecordFormData {
  appointmentId: number;
  patientId: string;
  doctorId: string;
  treatment_plan?: string;
  prescriptions?: string;
  lab_request?: string;
  notes?: string;
  symptoms?: string;
  diagnosis?: string;
  prescribed_medications?: string;
  follow_up_plan?: string;
  body_temperature?: number;
  systolic?: number;
  diastolic?: number;
  heartRate?: number;
  respiratory_rate?: number;
  oxygen_saturation?: number;
  weight?: number;
  height?: number;
}

export async function createMedicalRecord(data: MedicalRecordFormData) {
  try {
    const {
      appointmentId,
      patientId,
      doctorId,
      treatment_plan,
      prescriptions,
      lab_request,
      notes,
      symptoms,
      diagnosis,
      prescribed_medications,
      follow_up_plan,
      body_temperature,
      systolic,
      diastolic,
      heartRate,
      respiratory_rate,
      oxygen_saturation,
      weight,
      height,
    } = data;

    // Create medical record
    const medicalRecord = await db.medicalRecords.create({
      data: {
        patient_id: patientId,
        appointment_id: appointmentId,
        doctor_id: doctorId,
        treatment_plan,
        prescriptions,
        lab_request,
        notes,
      },
    });

    // Create diagnosis
    await db.diagnosis.create({
      data: {
        patient_id: patientId,
        medical_id: medicalRecord.id,
        doctor_id: doctorId,
        symptoms: symptoms || "",
        diagnosis: diagnosis || "",
        prescribed_medications,
        follow_up_plan,
      },
    });

    // Create vital signs
    await db.vitalSigns.create({
      data: {
        patient_id: patientId,
        medical_id: medicalRecord.id,
        body_temperature: body_temperature ?? 0,
        systolic: systolic ?? 0,
        diastolic: diastolic ?? 0,
        heartRate: heartRate?.toString() ?? "0",
        respiratory_rate,
        oxygen_saturation,
        weight: weight ?? 0,
        height: height ?? 0,
      },
    });

    // Update appointment status to completed
    await db.appointment.update({
      where: { id: appointmentId },
      data: { status: "COMPLETED" },
    });

    return {
      success: true,
      message: "Medical record created successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to create medical record",
    };
  }
}
