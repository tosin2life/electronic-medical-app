import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import db from "@/lib/db";
import { generateRandomColor } from "@/utils";

const prisma = new PrismaClient();

async function seed() {
  // Create Doctors
  const doctors = [];
  for (let i = 0; i < 5; i++) {
    const doctor = await prisma.doctor.create({
      data: {
        id: `doctor_${i + 1}`,
        email: faker.internet.email(),
        name: faker.person.fullName(),
        specialization: faker.helpers.arrayElement([
          "Cardiology",
          "Neurology",
          "Orthopedics",
          "Pediatrics",
          "Dermatology",
        ]),
        license_number: faker.string.alphanumeric(8).toUpperCase(),
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        department: faker.helpers.arrayElement([
          "Emergency",
          "Surgery",
          "Outpatient",
          "Inpatient",
        ]),
        colorCode: generateRandomColor(),
      },
    });

    doctors.push(doctor);
  }

  // Create Staff
  for (let i = 0; i < 10; i++) {
    await prisma.staff.create({
      data: {
        id: `staff_${i + 1}`,
        email: faker.internet.email(),
        name: faker.person.fullName(),
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        department: faker.helpers.arrayElement([
          "Nursing",
          "Administration",
          "Laboratory",
          "Pharmacy",
        ]),
        role: faker.helpers.arrayElement([
          "ADMIN",
          "NURSE",
          "LAB_TECHNICIAN",
          "CASHIER",
        ]),
        colorCode: generateRandomColor(),
      },
    });
  }

  // Create Patients
  const patients = [];
  for (let i = 0; i < 50; i++) {
    const patient = await prisma.patient.create({
      data: {
        id: `patient_${i + 1}`,
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        date_of_birth: faker.date.birthdate(),
        gender: i % 2 === 0 ? "MALE" : "FEMALE",
        phone: faker.phone.number(),
        email: faker.internet.email(),
        marital_status: i % 3 === 0 ? "Married" : "Single",
        address: faker.location.streetAddress(),
        emergency_contact_name: faker.person.fullName(),
        emergency_contact_number: faker.phone.number(),
        relation: "Sibling",
        blood_group: i % 4 === 0 ? "O+" : "A+",
        allergies: faker.lorem.words(2),
        medical_conditions: faker.lorem.words(3),
        privacy_consent: true,
        service_consent: true,
        medical_consent: true,
        colorCode: generateRandomColor(),
      },
    });

    patients.push(patient);
  }

  // Create Appointments
  for (let i = 0; i < 20; i++) {
    const doctor = doctors[Math.floor(Math.random() * doctors.length)];
    const patient = patients[Math.floor(Math.random() * patients.length)];

    await prisma.appointment.create({
      data: {
        patient_id: patient.id,
        doctor_id: doctor.id,
        appointment_date: faker.date.soon(),
        time: "10:00",
        status: i % 4 === 0 ? "PENDING" : "SCHEDULED",
        type: "Checkup",
        reason: faker.lorem.sentence(),
      },
    });
  }

  // Add billing services
  const billingServices = [
    {
      service_name: "General Consultation",
      description: "Standard doctor consultation",
      price: 50.0,
      service_type: "CONSULTATION",
    },
    {
      service_name: "Specialist Consultation",
      description: "Specialist doctor consultation",
      price: 100.0,
      service_type: "CONSULTATION",
    },
    {
      service_name: "Amoxicillin 500mg",
      description: "Antibiotic medication",
      price: 15.0,
      service_type: "MEDICATION",
    },
    {
      service_name: "Ibuprofen 400mg",
      description: "Pain relief medication",
      price: 8.0,
      service_type: "MEDICATION",
    },
    {
      service_name: "Blood Test",
      description: "Complete blood count",
      price: 25.0,
      service_type: "LAB_TEST",
    },
    {
      service_name: "X-Ray",
      description: "Chest X-Ray examination",
      price: 75.0,
      service_type: "PROCEDURE",
    },
  ];

  // Add services to database
  for (const service of billingServices) {
    await db.services.create({
      data: service,
    });
  }

  console.log("Seeding complete!");
  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
