import React from "react";
import Navbar from "../../components/Navbar";
import CreateResumeForm from "./CreateResumeForm";
import Footer from "../../components/Footer";
const page = () => {
  return (
    <div>
      <Navbar />
      <CreateResumeForm />
      <Footer/>
    </div>
  );
};

export default page;
