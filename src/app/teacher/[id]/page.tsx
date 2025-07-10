"use client";
import React from "react";
import { useTeacherContext } from "@/context/TeacherContext";
import { useParams } from "next/navigation";
import TeacherManagementInterface from "../../components/TeacherManagementInterface";

type Teacher = {
  id: string;
  [key: string]: unknown;
};

const TeacherPage = () => {
  const { teachers } = useTeacherContext();
  const params = useParams();
  const teacherId = params?.id || params?.teacher; // support both /teacher/[id] and /teachers/[id]
  const teacher = teachers.find((t: Teacher) => t.id === teacherId);

  if (!teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-red-600">
        Teacher not found
      </div>
    );
  }
  return <TeacherManagementInterface teacherInfo={teacher} />;
};

export default TeacherPage;
