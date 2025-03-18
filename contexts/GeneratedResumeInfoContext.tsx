"use client";
import { createContext, PropsWithChildren, useState, useContext } from "react";
import {
  GeneratedData,
  GeneratedResumeInfoContextType,
} from "../types/generatedResumeInfoType";

export const GeneratedResumeInfoContext =
  createContext<GeneratedResumeInfoContextType | null>(null);

const GeneratedResumeInfoProvider = ({ children }: PropsWithChildren) => {
  const [generatedData, setGeneratedData] = useState<GeneratedData | null>(
    null
  );
  const [resumeImage, setResumeImage] = useState<string | null>(null);

  const value = {
    generatedData,
    setGeneratedData,
    resumeImage,
    setResumeImage,
  };
  return (
    <GeneratedResumeInfoContext.Provider value={value}>
      {children}
    </GeneratedResumeInfoContext.Provider>
  );
};

export default GeneratedResumeInfoProvider;

// Custom hook to consume the context
export const useGeneratedResumeInfo = () => {
  const context = useContext(GeneratedResumeInfoContext);
  if (!context) {
    throw new Error(
      "useGeneratedResumeInfo must be used within a GeneratedResumeInfoProvider"
    );
  }
  return context;
};
