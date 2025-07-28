import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout is used for authentication pages
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-1/2 h-full flex items-center justify-center">
        {children}
      </div>
      <div className="w-1/2 hidden md:flex h-full relative">
        <Image
          src="https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg"
          alt="Doctor welcome"
          width={1000}
          height={1000}
          className="object-cover w-full h-full"
        />

        <div className="absolute inset-0 bg-black/50 flex flex-col gap-4 items-center justify-center text-white">
          <h1 className="text-3xl md:text-5xl font-bold tracking-wider">
            Careplus HMS
          </h1>
          <p className="text-xl md:text-2xl text-green-400 ">
            Welcome to careplus HMS
          </p>
        </div>
      </div>
    </div>
  );
}
