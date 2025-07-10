"use client";
import React from "react";
import { useTeacherContext } from "../../context/TeacherContext";
import { useRouter } from "next/navigation";

const teacherColors = [
  "from-blue-400 to-purple-500",
  "from-green-400 to-blue-500",
  "from-pink-400 to-red-500",
  "from-yellow-400 to-orange-500",
  "from-indigo-400 to-blue-600",
  "from-teal-400 to-green-500",
];

const Page = () => {
  const { teachers } = useTeacherContext();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-8">
      <h2 className="text-3xl font-bold text-center text-purple-700 mb-8">All Teachers</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {teachers.map((teacher, idx) => (
          <div
            key={teacher.id}
            className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center cursor-pointer hover:shadow-xl transition border border-gray-200 group"
            onClick={() => router.push(`/teacher/${teacher.id}`)}
          >
            <div
              className={`w-20 h-20 rounded-full bg-gradient-to-br ${teacherColors[idx % teacherColors.length]} flex items-center justify-center mb-4`}
            >
              <span className="text-3xl text-white font-bold">
                {teacher.name.charAt(0)}
              </span>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-purple-700 transition">
                {teacher.name}
              </div>
              <div className="text-sm text-gray-600 mb-1">
                {teacher.qualifications.length > 0
                  ? teacher.qualifications.map(q => q.name).join(", ")
                  : "No Subjects"}
              </div>
              <div className="text-xs text-gray-400">{teacher.email}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
