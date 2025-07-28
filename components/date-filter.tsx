"use client";

import { Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

interface DateFilterProps {
  defaultValue: string;
}

export const DateFilter = ({ defaultValue }: DateFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(searchParams);
    if (e.target.value) {
      params.set("date", e.target.value);
    } else {
      params.delete("date");
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <Calendar size={16} className="text-gray-500" />
      <Label htmlFor="date-filter" className="text-sm font-medium">
        Date:
      </Label>
      <Input
        id="date-filter"
        type="date"
        defaultValue={defaultValue}
        className="w-40"
        onChange={handleDateChange}
      />
    </div>
  );
};
