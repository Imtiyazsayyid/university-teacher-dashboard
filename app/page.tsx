"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [progress, setProgress] = useState(75);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setProgress(100), 300);
    if (router) {
      router.push("/admin");
    }
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-full w-full flex flex-col justify-center items-center border">
      <h1 className="text-4xl font-extrabold lg:text-5xl">Welcome To Admin University.</h1>
      <div className="mt-10 w-full flex justify-center">
        <Progress value={progress} className="w-[20%]" />
      </div>
    </div>
  );
}
