export interface Contact {
  phone: string;
  email: string;
  address: string;
}

export interface Candidate {
  name: string;
  contact: Contact;
}

export interface WorkExperience {
  title: string;
  company: string;
  location: string;
  dates: string;
  description: string;
}

export interface Education {
  institution: string;
  location: string;
  degree: string;
  field: string;
  graduationDate: string;
}

export interface Resume {
  summary: string;
  workExperience: WorkExperience[];
  education: Education[];
  skills: string[];
}

export interface GeneratedData {
  candidate: Candidate;
  resume: Resume;
  coverLetter: string;
}

export interface GeneratedResumeInfoContextType {
  generatedData: GeneratedData | null;
  setGeneratedData: React.Dispatch<React.SetStateAction<GeneratedData | null>>;
}
