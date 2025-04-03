"use client";

import { Button } from "./ui/button";
import { useActionState } from "react";
import { authenticate, googleAuthenticate } from "@/lib/actions";
import { useSearchParams } from "next/navigation";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );
  const [googleLoginErrorMessage, googleLoginFormAction, googleLoginIsPending] =
    useActionState(googleAuthenticate, undefined);

  return (
    <>
      <div className="space-y-3 md:w-1/2 lg:w-1/3">
        <div className="flex-1 rounded-lg bg-white shadow-2xl px-6 pb-4 pt-8">
          <form action={formAction} className="">
            <div className="">
              <h1 className={`{lusitana.className} mb-3 text-2xl`}>
                Please log in to continue.
              </h1>
              <div className="w-full">
                <div>
                  <label
                    className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <input
                      className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                      id="email"
                      type="email"
                      name="email"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label
                    className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                      id="password"
                      type="password"
                      name="password"
                      placeholder="Enter password"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
              </div>
              <input type="hidden" name="redirectTo" value={callbackUrl} />
              <Button
                type="submit"
                className="mt-4 w-full"
                aria-disabled={isPending}
              >
                {isPending ? "Loading..." : "Log in"}
              </Button>

              <div
                className="flex h-8 items-end space-x-1"
                aria-live="polite"
                aria-atomic="true"
              ></div>
            </div>
          </form>

          {/* Google Sign-In Button */}
          <form
            action={googleLoginFormAction}
            className=" w-full bg-blue-500 text-white p-2 rounded text-center cursor-pointer"
          >
            <input type="hidden" name="redirectTo" value={callbackUrl} />
            <button
              type="submit"
              className=" cursor-pointer"
              disabled={googleLoginIsPending}
            >
              {googleLoginIsPending ? "Loading..." : "Signin with Google"}
            </button>
          </form>

          {errorMessage && (
            <p className="text-sm text-red-500">{errorMessage}</p>
          )}
        </div>
      </div>
    </>
  );
}

// import React from "react";
// import { signIn, signOut } from "../auth";
// import { Button } from "./ui/button";

// const LoginForm = () => {
//   return (
//     <>
// <form
//   action={async () => {
//     "use server";
//     await signIn("google");
//   }}
// >
//   <button type="submit">Signin with Google</button>
// </form>

// <form
//   action={async () => {
//     "use server";
//     await signOut({ redirectTo: "/" });
//   }}
// >
//   <Button
//   //   className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
//   >
//     {/* <PowerIcon className="w-6" /> */}
//     <div className="hidden md:block">Sign Out</div>
//   </Button>
// </form>
//     </>
//   );
// };

// export default LoginForm;
