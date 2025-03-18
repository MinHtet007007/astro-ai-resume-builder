"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import Preview from "../components/Preview";

const schema = z.object({
  name: z.string(),
  skills: z.string(),
  experience: z.array(
    z.object({
      company: z.string(),
      role: z.string(),
      duration: z.string(),
      description: z.string(),
    })
  ),
  jobDescription: z.string(),
});

export default function Home() {
  const [generatedData, setGeneratedData] = useState<{
    resume: any;
    coverLetter: string;
  } | null>(null);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      // Send data to API route for AI processing
      const response = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const result = await response.json();
      setGeneratedData(result); // Store AI-generated content
    } catch (error) {
      console.error("Generation failed:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-2xl mx-auto p-4 flex flex-col gap-3"
      >
        <input
          {...register("name")}
          placeholder="Your Name"
          className=" border-2 p-2"
        />
        <textarea
          {...register("skills")}
          placeholder="Skills (comma-separated)"
          className=" border-2 p-2"
        />
        <textarea
          {...register("experience")}
          placeholder="Work Experience"
          className=" border-2 p-2"
        />
        <textarea
          {...register("jobDescription")}
          placeholder="Paste Job Description"
          className=" border-2 p-2"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {isSubmitting ? "Generating..." : "Generate Resume"}
        </button>
      </form>

      {/* Show preview after generation */}
      {generatedData && (
        <Preview
          resume={generatedData.resume}
          coverLetter={generatedData.coverLetter}
        />
      )}
    </div>
  );
}
