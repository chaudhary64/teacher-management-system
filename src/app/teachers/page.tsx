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
      <h2 className="text-3xl font-bold text-center text-purple-700 mb-8">
        All Teachers
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {teachers.map((teacher, idx) => (
          <div
            key={teacher.id}
            className="relative bg-white rounded-3xl shadow-lg p-8 flex flex-col items-center cursor-pointer border border-gray-100 group transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] hover:border-purple-300"
            onClick={() => router.push(`/teacher/${teacher.id}`)}
          >
            {/* Decorative gradient ring */}
            <div className="absolute -top-4 right-4 w-8 h-8 rounded-full bg-gradient-to-br from-purple-300 to-blue-200 opacity-30 blur-lg z-0" />
            {/* Avatar */}
            <div
              className={`relative z-10 w-24 h-24 rounded-full bg-gradient-to-br ${
                teacherColors[idx % teacherColors.length]
              } flex items-center justify-center mb-5 shadow-lg border-4 border-white group-hover:scale-105 transition-transform`}
            >
              <span className="text-4xl text-white font-extrabold tracking-wide">
                {teacher.name.charAt(0)}
              </span>
            </div>
            {/* Card Content */}
            <div className="text-center z-10 w-full">
              <div className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors">
                {teacher.name}
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="inline-block px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-xs font-medium shadow-sm">
                  {teacher.detailedSchedule &&
                  teacher.detailedSchedule.length > 0
                    ? Array.from(
                        new Set(teacher.detailedSchedule.map((s) => s.subject))
                      ).join(", ")
                    : "No Subjects"}
                </span>
              </div>
              <div className="text-xs text-gray-400 mb-1">{teacher.email}</div>
            </div>
            {/* Subtle bottom bar for accent */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-2 rounded-b-2xl bg-gradient-to-r from-purple-200 via-blue-200 to-pink-200 opacity-60 group-hover:opacity-90 transition-all" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
