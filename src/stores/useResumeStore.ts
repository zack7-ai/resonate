import { create } from "zustand";

export interface Experience {
  id: string;
  company: string;
  location: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string[];
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field?: string;
  location: string;
  startDate: string;
  endDate: string;
}

export interface ResumeData {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  website?: string;
  summary?: string;
  experience: Experience[];
  education: Education[];
  skills?: string[];
}

interface ResumeStore {
  data: ResumeData;
  updateData: (data: Partial<ResumeData>) => void;
  addExperience: (experience: Experience) => void;
  updateExperience: (id: string, experience: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  addEducation: (education: Education) => void;
  updateEducation: (id: string, education: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  reset: () => void;
}

const initialData: ResumeData = {
  name: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  website: "",
  summary: "",
  experience: [],
  education: [],
  skills: [],
};

export const useResumeStore = create<ResumeStore>((set) => ({
  data: initialData,
  updateData: (newData) =>
    set((state) => ({
      data: { ...state.data, ...newData },
    })),
  addExperience: (experience) =>
    set((state) => ({
      data: {
        ...state.data,
        experience: [...state.data.experience, experience],
      },
    })),
  updateExperience: (id, experience) =>
    set((state) => ({
      data: {
        ...state.data,
        experience: state.data.experience.map((exp) =>
          exp.id === id ? { ...exp, ...experience } : exp
        ),
      },
    })),
  removeExperience: (id) =>
    set((state) => ({
      data: {
        ...state.data,
        experience: state.data.experience.filter((exp) => exp.id !== id),
      },
    })),
  addEducation: (education) =>
    set((state) => ({
      data: {
        ...state.data,
        education: [...state.data.education, education],
      },
    })),
  updateEducation: (id, education) =>
    set((state) => ({
      data: {
        ...state.data,
        education: state.data.education.map((edu) =>
          edu.id === id ? { ...edu, ...education } : edu
        ),
      },
    })),
  removeEducation: (id) =>
    set((state) => ({
      data: {
        ...state.data,
        education: state.data.education.filter((edu) => edu.id !== id),
      },
    })),
  reset: () => set({ data: initialData }),
}));


