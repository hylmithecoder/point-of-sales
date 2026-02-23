"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthService } from "@/services/auth.service";
import { LoginRequest } from "@/types/payload/request/login.request";
import { BaseResponse } from "@/types/payload/response/base.response";
import { LoginResponse } from "@/types/payload/response/login.response";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: zodResolver(LoginRequest),
    mode: "onSubmit",
  });
  const router = useRouter();

  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);

  const loginMutation = useMutation({
    mutationKey: ["login_mutation"],
    mutationFn: (data: LoginRequest) => AuthService.login(data),
    onSuccess: (res: BaseResponse<LoginResponse>) => {
      toast.success("Login successfull.");
      sessionStorage.setItem("session_token", res.data.session_token);
      router.push("/adminpage/cashier");
    },
    onError: (e) => toast.error(e.message),
  });

  const onSubmit: SubmitHandler<LoginRequest> = (data) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-5 md:px-0">
      <div className="flex w-full items-center justify-center px-4 md:w-1/2 lg:px-8">
        <div className="mx-auto w-full max-w-sm space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>

          <div className="space-y-6">
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <Label htmlFor="username">Username / Email</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter Your Username"
                  autoComplete="username"
                  {...register("username")}
                />
                {errors.username && (
                  <p className="mt-1 text-destructive text-sm">
                    *{errors.username.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={isShowPassword ? "text" : "password"}
                    placeholder="Enter Your Password"
                    autoComplete="current-password"
                    {...register("password")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    className="absolute top-0 right-0 cursor-pointer"
                    onClick={() => setIsShowPassword(!isShowPassword)}
                  >
                    {isShowPassword ? <Eye /> : <EyeOff />}
                  </Button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-destructive text-sm">
                    *{errors.password.message}
                  </p>
                )}
              </div>

              <Button
                className="w-full cursor-pointer"
                type="submit"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <div className="flex items-center space-x-2">
                    <div
                      className="inline-block h-4 w-4 animate-spin rounded-full border-3 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_0.4s_linear_infinite] dark:text-slate-700"
                      role="status"
                    ></div>
                    <p>Please Wait..</p>
                  </div>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            <div className="text-center text-sm">
              Dont have an account?{" "}
              <Link
                href="/auth/register"
                className="text-blue-500 hover:underline"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
