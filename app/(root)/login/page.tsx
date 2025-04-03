import React from "react";
import LoginForm from "../../../components/login-form";
import { auth } from "../../../auth";

const page = async () => {
  const session = await auth();
  // console.log(session);
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-100 via-white to-green-100">
      <LoginForm />
    </div>
  );
};

export default page;
