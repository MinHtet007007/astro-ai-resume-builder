"use client";

import React, { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputWithLabel } from "../../components/InputWithLabel";
import { Label } from "../../components/ui/label";
import { TextareaWithLabel } from "../../components/TextareaWithLabel";
import { Separator } from "../../components/ui/separator";
import { DatePickerWithLabel } from "../../components/DatePickerWithLabel";
import { Button } from "../../components/ui/button";
import { Trash, UploadCloud } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";
import { useGeneratedResumeInfo } from "../../contexts/GeneratedResumeInfoContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Zod Schemas
const personnelSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email"),
  address: z.string().min(1, "Address is required"),
  skills: z.string().min(1, "Skills are required"),
});

const experienceSchema = z.object({
  jobTitle: z.string().min(1, "Job Title is required"),
  companyName: z.string().min(1, "Company Name is required"),
  jobLocation: z.string().optional(),
  jobStartDate: z.date().optional(),
  jobEndDate: z.date().optional(),
});

const educationSchema = z.object({
  institution: z.string().min(1, "Institution is required"),
  schoolLocation: z.string().min(1, "School location is required"),
  degreeType: z.string().min(1, "Degree type is required"),
  fieldOfStudy: z.string().min(1, "Field of study is required"),
  graduationDate: z.date().optional(),
});

const resumeSchema = z.object({
  personnel: personnelSchema,
  experiences: z.array(experienceSchema),
  educations: z.array(educationSchema),
});

type ResumeFormInputs = z.infer<typeof resumeSchema>;

const CreateResumeForm = () => {
  // Initialize React Hook Form with Zod validation
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResumeFormInputs>({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      personnel: {
        name: "",
        phone: "",
        email: "",
        address: "",
        skills: "",
      },
      experiences: [],
      educations: [],
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { resumeImage, setResumeImage, setGeneratedData } =
    useGeneratedResumeInfo();
  const router = useRouter();
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const img = new window.Image();
      img.src = reader.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const maxWidth = 500; // Resize to max 500px width
        const scale = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * scale;

        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Convert to JPEG (quality: 0.7 to reduce size)
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
        setResumeImage(compressedBase64);
      };
    };
  };

  // useFieldArray for experiences
  const {
    fields: expFields,
    append: appendExp,
    remove: removeExp,
  } = useFieldArray({
    control,
    name: "experiences",
  });

  // useFieldArray for educations
  const {
    fields: eduFields,
    append: appendEdu,
    remove: removeEdu,
  } = useFieldArray({
    control,
    name: "educations",
  });

  // Submit handler
  const onSubmit = async (data: ResumeFormInputs) => {
    setIsSubmitting(true);
    try {
      // setGeneratedData({
      //   candidate: {
      //     name: "John Doe",
      //     contact: {
      //       phone: "123-456-7890",
      //       email: "john.doe@example.com",
      //       address: "123 Main St, Anytown, USA",
      //     },
      //   },
      //   resume: {
      //     summary:
      //       "Experienced professional with a strong background in software development and project management. Passionate about delivering high-quality solutions and driving innovation.",
      //     workExperience: [
      //       {
      //         title: "Senior Software Engineer",
      //         company: "Tech Solutions Inc.",
      //         location: "San Francisco, CA",
      //         dates: "Jan 2018 - Present",
      //         description:
      //           "Led a team of developers to design and implement scalable web applications.\nUtilized agile methodologies to improve project efficiency and quality.",
      //       },
      //       {
      //         title: "Software Engineer",
      //         company: "Innovative Apps LLC",
      //         location: "New York, NY",
      //         dates: "Jun 2015 - Dec 2017",
      //         description:
      //           "Developed and maintained core features for web and mobile applications.\nCollaborated closely with cross-functional teams to deliver projects on time.",
      //       },
      //     ],
      //     education: [
      //       {
      //         institution: "University of Technology",
      //         location: "Boston, MA",
      //         degree: "Bachelor of Science",
      //         field: "Computer Science",
      //         graduationDate: "May 2015",
      //       },
      //     ],
      //     skills: [
      //       "JavaScript",
      //       "React",
      //       "Node.js",
      //       "Agile Methodologies",
      //       "Project Management",
      //     ],
      //   },
      //   coverLetter:
      //     "Dear Hiring Manager,\n\nI am excited to apply for the position at your esteemed company. With extensive experience in software development and project leadership, I am confident in my ability to contribute to your team's success. My previous roles have equipped me with the skills to solve complex problems, manage teams, and drive project success.\n\nThank you for considering my application. I look forward to the opportunity to discuss how I can bring value to your organization.\n\nSincerely,\nJohn Doe",
      // });
      // Send data to API route for AI processing
      const response = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error("Something went wrong. Please try again later.");
      }

      setGeneratedData(result); // Store AI-generated content
      router.push("resume-preview");
    } catch (error: any) {
      setError(error);
      setIsDialogOpen(true);
    }
    setIsSubmitting(false);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setError(null); // Clear the error when the dialog is closed
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-white to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-xl p-8">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Create Your Resume
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-10">
            <section>
              <Label className="block text-2xl font-semibold text-gray-700 mb-4">
                Resume Photo
              </Label>
              <div className=" w-full flex items-center justify-center">
                <div
                  className="relative flex flex-col items-center justify-center w-[300px] h-[200px] max-w-md p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-all bg-gray-50"
                  onClick={() =>
                    document.getElementById("imageUpload")?.click()
                  }
                >
                  {resumeImage ? (
                    <div className="relative">
                      <Image
                        src={resumeImage}
                        alt="Profile Preview"
                        width={150}
                        height={150}
                        className="rounded-full shadow-lg border-4 border-blue-300 w-[150px] h-[150px] object-cover"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setResumeImage(null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-all cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="text-gray-400 w-12 h-12 mb-3" />
                      <p className="text-gray-500 text-lg">Click to upload</p>
                      <p className="text-sm text-gray-400">or drag and drop</p>
                    </>
                  )}
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
              </div>
            </section>

            {/* Personnel Details Section */}
            <section>
              <Label className="block text-2xl font-semibold text-gray-700 mb-4">
                Personnel Details
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputWithLabel
                  placeholder="Name"
                  inputId="personnel.name"
                  label="Name"
                  {...register("personnel.name")}
                  error={errors.personnel?.name?.message}
                />
                <InputWithLabel
                  type="number"
                  placeholder="Phone"
                  inputId="personnel.phone"
                  label="Phone"
                  {...register("personnel.phone")}
                  error={errors.personnel?.phone?.message}
                />
                <InputWithLabel
                  type="email"
                  placeholder="Email"
                  inputId="personnel.email"
                  label="Email"
                  {...register("personnel.email")}
                  error={errors.personnel?.email?.message}
                />
              </div>
              <div className="mt-6">
                <TextareaWithLabel
                  placeholder="Address"
                  inputId="personnel.address"
                  label="Address"
                  {...register("personnel.address")}
                  error={errors.personnel?.address?.message}
                />
              </div>
              <div className="mt-6">
                <TextareaWithLabel
                  placeholder="e.g. Marketing Manager, Sales Manager"
                  inputId="personnel.skills"
                  label="Skills"
                  {...register("personnel.skills")}
                  error={errors.personnel?.skills?.message}
                />
              </div>
            </section>

            <Separator className="my-4" />

            {/* Work Experience Section */}
            <section>
              <Label className="block text-2xl font-semibold text-gray-700 mb-4">
                Work Experience
              </Label>
              {expFields.map((field, index) => (
                <div
                  key={field.id}
                  className="space-y-4 border p-4 rounded-lg mb-4"
                >
                  <div className="ms-auto w-fit">
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <Trash className="text-red-500 ms-auto cursor-pointer" />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="cursor-pointer">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="cursor-pointer"
                            onClick={() => removeExp(index)}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InputWithLabel
                      placeholder="Job Title"
                      inputId={`experiences.${index}.jobTitle`}
                      label="Job Title"
                      {...register(`experiences.${index}.jobTitle` as const)}
                      error={errors.experiences?.[index]?.jobTitle?.message}
                    />
                    <InputWithLabel
                      placeholder="Company Name"
                      inputId={`experiences.${index}.companyName`}
                      label="Company Name"
                      {...register(`experiences.${index}.companyName` as const)}
                      error={errors.experiences?.[index]?.companyName?.message}
                    />
                    <InputWithLabel
                      placeholder="Location"
                      inputId={`experiences.${index}.jobLocation`}
                      label="Location"
                      {...register(`experiences.${index}.jobLocation` as const)}
                      error={errors.experiences?.[index]?.jobLocation?.message}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <Controller
                      control={control}
                      name={`experiences.${index}.jobStartDate` as const}
                      render={({ field: { value, onChange } }) => (
                        <DatePickerWithLabel
                          inputId={`jobStartDate-${index}`}
                          label="Start Date"
                          date={value}
                          setDate={onChange}
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name={`experiences.${index}.jobEndDate` as const}
                      render={({ field: { value, onChange } }) => (
                        <DatePickerWithLabel
                          inputId={`jobEndDate-${index}`}
                          label="End Date"
                          date={value}
                          setDate={onChange}
                        />
                      )}
                    />
                  </div>
                </div>
              ))}
              <div
                onClick={() =>
                  appendExp({
                    jobTitle: "",
                    companyName: "",
                    jobLocation: "",
                    jobStartDate: undefined,
                    jobEndDate: undefined,
                  })
                }
                className="mt-2 text-blue-500 cursor-pointer select-none hover:underline transition-all"
              >
                {expFields.length === 0
                  ? "+ Add work experience"
                  : "+ Add more work experience"}
              </div>
            </section>

            <Separator className="my-4" />

            {/* Education Section */}
            <section>
              <Label className="block text-2xl font-semibold text-gray-700 mb-4">
                Education
              </Label>
              {eduFields.map((field, index) => (
                <div
                  key={field.id}
                  className="space-y-4 border p-4 rounded-lg mb-4"
                >
                  <div className="ms-auto w-fit">
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <Trash className="text-red-500 ms-auto cursor-pointer" />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="cursor-pointer">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="cursor-pointer"
                            onClick={() => removeEdu(index)}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InputWithLabel
                      placeholder="Institution"
                      inputId={`educations.${index}.institution`}
                      label="Institution"
                      {...register(`educations.${index}.institution` as const)}
                      error={errors.educations?.[index]?.institution?.message}
                    />
                    <InputWithLabel
                      placeholder="School Location"
                      inputId={`educations.${index}.schoolLocation`}
                      label="School Location"
                      {...register(
                        `educations.${index}.schoolLocation` as const
                      )}
                      error={
                        errors.educations?.[index]?.schoolLocation?.message
                      }
                    />
                    <InputWithLabel
                      placeholder="Degree Type"
                      inputId={`educations.${index}.degreeType`}
                      label="Degree Type"
                      {...register(`educations.${index}.degreeType` as const)}
                      error={errors.educations?.[index]?.degreeType?.message}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <InputWithLabel
                      placeholder="Field of Study"
                      inputId={`educations.${index}.fieldOfStudy`}
                      label="Field of Study"
                      {...register(`educations.${index}.fieldOfStudy` as const)}
                      error={errors.educations?.[index]?.fieldOfStudy?.message}
                    />
                    <Controller
                      control={control}
                      name={`educations.${index}.graduationDate` as const}
                      render={({ field: { value, onChange } }) => (
                        <DatePickerWithLabel
                          inputId={`graduationDate-${index}`}
                          label="Graduation Date"
                          date={value}
                          setDate={onChange}
                        />
                      )}
                    />
                  </div>
                </div>
              ))}
              <div
                onClick={() =>
                  appendEdu({
                    institution: "",
                    schoolLocation: "",
                    degreeType: "",
                    fieldOfStudy: "",
                    graduationDate: undefined,
                  })
                }
                className="mt-2 text-blue-500 cursor-pointer select-none hover:underline transition-all"
              >
                {eduFields.length === 0
                  ? "+ Add education"
                  : "+ Add more education"}
              </div>
            </section>

            <Separator className="my-4" />

            <div className="w-full flex items-center justify-center">
              <Button
                type="submit"
                className="cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Generating...." : "Generate Resume With AI"}
              </Button>
            </div>
          </div>
        </form>

        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Error</AlertDialogTitle>
              <AlertDialogDescription>
                {error
                  ? error.message || String(error)
                  : "An unexpected error occurred."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={handleCloseDialog}>
                OK
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default CreateResumeForm;
