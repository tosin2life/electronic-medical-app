import React from "react";
import { getDoctorById } from "@/utils/services/doctor";
import { getRatingById } from "@/utils/services/doctor";
import { ProfileImage } from "@/components/profile-image";
import { FaBriefcaseMedical, FaCalendarDays } from "react-icons/fa6";
import { BsPersonWorkspace } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import { MdLocalPhone } from "react-icons/md";
import { IoTimeSharp } from "react-icons/io5";
import { BsCalendarDateFill } from "react-icons/bs";
import { format } from "date-fns";
import { RecentAppointments } from "@/components/tables/recent-appointment";
import { RatingContainer } from "@/components/rating-container";
import Link from "next/link";
import { availableDays } from "@/components/available-doctor";

interface ParamsProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DoctorProfile({ params }: ParamsProps) {
  // Get the id from the URL params
  const { id } = await params;

  // Fetch doctor data using the getDoctorById API
  const { data: doctor, totalAppointment } = await getDoctorById(id);

  // Fetch doctor ratings
  const { totalRatings, averageRating, ratings } = await getRatingById(id);

  if (!doctor) {
    return <div>Doctor not found</div>;
  }

  return (
    <div className="bg-gray-100/60 h-full rounded-xl py-6 px-3 2xl:px-5 flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-[70%]">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="bg-blue-50 py-6 px-4 rounded-md flex-1 flex gap-4">
            <ProfileImage
              url={doctor?.img!}
              name={doctor?.name}
              className="size-20"
              bgColor={doctor?.colorCode!}
              textClassName="text-4xl text-black"
            />

            <div className="w-2/3 flex flex-col justify-between gap-x-4">
              <div className="flex items-center gap-4">
                <h1 className="text=xl font-semibold uppercase">
                  {doctor?.name}
                </h1>
              </div>
              <p className="text-sm text-gray-500">
                {doctor?.address || "No address information"}
              </p>

              <div className="mt-4 flex items-center gap-4 flex-wrap text-sm font-medium">
                <div className="flex items-center gap-2">
                  <span>License #:</span>
                  <p className="font-semibold">{doctor?.license_number}</p>
                </div>

                <div className="flex items-center gap-2">
                  <FaBriefcaseMedical className="text-lg" />
                  <span className="capitalize">{doctor?.specialization}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BsPersonWorkspace className="text-lg" />
                  <span className="capitalize">{doctor?.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MdEmail className="text-lg" />
                  <span className="capitalize">{doctor?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MdLocalPhone className="text-lg" />
                  <span className="capitalize">{doctor?.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SATS */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            <div className="doctorCard">
              <FaBriefcaseMedical className="size-5" />
              <div>
                <h1 className="text-xl font-serif">{totalAppointment}</h1>
                <span className="text-sm text-gray-500">Appointments</span>
              </div>
            </div>
            <div className="doctorCard">
              <FaCalendarDays className="size-5" />
              <div>
                <h1 className="text-xl font-serif">
                  {doctor?.working_days?.length}
                </h1>
                <span className="text-sm text-gray-500">Working Days</span>
              </div>
            </div>

            <div className="doctorCard">
              <IoTimeSharp className="size-5" />
              <div>
                <h1 className="text-xl font-serif">
                  {availableDays({ data: doctor.working_days })}
                </h1>
                <span className="text-sm text-gray-500">Working Hours</span>
              </div>
            </div>
            <div className="doctorCard">
              <BsCalendarDateFill className="size-5" />
              <div>
                <h1 className="text-xl font-serif">
                  {format(doctor?.created_at, "yyyy-MM-dd")}
                </h1>
                <span className="text-sm text-gray-500">Joined Date</span>
              </div>
            </div>
          </div>
        </div>

        {/* recent appointment */}
        <div className="bg-white rounded-e-xl p-4 mt-6">
          <RecentAppointments data={doctor?.appointments} />
        </div>
      </div>

      {/* RIGHT SIDE */}

      <div className="w-full lg:w-[30%] flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Quick Links</h1>

          <div className="mt-8 flex gap-4 flex-wrap text-sm text-gray-500">
            <Link
              href={`/record/appointments?id=${doctor?.id}`}
              className="p-3 rounded-md bg-yellow-60 hover:underline"
            >
              Doctor Appointments
            </Link>

            <Link
              href="#"
              className="p-3 rounded-md bg-purple-50 hover:underline"
            >
              Apply for Leave
            </Link>
          </div>
        </div>

        <RatingContainer id={id} />
      </div>
    </div>
  );
}
