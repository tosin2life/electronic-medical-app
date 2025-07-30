"use client";

import { PatientFormSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { Form } from "../ui/form";
import { CustomInput } from "../custom-input";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { createPatientFromForm } from "@/app/actions/patient";

const GENDERS = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
];

const MARITAL_STATUS = [
  { label: "Single", value: "single" },
  { label: "Married", value: "married" },
  { label: "Divorced", value: "divorced" },
  { label: "Widowed", value: "widowed" },
  { label: "Separated", value: "separated" },
];

const RELATIONS = [
  { label: "Mother", value: "mother" },
  { label: "Father", value: "father" },
  { label: "Husband", value: "husband" },
  { label: "Wife", value: "wife" },
  { label: "Other", value: "other" },
];

const BLOOD_GROUPS = [
  { label: "A+", value: "A+" },
  { label: "A-", value: "A-" },
  { label: "B+", value: "B+" },
  { label: "B-", value: "B-" },
  { label: "AB+", value: "AB+" },
  { label: "AB-", value: "AB-" },
  { label: "O+", value: "O+" },
  { label: "O-", value: "O-" },
];

export const PatientForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof PatientFormSchema>>({
    resolver: zodResolver(PatientFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      date_of_birth: new Date(),
      gender: "MALE",
      phone: "",
      email: "",
      address: "",
      marital_status: "single",
      emergency_contact_name: "",
      emergency_contact_number: "",
      relation: "mother",
      blood_group: "",
      allergies: "",
      medical_conditions: "",
      medical_history: "",
      insurance_provider: "",
      insurance_number: "",
      img: "",
      privacy_consent: false,
      service_consent: false,
      medical_consent: false,
    },
  });

  const handleSubmit = async (values: any) => {
    try {
      setIsLoading(true);
      const resp = await createPatientFromForm(values);

      if (resp.success) {
        toast.success("Patient added successfully!");
        form.reset();
        router.refresh();
      } else if (resp.error) {
        toast.error(resp.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <Plus size={20} />
          Add Patient
        </Button>
      </SheetTrigger>

      <SheetContent className="rounded-xl rounded-r-xl md:h-[90%] md:top-[5%] md:right-[1%] w-full overflow-y-scroll">
        <SheetHeader>
          <SheetTitle>Add New Patient</SheetTitle>
        </SheetHeader>

        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8 px-5 mb-5 2xl:mb-10"
            >
              <div className="flex items-center gap-2">
                <CustomInput
                  type="input"
                  control={form.control}
                  name="first_name"
                  placeholder="First name"
                  label="First Name"
                />
                <CustomInput
                  type="input"
                  control={form.control}
                  name="last_name"
                  placeholder="Last name"
                  label="Last Name"
                />
              </div>

              <div className="flex items-center gap-2">
                <CustomInput
                  type="input"
                  control={form.control}
                  name="date_of_birth"
                  placeholder=""
                  label="Date of Birth"
                  inputType="date"
                />
                <CustomInput
                  type="radio"
                  selectList={GENDERS}
                  control={form.control}
                  name="gender"
                  label="Gender"
                  placeholder=""
                />
              </div>

              <div className="flex items-center gap-2">
                <CustomInput
                  type="input"
                  control={form.control}
                  name="phone"
                  placeholder="Phone number"
                  label="Phone Number"
                />
                <CustomInput
                  type="input"
                  control={form.control}
                  name="email"
                  placeholder="Email address"
                  label="Email Address"
                />
              </div>

              <CustomInput
                type="input"
                control={form.control}
                name="address"
                placeholder="Address"
                label="Address"
              />

              <div className="flex items-center gap-2">
                <CustomInput
                  type="select"
                  selectList={MARITAL_STATUS}
                  control={form.control}
                  name="marital_status"
                  placeholder="Select marital status"
                  label="Marital Status"
                />
                <CustomInput
                  type="select"
                  selectList={BLOOD_GROUPS}
                  control={form.control}
                  name="blood_group"
                  placeholder="Select blood group"
                  label="Blood Group"
                />
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-medium">Emergency Contact</Label>
                <div className="flex items-center gap-2">
                  <CustomInput
                    type="input"
                    control={form.control}
                    name="emergency_contact_name"
                    placeholder="Emergency contact name"
                    label="Contact Name"
                  />
                  <CustomInput
                    type="input"
                    control={form.control}
                    name="emergency_contact_number"
                    placeholder="Emergency contact number"
                    label="Contact Number"
                  />
                </div>
                <CustomInput
                  type="select"
                  selectList={RELATIONS}
                  control={form.control}
                  name="relation"
                  placeholder="Select relation"
                  label="Relation"
                />
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-medium">
                  Medical Information
                </Label>
                <CustomInput
                  type="input"
                  control={form.control}
                  name="allergies"
                  placeholder="Any allergies"
                  label="Allergies"
                />
                <CustomInput
                  type="input"
                  control={form.control}
                  name="medical_conditions"
                  placeholder="Medical conditions"
                  label="Medical Conditions"
                />
                <CustomInput
                  type="input"
                  control={form.control}
                  name="medical_history"
                  placeholder="Medical history"
                  label="Medical History"
                />
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-medium">
                  Insurance Information
                </Label>
                <div className="flex items-center gap-2">
                  <CustomInput
                    type="input"
                    control={form.control}
                    name="insurance_provider"
                    placeholder="Insurance provider"
                    label="Provider"
                  />
                  <CustomInput
                    type="input"
                    control={form.control}
                    name="insurance_number"
                    placeholder="Insurance number"
                    label="Policy Number"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-medium">Consent</Label>
                <div className="space-y-2">
                  <CustomInput
                    type="checkbox"
                    control={form.control}
                    name="privacy_consent"
                    label="I agree to the privacy policy"
                  />
                  <CustomInput
                    type="checkbox"
                    control={form.control}
                    name="service_consent"
                    label="I agree to the terms of service"
                  />
                  <CustomInput
                    type="checkbox"
                    control={form.control}
                    name="medical_consent"
                    label="I agree to medical treatment terms"
                  />
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};
