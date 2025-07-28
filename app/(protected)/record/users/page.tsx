import { Table } from "@/components/tables/table";
import { clerkClient } from "@clerk/nextjs/server";
import { format } from "date-fns";
import { BriefcaseBusiness } from "lucide-react";
import React from "react";

const columns = [
  {
    header: "user ID",
    key: "id",
    className: "hidden lg:table-cell",
  },
  {
    header: "Name",
    key: "name",
  },
  {
    header: "Email",
    key: "email",
    className: "hidden md:table-cell",
  },
  {
    header: "Role",
    key: "role",
  },
  {
    header: "Status",
    key: "status",
  },
  {
    header: "Last Login",
    key: "last_login",
    className: "hidden xl:table-cell",
  },
];

interface UserProps {
  id: string;
  firstName: string;
  lastName: string;
  emailAddresses: { emailAddress: string }[];
  publicMetadata: { role: string };
  lastSignInAt: number | string;
}

export default async function UserPage() {
  // Fetch users from clerk client
  const client = await clerkClient();
  const { data, totalCount } = await client.users.getUserList({
    orderBy: "-created_at",
  });

  if (!data) return "no user seen";

  const renderRow = (user: UserProps) => (
    <tr
      key={user.id}
      className="border-b border-gray-200 even:bg-slate-50 text-base hover:bg-slate-50"
    >
      <td className="hidden lg:table-cell items-center">{user.id}</td>
      <td className="table-cell py-2 xl:py-4">{`${user.firstName} ${user.lastName}`}</td>
      <td className="hidden md:table-cell">
        {user.emailAddresses[0].emailAddress}
      </td>
      <td className="table-cell capitalize">{user.publicMetadata.role}</td>
      <td className="hidden md:table-cell capitalize">Active</td>
      <td className="hidden md:table-cell capitalize">
        {format(user?.lastSignInAt, "yyyy-MM-dd h:mm:ss")}
      </td>
    </tr>
  );
  return (
    <div className="bg-white rounded-xl p-2 md:p-4 2xl:p-6">
      <div className="flex items-center justify-between">
        <div className="hidden lg:flex items-center gap-1">
          <BriefcaseBusiness size={20} className="text-gray-500" />

          <p className="text-2xl font-semibold">{totalCount}</p>
          <span className="text-gray-600 text-sm xl:text-base">
            total users
          </span>
        </div>
      </div>

      <div>
        <Table columns={columns} data={data} renderRow={renderRow} />
      </div>
    </div>
  );
}
