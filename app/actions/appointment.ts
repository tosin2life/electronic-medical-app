"use server";

// import { VitalSignsFormData } from "@/components/dialogs/add-vital-signs";
import db from "@/lib/db";
import { AppointmentSchema } from "@/lib/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
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
export async function createNewAppointment(data: any) {
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

export async function createMedicalRecord(data: any) {
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
        symptoms,
        diagnosis,
        prescribed_medications,
        follow_up_plan,
      },
    });

    // Create vital signs
    await db.vitalSigns.create({
      data: {
        patient_id: patientId,
        medical_id: medicalRecord.id,
        body_temperature,
        systolic,
        diastolic,
        heartRate,
        respiratory_rate,
        oxygen_saturation,
        weight,
        height,
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
