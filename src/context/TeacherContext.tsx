
"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

export type Qualification = {
  name: string;
  rate: number;
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
        { name: "Vocal Contemporary", rate: 50.0 },
        { name: "Vocal Jazz", rate: 50.0 },
        { name: "Vocal Classical", rate: 50.0 },
        { name: "Vocal Pop", rate: 50.0 },
        { name: "Instrument", rate: 50.0 },
      ],
      detailedSchedule: [
        {
          id: "1",
          date: "2025-07-08",
          startTime: "16:00",
          endTime: "17:00",
          subject: "Vocal Jazz",
          classNumber: "VJ-101",
          dayOfWeek: "Tuesday",
        },
        {
          id: "2",
          date: "2025-07-10",
          startTime: "15:00",
          endTime: "16:30",
          subject: "Vocal Contemporary",
          classNumber: "VC-205",
          dayOfWeek: "Thursday",
        },
        {
          id: "3",
          date: "2025-07-12",
          startTime: "10:00",
          endTime: "12:00",
          subject: "Group Session",
          classNumber: "GS-301",
          dayOfWeek: "Saturday",
        },
        {
          id: "4",
          date: "2025-07-15",
          startTime: "16:00",
          endTime: "17:00",
          subject: "Vocal Jazz",
          classNumber: "VJ-102",
          dayOfWeek: "Tuesday",
        },
        {
          id: "5",
          date: "2025-07-17",
          startTime: "15:00",
          endTime: "16:30",
          subject: "Vocal Contemporary",
          classNumber: "VC-206",
          dayOfWeek: "Thursday",
        },
        {
          id: "6",
          date: "2025-07-19",
          startTime: "10:00",
          endTime: "12:00",
          subject: "Group Session",
          classNumber: "GS-302",
          dayOfWeek: "Saturday",
        },
        {
          id: "7",
          date: "2025-07-14",
          startTime: "14:00",
          endTime: "15:00",
          subject: "Vocal Classical",
          classNumber: "VC-101",
          dayOfWeek: "Monday",
        },
        {
          id: "8",
          date: "2025-07-16",
          startTime: "13:00",
          endTime: "14:30",
          subject: "Vocal Pop",
          classNumber: "VP-201",
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
