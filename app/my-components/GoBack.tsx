"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const GoBack = () => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.back()}
      className="cursor-pointer h-6 w-6 flex justify-center items-center rounded-full transition-all mr-2 hover:border hover:bg-slate-50 dark:hover:bg-stone-900"
    >
      <ChevronLeft height={10} />
    </div>
  );
};

export default GoBack;
