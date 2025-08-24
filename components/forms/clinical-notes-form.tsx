"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CustomInput } from "@/components/custom-input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createMedicalRecord } from "@/app/actions/appointment";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const ClinicalNotesSchema = z.object({
  treatment_plan: z.string().min(1, "Treatment plan is required"),
  prescriptions: z.string().optional(),
  lab_request: z.string().optional(),
  notes: z.string().optional(),
  symptoms: z.string().min(1, "Symptoms are required"),
  diagnosis: z.string().min(1, "Diagnosis is required"),
  prescribed_medications: z.string().optional(),
  follow_up_plan: z.string().optional(),
  // Vital signs
  body_temperature: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? parseFloat(val) || 0 : val))
    .pipe(
      z
        .number()
        .min(35, "Temperature must be at least 35°C")
        .max(42, "Temperature must be at most 42°C")
    ),
  systolic: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? parseFloat(val) || 0 : val))
    .pipe(
      z
        .number()
        .min(70, "Systolic must be at least 70")
        .max(200, "Systolic must be at most 200")
    ),
  diastolic: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? parseFloat(val) || 0 : val))
    .pipe(
      z
        .number()
        .min(40, "Diastolic must be at least 40")
        .max(120, "Diastolic must be at most 120")
    ),
  heartRate: z.string().min(1, "Heart rate is required"),
  respiratory_rate: z
    .union([z.string(), z.number()])
    .transform((val) =>
      typeof val === "string" ? parseFloat(val) || undefined : val
    )
    .pipe(z.number().optional()),
  oxygen_saturation: z
    .union([z.string(), z.number()])
    .transform((val) =>
      typeof val === "string" ? parseFloat(val) || undefined : val
    )
    .pipe(z.number().optional()),
  weight: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? parseFloat(val) || 0 : val))
    .pipe(
      z
        .number()
        .min(20, "Weight must be at least 20kg")
        .max(300, "Weight must be at most 300kg")
    ),
  height: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? parseFloat(val) || 0 : val))
    .pipe(
      z
        .number()
        .min(100, "Height must be at least 100cm")
        .max(250, "Height must be at most 250cm")
    ),
});

type ClinicalNotesFormData = z.infer<typeof ClinicalNotesSchema>;

// Input type for form (before validation)
type ClinicalNotesInput = {
  treatment_plan: string;
  prescriptions?: string;
  lab_request?: string;
  notes?: string;
  symptoms: string;
  diagnosis: string;
  prescribed_medications?: string;
  follow_up_plan?: string;
  body_temperature: string | number;
  systolic: string | number;
  diastolic: string | number;
  heartRate: string;
  respiratory_rate: string | number | undefined;
  oxygen_saturation: string | number | undefined;
  weight: string | number;
  height: string | number;
};

interface ClinicalNotesFormProps {
  appointmentId: number;
  patientId: string;
  doctorId: string;
}

export const ClinicalNotesForm = ({
  appointmentId,
  patientId,
  doctorId,
}: ClinicalNotesFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(ClinicalNotesSchema),
    defaultValues: {
      treatment_plan: "",
      prescriptions: "",
      lab_request: "",
      notes: "",
      symptoms: "",
      diagnosis: "",
      prescribed_medications: "",
      follow_up_plan: "",
      body_temperature: 37.0,
      systolic: 120,
      diastolic: 80,
      heartRate: "",
      respiratory_rate: 16,
      oxygen_saturation: 98,
      weight: 70,
      height: 170,
    },
  });

  const handleSubmit = async (values: any) => {
    try {
      setIsLoading(true);
      const resp = await createMedicalRecord({
        appointmentId,
        patientId,
        doctorId,
        ...values,
      });

      if (resp.success) {
        toast.success("Clinical notes saved successfully!");
        form.reset();
        // Redirect back to appointment details
        router.push(`/record/appointments/${appointmentId}`);
      } else {
        toast.error(resp.message || "Failed to save clinical notes");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Vital Signs Section */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Vital Signs</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <CustomInput
                type="input"
                control={form.control}
                name="body_temperature"
                placeholder="37.0"
                label="Temperature (°C)"
                inputType="number"
                step="0.1"
              />
              <CustomInput
                type="input"
                control={form.control}
                name="systolic"
                placeholder="120"
                label="Systolic (mmHg)"
                inputType="number"
              />
              <CustomInput
                type="input"
                control={form.control}
                name="diastolic"
                placeholder="80"
                label="Diastolic (mmHg)"
                inputType="number"
              />
              <CustomInput
                type="input"
                control={form.control}
                name="heartRate"
                placeholder="72 bpm"
                label="Heart Rate"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <CustomInput
                type="input"
                control={form.control}
                name="respiratory_rate"
                placeholder="16"
                label="Respiratory Rate"
                inputType="number"
              />
              <CustomInput
                type="input"
                control={form.control}
                name="oxygen_saturation"
                placeholder="98"
                label="O2 Saturation (%)"
                inputType="number"
              />
              <CustomInput
                type="input"
                control={form.control}
                name="weight"
                placeholder="70"
                label="Weight (kg)"
                inputType="number"
                step="0.1"
              />
              <CustomInput
                type="input"
                control={form.control}
                name="height"
                placeholder="170"
                label="Height (cm)"
                inputType="number"
              />
            </div>
          </div>

          {/* Symptoms */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Symptoms</Label>
            <CustomInput
              type="textarea"
              control={form.control}
              name="symptoms"
              placeholder="Patient symptoms"
              label="Symptoms"
            />
          </div>

          {/* Observation */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Observation</Label>
            <CustomInput
              type="textarea"
              control={form.control}
              name="notes"
              placeholder="Additional clinical notes"
              label="Clinical Notes"
            />
          </div>

          {/* Diagnosis Section */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Diagnosis</Label>
            <CustomInput
              type="input"
              control={form.control}
              name="diagnosis"
              placeholder="Medical diagnosis"
              label="Diagnosis"
            />
          </div>
          {/* Lab Request */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Lab Request</Label>
            <CustomInput
              type="textarea"
              control={form.control}
              name="lab_request"
              placeholder="Laboratory tests requested"
              label="Lab Requests"
            />
          </div>

          {/* Treatment Section */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Treatment</Label>
            <CustomInput
              type="textarea"
              control={form.control}
              name="treatment_plan"
              placeholder="Treatment plan details"
              label="Treatment Plan"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomInput
                type="input"
                control={form.control}
                name="prescribed_medications"
                placeholder="Prescribed medications"
                label="Medications"
              />
              <CustomInput
                type="input"
                control={form.control}
                name="follow_up_plan"
                placeholder="Follow-up instructions"
                label="Follow-up Plan"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Clinical Notes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
