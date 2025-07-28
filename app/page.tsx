import { Button } from "@/components/ui/button";
import { getRole } from "@/utils/roles";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();
  const role = await getRole();

  if (userId && role) {
    redirect(`/${role}`);
  }

  return (
    <div className="flex flex-col itens-center justify-center h-screen p-6 bg-gray-100">
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center">
            Welcome to <br />
            <span className="text-blue-700 text-5xl md:text-6xl">
              CareplusHMS
            </span>
          </h1>
        </div>

        <div className="text-center max-w-xl flex flex-col items-center justify-center">
          <p className="mb-8">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem
            autem eveniet ullam sapiente praesentium impedit sequi doloribus
            doloremque beatae neque itaque, veniam voluptatibus at alias
            repudiandae possimus. Provident, laboriosam quisquam?
          </p>

          <div className="flex gap-8">
            {userId ? (
              <>
                <Link href={`/${role}`}>
                  <Button className=" cursor-pointer">Go to Dashboard</Button>
                </Link>
                <UserButton />
              </>
            ) : (
              <>
                <Link href={"/sign-up"}>
                  <Button className=" cursor-pointer">New Patient</Button>
                </Link>

                <Link href={"/sign-in"}>
                  <Button
                    variant="outline"
                    className=" md:text-base underline  cursor-pointer hover:text-blue-600"
                  >
                    Log into account
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      <footer className="mt-8">
        <p className="text-center text-sm">
          &copy; {new Date().getFullYear()} Careplus HMS. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
