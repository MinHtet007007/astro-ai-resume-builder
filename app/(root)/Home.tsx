import React from "react";
import { Button } from "../../components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { getTrendingPosts } from "../../lib/utils";

const Home = async () => {
  const trendingPosts = await getTrendingPosts();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-100 via-white to-green-100">
      {/* Hero Section */}
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
          <Link href="/create-resume">
            <Button className="px-6 py-3 text-lg cursor-pointer">
              Create Your Resume Now
            </Button>
          </Link>
        </div>
      </div>

      {/* How It Works Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-green-700 mb-10">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Enter Your Info",
                desc: "Fill out your details — work history, education, and more.",
              },
              {
                step: "2",
                title: "Let AI Work",
                desc: "Our intelligent system helps you generate tailored content instantly.",
              },
              {
                step: "3",
                title: "Download & Apply",
                desc: "Preview, tweak if needed, then export your resume as a PDF.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center text-lg font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-green-600 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-700">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-green-700 mb-10">
            From Our Blog
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {trendingPosts.length > 0 &&
              trendingPosts.map((post, i) => (
                <Link
                  key={i}
                  href={`/blog/${post.slug}`}
                  className="block bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl text-left shadow-md hover:shadow-lg transition"
                >
                  <h3 className="text-xl font-semibold text-green-700 mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-700 line-clamp-3">{post.content}</p>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-green-700 mb-10">
            What Our Users Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Aye Chan",
                quote:
                  "This tool saved me so much time and gave me confidence applying for jobs. It’s amazing!",
              },
              {
                name: "Myo Thant",
                quote:
                  "I landed two interviews just a week after using this resume builder. Love the AI part!",
              },
              {
                name: "Ei Mon",
                quote:
                  "Beautiful templates and very easy to use. Highly recommend to job seekers!",
              },
            ].map((t, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl shadow-sm border border-gray-200"
              >
                <p className="italic text-gray-800 mb-4">“{t.quote}”</p>
                <h4 className="text-green-700 font-semibold">- {t.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-green-100 to-blue-100">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="text-4xl font-extrabold text-green-700 mb-6">
            Ready to Build Your AI Resume?
          </h2>
          <p className="text-gray-700 mb-6">
            Whether you're switching careers or just getting started — our
            resume builder has your back.
          </p>
          <Link href="/create-resume">
            <Button className=" cursor-pointer px-8 py-4 text-lg bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white">
              Start Now — It’s Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
