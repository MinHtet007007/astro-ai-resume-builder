import React from "react";
import { Button } from "../components/ui/button";
import Image from "next/image";
import Link from "next/link";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-100 via-white to-green-100">
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 p-8 flex-grow">
        <div className="flex-shrink-0">
          <Image
            src="/assets/hero.png"
            alt="CV Illustration"
            width={400}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </div>
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6 max-w-lg">
          <h1 className="text-5xl font-extrabold text-green-600">
            Build Your Dream Resume with AI
          </h1>
          <p className="text-lg text-gray-700">
            Leverage advanced AI technology to create a professional resume that
            truly reflects your skills and experience. Our platform simplifies
            the process so you can stand out in the competitive job market.
          </p>
          <Link href={"/create-resume"}>
            <Button className="px-6 py-3 text-lg cursor-pointer">
              Create Your Resume Now
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
