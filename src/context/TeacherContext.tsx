"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

export type Qualification = {
  name: string;
  institute: string;
};

export type ScheduleItem = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  subject: string;
  classNumber: string;
  dayOfWeek: string;
};

export type Teacher = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    country: string;
  };
  qualifications: Qualification[];
  detailedSchedule: ScheduleItem[];
};

interface TeacherContextType {
  teachers: Teacher[];
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
  deleteTeacher: (id: string) => void;
}

const TeacherContext = createContext<TeacherContextType | undefined>(undefined);

export const TeacherProvider = ({ children }: { children: ReactNode }) => {
  const [teachers, setTeachers] = useState<Teacher[]>([
    {
      id: "1",
      name: "Alynia Allan",
      email: "AlyniaAllan@example.com",
      phone: "(416) 658-9017",
      address: {
        street: "123 Anywhere St. Any City",
        city: "North York, Ontario",
        country: "Canada",
      },
      qualifications: [
        { name: "Bachelor of Education", institute: "University of Toronto" },
        {
          name: "Master of Science in Mathematics",
          institute: "McGill University",
        },
        {
          name: "Ontario Teaching Certificate",
          institute: "Ontario College of Teachers",
        },
        { name: "Specialist in English", institute: "York University" },
        {
          name: "Certified Science Teacher",
          institute: "University of Waterloo",
        },
      ],
      detailedSchedule: [
        {
          id: "1",
          date: "2025-07-08",
          startTime: "09:00",
          endTime: "10:00",
          subject: "Mathematics",
          classNumber: "MATH-101",
          dayOfWeek: "Tuesday",
        },
        {
          id: "2",
          date: "2025-07-10",
          startTime: "10:15",
          endTime: "11:15",
          subject: "English Literature",
          classNumber: "ENG-205",
          dayOfWeek: "Thursday",
        },
        {
          id: "3",
          date: "2025-07-12",
          startTime: "11:30",
          endTime: "12:30",
          subject: "Science",
          classNumber: "SCI-301",
          dayOfWeek: "Saturday",
        },
        {
          id: "4",
          date: "2025-07-15",
          startTime: "09:00",
          endTime: "10:00",
          subject: "Mathematics",
          classNumber: "MATH-102",
          dayOfWeek: "Tuesday",
        },
        {
          id: "5",
          date: "2025-07-17",
          startTime: "10:15",
          endTime: "11:15",
          subject: "English Literature",
          classNumber: "ENG-206",
          dayOfWeek: "Thursday",
        },
        {
          id: "6",
          date: "2025-07-19",
          startTime: "11:30",
          endTime: "12:30",
          subject: "Science",
          classNumber: "SCI-302",
          dayOfWeek: "Saturday",
        },
        {
          id: "7",
          date: "2025-07-14",
          startTime: "13:00",
          endTime: "14:00",
          subject: "History",
          classNumber: "HIST-101",
          dayOfWeek: "Monday",
        },
        {
          id: "8",
          date: "2025-07-16",
          startTime: "14:15",
          endTime: "15:15",
          subject: "Geography",
          classNumber: "GEO-201",
          dayOfWeek: "Wednesday",
        },
      ],
    },
  ]);

  const deleteTeacher = (id: string) => {
    setTeachers((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <TeacherContext.Provider value={{ teachers, setTeachers, deleteTeacher }}>
      {children}
    </TeacherContext.Provider>
  );
};

export const useTeacherContext = () => {
  const context = useContext(TeacherContext);
  if (!context) {
    throw new Error("useTeacherContext must be used within a TeacherProvider");
  }
  return context;
};
