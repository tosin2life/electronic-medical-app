"use client";

import { BillingForm } from "@/components/forms/billing-form";
import { ArrowLeft, Receipt } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface BillingPageProps {
  params: Promise<{ id: string }>;
}

export default function BillingPage({ params }: BillingPageProps) {
  const router = useRouter();
  const [appointment, setAppointment] = useState<any>(null);
  const [billing, setBilling] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { id } = await params;

        // Fetch appointment data
        const appointmentResponse = await fetch(`/api/appointments/${id}`);
        const appointmentData = await appointmentResponse.json();

        if (appointmentData.success) {
          setAppointment(appointmentData.data);
        }

        // Fetch billing data
        const billingResponse = await fetch(`/api/billing/appointment/${id}`);
        const billingData = await billingResponse.json();

        if (billingData.success) {
          setBilling(billingData.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params]);

  const handleSuccess = () => {
    // Refresh the page to show the new billing
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Appointment not found</p>
      </div>
    );
  }

  const { id } = appointment;

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
          <h1 className="text-2xl font-bold">Billing - Appointment #{id}</h1>
        </div>
      </div>

      {/* Existing Billing */}
      {billing && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Receipt size={20} />
            <h2 className="text-lg font-semibold">Existing Bill</h2>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Amount:</span>
              <span className="font-semibold">
                ${billing.total_amount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span
                className={`font-semibold ${
                  billing.status === "PAID"
                    ? "text-green-600"
                    : billing.status === "UNPAID"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {billing.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Amount Paid:</span>
              <span>${billing.amount_paid.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Create New Bill */}
      {!billing && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <BillingForm
            appointmentId={parseInt(id)}
            patientId={appointment.patient_id}
            onSuccess={handleSuccess}
          />
        </div>
      )}
    </div>
  );
}
