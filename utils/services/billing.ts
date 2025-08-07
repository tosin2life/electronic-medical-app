import db from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function createBillingRecord({
  appointmentId,
  patientId,
  services,
  discount = 0,
  taxRate = 0,
  notes = "",
}: {
  appointmentId: number;
  patientId: string;
  services: Array<{
    serviceId: number;
    quantity: number;
    medicationName?: string;
    dosage?: string;
    instructions?: string;
  }>;
  discount?: number;
  taxRate?: number;
  notes?: string;
}) {
  try {
    // Get services with prices
    const serviceDetails = await db.services.findMany({
      where: {
        id: { in: services.map((s) => s.serviceId) },
      },
    });

    // Calculate totals
    let subtotal = 0;
    const billItems = [];

    for (const service of services) {
      const serviceDetail = serviceDetails.find(
        (s) => s.id === service.serviceId
      );
      if (!serviceDetail) continue;

      const totalCost = serviceDetail.price * service.quantity;
      subtotal += totalCost;

      billItems.push({
        serviceId: service.serviceId,
        quantity: service.quantity,
        unitCost: serviceDetail.price,
        totalCost,
        medicationName: service.medicationName,
        dosage: service.dosage,
        instructions: service.instructions,
      });
    }

    const taxAmount = subtotal * (taxRate / 100);
    const totalAmount = subtotal + taxAmount - discount;

    // Create payment record
    const payment = await db.payment.create({
      data: {
        patient_id: patientId,
        appointment_id: appointmentId,
        bill_date: new Date(),
        payment_date: new Date(),
        discount,
        total_amount: totalAmount,
        amount_paid: 0,
        tax_amount: taxAmount,
        subtotal,
        notes,
      },
    });

    // Create bill items
    for (const item of billItems) {
      await db.patientBills.create({
        data: {
          bill_id: payment.id,
          service_id: item.serviceId,
          service_date: new Date(),
          quantity: item.quantity,
          unit_cost: item.unitCost,
          total_cost: item.totalCost,
          medication_name: item.medicationName,
          dosage: item.dosage,
          instructions: item.instructions,
        },
      });
    }

    return {
      success: true,
      data: payment,
      message: "Billing record created successfully",
    };
  } catch (error) {
    console.error("Error creating billing record:", error);
    return {
      success: false,
      message: "Failed to create billing record",
    };
  }
}

export async function getBillingByAppointment(appointmentId: number) {
  try {
    const billing = await db.payment.findUnique({
      where: { appointment_id: appointmentId },
      include: {
        patient: true,
        bills: {
          include: {
            service: true,
          },
        },
      },
    });

    return {
      success: true,
      data: billing,
    };
  } catch (error) {
    console.error("Error fetching billing:", error);
    return {
      success: false,
      message: "Failed to fetch billing information",
    };
  }
}

export async function updatePaymentStatus(
  paymentId: number,
  status: string,
  amountPaid: number
) {
  try {
    const payment = await db.payment.update({
      where: { id: paymentId },
      data: {
        status: status as any,
        amount_paid: amountPaid,
        payment_date: new Date(),
      },
    });

    return {
      success: true,
      data: payment,
    };
  } catch (error) {
    console.error("Error updating payment:", error);
    return {
      success: false,
      message: "Failed to update payment",
    };
  }
}

export async function getServicesByType(serviceType?: string) {
  try {
    const whereClause = serviceType ? { service_type: serviceType as any } : {};

    const services = await db.services.findMany({
      where: whereClause,
      orderBy: { service_name: "asc" },
    });

    return {
      success: true,
      data: services,
    };
  } catch (error) {
    console.error("Error fetching services:", error);
    return {
      success: false,
      message: "Failed to fetch services",
    };
  }
}
