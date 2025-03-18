"use client";

import React, { useEffect, useState } from "react";
import { useGeneratedResumeInfo } from "../../contexts/GeneratedResumeInfoContext";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import Navbar from "../../components/Navbar";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";
import DefaultResumeTemplate from "../../components/resumeTemplates/DefaultResumeTemplate";
import Footer from "../../components/Footer";
import { Separator } from "../../components/ui/separator";
import DefaultCoverLetterTemplate from "../../components/coverLetterTemplates/DefaultCoverLetterTemplate";

const ResumePage = () => {
  const router = useRouter();
  const { generatedData, resumeImage } = useGeneratedResumeInfo();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (generatedData) {
      setIsLoading(false);
    } else {
      router.push("/");
    }
  }, [generatedData, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading...
      </div>
    );
  }

  if (!generatedData) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-medium">
        No resume data found. Redirecting...
      </div>
    );
  }

  const { candidate, resume, coverLetter } = generatedData;

  // Modified exportToDocx function that accepts a type parameter
  const exportToDocx = (docType: string) => {
    let doc;
    let fileName: string;

    if (docType === "resume") {
      doc = new Document({
        sections: [
          {
        properties: {},
        children: [
          new Paragraph({
            children: [
          new TextRun({ text: candidate.name, bold: true, size: 32 }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `${candidate.contact.email} | ${candidate.contact.phone} | ${candidate.contact.address}`,
            spacing: { after: 300 },
          }),
          new Paragraph({
            children: [
          new TextRun({ text: "Summary", bold: true, size: 26 }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph(resume.summary),
          ...(resume.workExperience.length > 0
            ? [
            new Paragraph({
              children: [
            new TextRun({
              text: "Work Experience",
              bold: true,
              size: 26,
            }),
              ],
              spacing: { after: 100 },
            }),
            ...resume.workExperience.map(
              (job) =>
            new Paragraph({
              children: [
                new TextRun({
              text: `${job.title} - ${job.company}`,
              bold: true,
                }),
                new TextRun({
              text: `\n${job.location} | ${job.dates}`,
                }),
                new TextRun({ text: `\n${job.description}` }),
              ],
              spacing: { after: 200 },
            })
            ),
          ]
            : []),
          ...(resume.education.length > 0
            ? [
            new Paragraph({
              children: [
            new TextRun({ text: "Education", bold: true, size: 26 }),
              ],
              spacing: { after: 100 },
            }),
            ...resume.education.map(
              (edu) =>
            new Paragraph({
              children: [
                new TextRun({
              text: `${edu.degree} in ${edu.field}`,
              bold: true,
                }),
                new TextRun({
              text: `\n${edu.institution}, ${edu.location} | ${edu.graduationDate}`,
                }),
              ],
              spacing: { after: 200 },
            })
            ),
          ]
            : []),
          new Paragraph({
            children: [
          new TextRun({ text: "Skills", bold: true, size: 26 }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph(resume.skills.join(", ")),
        ],
          },
        ],
      });
      fileName = `${candidate.name} Resume.docx`;
    } else if (docType === "coverLetter") {
      // Split the cover letter into paragraphs by newline characters
      const coverLetterParagraphs = coverLetter
        .split("\n")
        .map((line) => new Paragraph({ text: line, spacing: { after: 100 } }));

      doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: candidate.name, bold: true, size: 32 }),
                ],
                spacing: { after: 200 },
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "Cover Letter", bold: true, size: 26 }),
                ],
                spacing: { after: 200 },
              }),
              ...coverLetterParagraphs,
            ],
          },
        ],
      });
      fileName = `${candidate.name} Cover Letter.docx`;
    }

    if (doc) {
      Packer.toBlob(doc).then((blob) => {
        saveAs(blob, fileName);
      });
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-r from-blue-100 via-white to-green-100 flex flex-col lg:flex-row lg:items-center lg:justify-center gap-8 p-8">
        {/* Resume Display & Buttons */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 max-w-3xl">
          <h1 className="text-3xl lg:text-5xl font-extrabold text-green-600">
            Your AI-Generated Resume
          </h1>

          {/* PDF Viewer */}
          <div className="hidden w-full lg:flex justify-center">
            <PDFViewer className="w-full h-[500px] md:h-[600px] lg:h-[700px] border shadow-lg">
              <DefaultResumeTemplate
                generatedData={generatedData}
                resumeImage={resumeImage}
              />
            </PDFViewer>
          </div>

          {/* Download Buttons for Resume */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6 w-full">
            <Button className="px-6 py-3 text-lg bg-red-600 text-white w-full sm:w-auto shadow-lg hover:bg-black transition cursor-pointer">
              <PDFDownloadLink
                document={
                  <DefaultResumeTemplate
                    generatedData={generatedData}
                    resumeImage={resumeImage}
                  />
                }
                fileName={`${candidate.name} Resume.pdf`}
              >
                {({ loading }) =>
                  loading ? "Preparing PDF..." : "Download Resume PDF"
                }
              </PDFDownloadLink>
            </Button>

            <Button
              onClick={() => exportToDocx("resume")}
              className="px-6 py-3 text-lg bg-blue-600 text-white w-full sm:w-auto shadow-lg hover:bg-black transition cursor-pointer"
            >
              Download Resume DOCX
            </Button>
          </div>

          <Separator className="my-4" />

          <h1 className="text-3xl lg:text-5xl font-extrabold text-green-600">
            Your AI-Generated Cover Letter
          </h1>

          {/* PDF Viewer for Cover Letter */}
          <div className="hidden w-full lg:flex justify-center">
            <PDFViewer className="w-full h-[500px] md:h-[600px] lg:h-[700px] border shadow-lg">
              <DefaultCoverLetterTemplate coverLetter={coverLetter} />
            </PDFViewer>
          </div>

          {/* Download Buttons for Cover Letter */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6 w-full">
            <Button className="px-6 py-3 text-lg bg-red-600 text-white w-full sm:w-auto shadow-lg hover:bg-black transition cursor-pointer">
              <PDFDownloadLink
                document={
                  <DefaultCoverLetterTemplate coverLetter={coverLetter} />
                }
                fileName={`${candidate.name} Cover Letter.pdf`}
              >
                {({ loading }) =>
                  loading ? "Preparing PDF..." : "Download Cover Letter PDF"
                }
              </PDFDownloadLink>
            </Button>

            <Button
              onClick={() => exportToDocx("coverLetter")}
              className="px-6 py-3 text-lg bg-blue-600 text-white w-full sm:w-auto shadow-lg hover:bg-black transition cursor-pointer"
            >
              Download Cover Letter DOCX
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResumePage;
