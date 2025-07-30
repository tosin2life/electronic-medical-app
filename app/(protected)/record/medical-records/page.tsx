// import { ViewAction } from "@/components/action-options";
// import { Pagination } from "@/components/pagination";
// import { ProfileImage } from "@/components/profile-image";
// import SearchInput from "@/components/search-input";
// import { Table } from "@/components/tables/table";
// import { SearchParamsProps } from "@/types";
// import { checkRole } from "@/utils/roles";
// import { DATA_LIMIT } from "@/utils/settings";
// import { getMedicalRecords } from "@/utils/services/medical-record";
// import { Diagnosis, LabTest, MedicalRecords, Patient } from "@prisma/client";
// import { format } from "date-fns";
// import { BriefcaseBusiness } from "lucide-react";

// const columns = [
//   {
//     header: "No",
//     key: "no",
//   },
//   {
//     header: "Info",
//     key: "name",
//   },
//   {
//     header: "Date & Time",
//     key: "medical_date",
//     className: "hidden md:table-cell",
//   },
//   {
//     header: "Doctor",
//     key: "doctor",
//     className: "hidden 2xl:table-cell",
//   },
//   {
//     header: "Diagnosis",
//     key: "diagnosis",
//     className: "hidden lg:table-cell",
//   },
//   {
//     header: "Lab Test",
//     key: "lab_test",
//     className: "hidden 2xl:table-cell",
//   },
//   {
//     header: "Action",
//     key: "action",
//     className: "",
//   },
// ];

// interface ExtendedProps extends MedicalRecords {
//   patient: Patient;
//   diagnosis: Diagnosis[];
//   lab_test: LabTest[];
// }

// const MedicalRecordsPage = async (props: SearchParamsProps) => {
//   const searchParams = await props.searchParams;
//   const page = (searchParams?.p || "1") as string;
//   const searchQuery = (searchParams?.q || "") as string;

//   const { data, totalPages, totalRecords, currentPage } =
//     await getMedicalRecords({
//       page,
//       search: searchQuery,
//     });
//   const isAdmin = await checkRole("ADMIN");

//   if (!data) return null;

//   const renderRow = (item: ExtendedProps) => {
//     const name = item?.patient?.first_name + " " + item?.patient?.last_name;
//     const patient = item?.patient;

//     return (
//       <tr
//         key={item?.id}
//         className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-slate-50"
//       >
//         <td className="flex items-center gap-4 p-4">
//           <ProfileImage
//             url={item?.patient?.img!}
//             name={name}
//             bgColor={patient?.colorCode!}
//             textClassName="text-black"
//           />
//           <div>
//             <h3 className="uppercase">{name}</h3>
//             <span className="text-sm capitalize">{patient?.gender}</span>
//           </div>
//         </td>
//         <td className="hidden md:table-cell">
//           {format(item?.created_at, "yyyy-MM-dd HH:mm:ss")}
//         </td>
//         <td className="hidden 2xl:table-cell">{item?.doctor_id}</td>
//         <td className="hidden lg:table-cell">
//           {item?.diagnosis?.length === 0 ? (
//             <span className="text-gray-400 italic">No diagnosis found</span>
//           ) : (
//             <span>{item?.diagnosis.length}</span>
//           )}
//         </td>
//         <td className="hidden xl:table-cell">
//           {item?.lab_test?.length === 0 ? (
//             <span className="text-gray-400 italic">No lab found</span>
//           ) : (
//             <span>{item?.lab_test.length}</span>
//           )}
//         </td>

//         <td>
//           <ViewAction href={`/appointments/${item?.appointment_id}`} />
//         </td>
//       </tr>
//     );
//   };

//   return (
//     <div className="bg-white rounded-xl py-6 px-3 2xl:px-6">
//       <div className="flex items-center justify-between">
//         <div className="hidden lg:flex items-center gap-1">
//           <BriefcaseBusiness size={20} className="text-gray-500" />

//           <p className="text-2xl font-semibold">{totalRecords}</p>
//           <span className="text-gray-600 text-sm xl:text-base">
//             total records
//           </span>
//         </div>
//         <div className="w-full lg:w-fit flex items-center justify-between lg:justify-start gap-2">
//           <SearchInput />
//         </div>
//       </div>

//       <div className="mt-4">
//         <Table columns={columns} data={data} renderRow={renderRow} />

//         <Pagination
//           totalPages={totalPages}
//           currentPage={currentPage}
//           totalRecords={totalRecords}
//           limit={DATA_LIMIT}
//         />
//       </div>
//     </div>
//   );
// };

// export default MedicalRecordsPage;
import { ActionDialog } from "@/components/action-dialog";
import { ViewAction } from "@/components/action-options";
import { Pagination } from "@/components/pagination";
import { ProfileImage } from "@/components/profile-image";
import SearchInput from "@/components/search-input";
import { Table } from "@/components/tables/table";
import { SearchParamsProps } from "@/types";
import { checkRole } from "@/utils/roles";
import { getAllMedicalRecords } from "@/utils/services/medical";
import { DATA_LIMIT } from "@/utils/settings";
import {
  MedicalRecords,
  Patient,
  Doctor,
  Appointment,
  Diagnosis,
} from "@prisma/client";
import { format } from "date-fns";
import { FileText, User, Calendar } from "lucide-react";
import React from "react";

interface MedicalRecordWithRelations extends MedicalRecords {
  patient: Patient;
  appointment: Appointment & {
    doctor: Doctor;
  };
  diagnosis: Diagnosis[];
}

const columns = [
  {
    header: "Patient Info",
    key: "patient",
  },
  {
    header: "Doctor",
    key: "doctor",
    className: "hidden md:table-cell",
  },
  {
    header: "Treatment Plan",
    key: "treatment",
    className: "hidden lg:table-cell",
  },
  {
    header: "Diagnosis",
    key: "diagnosis",
    className: "hidden xl:table-cell",
  },
  {
    header: "Created Date",
    key: "created_at",
    className: "hidden xl:table-cell",
  },
  {
    header: "Actions",
    key: "action",
  },
];

export default async function MedicalRecordsList(props: SearchParamsProps) {
  const searchParams = await props.searchParams;
  const page = (searchParams?.p || "1") as string;
  const searchQuery = (searchParams?.q || "") as string;

  const { data, totalPages, totalRecords, currentPage } =
    await getAllMedicalRecords({
      page: parseInt(page),
      search: searchQuery,
    });

  if (!data) return null;
  const isAdmin = await checkRole("ADMIN");
  const isDoctor = await checkRole("DOCTOR");

  const renderRow = (record: MedicalRecordWithRelations) => (
    <tr
      key={record?.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-slate-50"
    >
      <td className="flex items-center gap-4 p-4">
        <ProfileImage
          url={record?.patient?.img!}
          name={`${record?.patient?.first_name} ${record?.patient?.last_name}`}
          bgColor={record?.patient?.colorCode!}
          textClassName="text-black"
        />
        <div>
          <h3 className="font-medium">
            {record?.patient?.first_name} {record?.patient?.last_name}
          </h3>
          <span className="text-sm text-gray-600">
            ID: {record?.patient?.id.slice(-6)}
          </span>
        </div>
      </td>
      <td className="hidden md:table-cell">
        <div className="flex items-center gap-2">
          <ProfileImage
            url={record?.appointment?.doctor?.img!}
            name={record?.appointment?.doctor?.name}
            bgColor={record?.appointment?.doctor?.colorCode!}
            textClassName="text-black"
          />
          <span className="text-sm">{record?.appointment?.doctor?.name}</span>
        </div>
      </td>
      <td className="hidden lg:table-cell">
        <div className="max-w-xs truncate">
          {record?.treatment_plan ? (
            <span className="text-sm">{record.treatment_plan}</span>
          ) : (
            <span className="text-gray-400 text-sm">No treatment plan</span>
          )}
        </div>
      </td>
      <td className="hidden xl:table-cell">
        <div className="max-w-xs truncate">
          {record?.diagnosis && record.diagnosis.length > 0 ? (
            <span className="text-sm">{record.diagnosis[0]?.diagnosis}</span>
          ) : (
            <span className="text-gray-400 text-sm">No diagnosis</span>
          )}
        </div>
      </td>
      <td className="hidden xl:table-cell">
        {format(record?.created_at, "MMM dd, yyyy")}
      </td>
      <td>
        <div className="flex items-center gap-2">
          <ViewAction href={`medical-records/${record?.id}`} />
          {/* {(isAdmin || isDoctor) && (
            <ActionDialog
              type="delete"
              id={record?.id.toString()}
              deleteType="patient"
            />
          )} */}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white rounded-xl py-6 px-3 2xl:px-6">
      <div className="flex items-center justify-between">
        <div className="hidden lg:flex items-center gap-1">
          <FileText size={20} className="text-gray-500" />
          <p className="text-2xl font-semibold">{totalRecords}</p>
          <span className="text-gray-600 text-sm xl:text-base">
            total medical records
          </span>
        </div>
        <div className="w-full lg:w-fit flex items-center justify-between lg:justify-start gap-2">
          <SearchInput />
        </div>
      </div>

      <div className="mt-4">
        <Table columns={columns} data={data} renderRow={renderRow} />
        {totalPages && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            totalRecords={totalRecords}
            limit={DATA_LIMIT}
          />
        )}
      </div>
    </div>
  );
}
