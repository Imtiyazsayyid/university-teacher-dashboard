"use client";

import { TokenService } from "@/app/Services/StorageService";
import { loginSchema } from "@/app/validationSchemas";
import { useRouter } from "next/navigation";
import { useState } from "react";
import TeacherServices from "../../Services/TeacherServices";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCapIcon } from "lucide-react";

const LoginPage = () => {
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
    user_role: "teacher",
  });

  const [errors, setErrors] = useState({
    invalidCredentials: "",
    email: "",
    password: "",
  });

  const router = useRouter();

  const resetErrors = () => {
    setErrors({ email: "", password: "", invalidCredentials: "" });
  };

  const handleSubmit = async () => {
    resetErrors();
    const validation = loginSchema.safeParse(userDetails);

    if (!validation.success) {
      const errorArray = validation.error.errors;

      for (let error of errorArray) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [error.path[0]]: error.message,
        }));
      }
      return;
    }

    const res = await TeacherServices.login(userDetails);

    if (res.data.status) {
      const refreshToken = res.data.data;

      const accessTokenResponse = await TeacherServices.getAccessToken(refreshToken);

      console.log({ accessTokenResponse });

      if (!accessTokenResponse.data.status) {
        throw new Error("status false in getting Access Token");
      }
      TokenService.saveAccessToken(accessTokenResponse.data.data);
      router.push("/admin");
    } else {
      setErrors({
        email: "",
        password: "",
        invalidCredentials: "Invalid Credentials.",
      });
    }
  };
  return (
    <>
      <div className="container relative hidden h-full max-h-full flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden max-h-full overflow-hidden flex-col bg-muted text-white lg:flex dark:border-r">
          <img
            src="https://images.pexels.com/photos/2387428/pexels-photo-2387428.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt=""
            className="h-full object-cover"
          />
        </div>
        <div className="lg:p-8 h-full flex flex-col justify-center">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="w-full flex justify-center mb-[-0.5rem]">
              <GraduationCapIcon size={50} />
            </div>
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Welcome Back</h1>
              <p className="text-sm text-muted-foreground">Enter your email and password to continue.</p>
            </div>
            <div>
              <div className="grid gap-2">
                <div className="grid gap-1">
                  <Label className="sr-only" htmlFor="email">
                    Email
                  </Label>
                  <Input
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                  />
                </div>
                <div className="grid gap-1">
                  <Label className="sr-only" htmlFor="password">
                    Password
                  </Label>
                  <Input
                    id="password"
                    placeholder="pass@123"
                    type="password"
                    autoCapitalize="none"
                    autoCorrect="off"
                    onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value })}
                  />
                </div>
                <Button onClick={handleSubmit}>Sign In</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
