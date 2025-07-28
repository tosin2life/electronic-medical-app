import { AvailableDoctors } from "@/components/available-doctor";
import { AppointmentChart } from "@/components/charts/appointment-chart";
import { StatSummary } from "@/components/charts/stat-summary";
import { StatCard } from "@/components/stat-card";
import { RecentAppointments } from "@/components/tables/recent-appointment";
import { Button } from "@/components/ui/button";
import { getDoctorDashboardStats } from "@/utils/services/doctor";
import { currentUser } from "@clerk/nextjs/server";
import { syncUserWithDatabase } from "@/app/actions/auth";
import { BriefcaseBusiness, BriefcaseMedical, User, Users } from "lucide-react";
import Link from "next/link";
import React from "react";

export default async function DoctorDashboard() {
  const user = await currentUser();

  // Sync user with database if needed
  if (user) {
    await syncUserWithDatabase();
  }

  const {
    totalNurses,
    totalPatient,
    appointmentCounts,
    availableDoctors,
    monthlyData,
    totalAppointment,
    last5Records,
  } = await getDoctorDashboardStats();

  const cardData = [
    {
      title: "Patients",
      value: totalPatient,
      icon: Users,
      className: "bg-blue-600/15",
      iconClassName: "bg-blue-600/25 text-blue-600",
      note: "Total patients",
      link: "/record/patients",
    },
    {
      title: "Nurses",
      value: totalNurses,
      icon: User,
      className: "bg-rose-600/15",
      iconClassName: "bg-rose-600/25 text-rose-600",
      note: "Total nurses",
      link: "",
    },
    {
      title: "Appointments",
      value: totalAppointment,
      icon: BriefcaseBusiness,
      className: "bg-yellow-600/15",
      iconClassName: "bg-yellow-600/25 text-yellow-600",
      note: "Total appointments",
      link: "/record/appointments",
    },
    {
      title: "Consultation",
      value: appointmentCounts?.COMPLETED,
      icon: BriefcaseMedical,
      className: "bg-emerald-600/15",
      iconClassName: "bg-emerald-600/25 text-emerald-600",
      note: "Total consultation",
      link: "/record/appointments",
    },
  ];

  return (
    <div className="rounded-xl py-6 px-3 flex flex-col xl:flex-row gap-6">
      {/* LEFT */}
      <div className="w-full xl:w-[69%]">
        <div className="bg-white rounded-xl p-4 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-lg xl:text-2xl font-semibold">
              Welcome, Dr. {user?.firstName}
            </h1>
            <Button size="sm" variant="outline" asChild>
              <Link href={`/record/doctors/${user?.id}`}>View profile</Link>
            </Button>
          </div>

          <div className="w-full flex flex-wrap gap-2">
            {cardData?.map((el, index) => (
              <StatCard
                key={index}
                title={el?.title}
                value={el?.value!}
                icon={el?.icon}
                className={el?.className}
                iconClassName={el?.iconClassName}
                note={el?.note}
                link={el?.link}
              />
            ))}
          </div>
        </div>

        <div className="h-[500px]">
          <AppointmentChart data={monthlyData!} />
        </div>

        <div className="bg-white rounded-xl p-4 mt-8">
          <RecentAppointments data={last5Records!} />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full xl:w-[30%]">
        <div className="w-full h-[450px] mb-8">
          <StatSummary data={appointmentCounts} total={totalAppointment!} />
        </div>

        <AvailableDoctors data={availableDoctors as any} />
      </div>
    </div>
  );
}
