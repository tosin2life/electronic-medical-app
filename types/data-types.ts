import type { AppointmentStatus, Doctor, Patient, Gender } from "@prisma/client";

export type AppointmentsChartProps = {
  name: string;
  appointment: number;
  completed: number;
}[];

export type Appointment = {
  id: number;
  patient_id: string;
  doctor_id: string;
  type: string;
  appointment_date: Date;
  time: string;
  status: AppointmentStatus;

  patient: Patient;
  doctor: Doctor;
};

export type AppointmentWithDetails = {
  id: number;
  patient_id: string;
  doctor_id: string;
  type: string;
  appointment_date: Date;
  time: string;
  status: AppointmentStatus;

  patient: {
    id: string;
    first_name: string;
    last_name: string;
    date_of_birth?: Date;
    gender: Gender;
    img: string | null;
    colorCode: string | null;
  };
  doctor: {
    name: string;
    img: string | null;
    colorCode: string | null;
    specialization: string;
  };
};

export type AvailableDoctorProps = {
  id: string;
  name: string;
  specialization: string;
  img?: string | null;
  colorCode?: string | null;
  working_days: {
    day: string;
    start_time: string;
    close_time: string;
  }[];
}[];
