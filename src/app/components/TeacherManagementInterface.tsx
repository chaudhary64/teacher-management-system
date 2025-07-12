"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTeacherContext } from "@/context/TeacherContext";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  Calendar,
  Star,
  BookOpen,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  X,
  Hash,
} from "lucide-react";

interface ScheduleItem {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  subject: string;
  classNumber: string;
  dayOfWeek: string;
}

interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    country: string;
  };
  qualifications: {
    name: string;
    institute: string;
  }[];
  detailedSchedule: ScheduleItem[];
}

interface TeacherManagementInterfaceProps {
  teacherInfo: Teacher;
}

const TeacherManagementInterface: React.FC<TeacherManagementInterfaceProps> = ({
  teacherInfo,
}) => {
  const [teacher] = useState<Teacher>(teacherInfo);
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    qualifications: true,
  });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateDuration = (startTime: string, endTime: string) => {
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);
    const diff = (end.getTime() - start.getTime()) / (1000 * 60);
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    return `${minutes}m`;
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatCalendarDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1)
    );
  };

  const getDateString = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
  };

  const getScheduleForDate = (dateString: string) => {
    return teacher.detailedSchedule.filter((item) => item.date === dateString);
  };

  const handleDayClick = (day: number) => {
    const clickedDate = getDateString(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(clickedDate);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  const getScheduleColor = (subject?: string) => {
    const colors = {
      "Vocal Jazz": "bg-blue-50 border-blue-200 text-blue-800",
      "Vocal Contemporary": "bg-green-50 border-green-200 text-green-800",
      "Vocal Classical": "bg-purple-50 border-purple-200 text-purple-800",
      "Vocal Pop": "bg-pink-50 border-pink-200 text-pink-800",
      "Group Session": "bg-orange-50 border-orange-200 text-orange-800",
      Instrument: "bg-indigo-50 border-indigo-200 text-indigo-800",
      default: "bg-gray-50 border-gray-200 text-gray-800",
    };
    return colors[subject as keyof typeof colors] || colors.default;
  };

  const CalendarView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const calendarDays = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push(day);
    }
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-3 sm:p-4 lg:p-6">
          <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
              <Calendar
                size={16}
                className="mr-2 text-blue-600 sm:w-5 sm:h-5"
              />
              Schedule Calendar
            </h3>
            <div className="flex items-center justify-between w-full xs:w-auto gap-1 sm:gap-2">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer flex-shrink-0"
                aria-label="Previous Month"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-medium min-w-0 flex-1 text-center truncate">
                {formatCalendarDate(currentDate)}
              </span>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer flex-shrink-0"
                aria-label="Next Month"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {weekDays.map((day) => (
              <div
                key={day}
                className="p-2 text-center text-xs font-medium text-gray-500 border-b"
              >
                {day}
              </div>
            ))}
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="p-2 h-12"></div>;
              }
              const dateString = getDateString(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                day
              );
              const daySchedule = getScheduleForDate(dateString);
              const hasSchedule = daySchedule.length > 0;
              const isToday =
                new Date().toDateString() ===
                new Date(dateString).toDateString();
              return (
                <button
                  key={`day-${dateString}`}
                  onClick={() => handleDayClick(day)}
                  className={`p-2 h-12 text-sm rounded-lg border transition-all hover:bg-gray-50 cursor-pointer ${
                    isToday
                      ? "bg-blue-100 border-blue-300 text-blue-800 font-semibold"
                      : hasSchedule
                      ? "bg-green-50 border-green-200 text-green-800"
                      : "border-gray-200 text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <span>{day}</span>
                    {hasSchedule && (
                      <div className="flex space-x-0.5 mt-1">
                        {daySchedule.slice(0, 3).map((_, i) => (
                          <div
                            key={`dot-${dateString}-${i}`}
                            className="w-1 h-1 bg-green-500 rounded-full"
                          ></div>
                        ))}
                        {daySchedule.length > 3 && (
                          <div className="w-1 h-1 bg-green-700 rounded-full"></div>
                        )}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-center space-x-4 mt-4 text-xs text-gray-600">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
              <span>Today</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-50 border border-green-200 rounded"></div>
              <span>Has Schedule</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ScheduleModal = () => {
    if (!isModalOpen || !selectedDate) return null;
    const daySchedule = getScheduleForDate(selectedDate);
    return (
      <div
        className="fixed inset-0 bg-black/25 backdrop-blur z-50 flex items-center justify-center p-4 cursor-pointer"
        onClick={closeModal}
      >
        <div
          className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto cursor-default"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {formatDate(selectedDate)}
                </h3>
                <p className="text-sm text-gray-500">
                  {daySchedule.length}{" "}
                  {daySchedule.length === 1 ? "class" : "classes"} scheduled
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>
          </div>
          <div className="p-4">
            {daySchedule.length > 0 ? (
              <div className="space-y-3">
                {daySchedule
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map((scheduleItem) => (
                    <div
                      key={scheduleItem.id}
                      className={`p-4 rounded-lg border ${getScheduleColor(
                        scheduleItem.subject
                      )}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-base mb-1">
                            {scheduleItem.subject}
                          </h4>
                          <div className="flex items-center space-x-2 text-sm opacity-75">
                            <Hash size={14} />
                            <span>{scheduleItem.classNumber}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {formatTime(scheduleItem.startTime)} -{" "}
                            {formatTime(scheduleItem.endTime)}
                          </div>
                          <div className="text-xs opacity-75">
                            {calculateDuration(
                              scheduleItem.startTime,
                              scheduleItem.endTime
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="flex items-center space-x-2">
                          <Clock size={12} />
                          <span>
                            Start: {formatTime(scheduleItem.startTime)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock size={12} />
                          <span>End: {formatTime(scheduleItem.endTime)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar size={40} className="mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600">
                  No classes scheduled for this day
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {formatDate(selectedDate)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Use the hooks only once at the top
  const router = useRouter();
  const { deleteTeacher } = useTeacherContext();
  const handleDelete = () => {
    deleteTeacher(teacher.id);
    router.push("/teachers");
  };
  return (
    <div className="min-h-screen">
      <ScheduleModal />
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 p-3 sm:p-4 lg:p-6">
          <div className="space-y-4 sm:space-y-6">
            <div className="rounded-2xl shadow-md p-6 sm:p-8 lg:p-10">
              <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-10">
                {/* Avatar */}
                <div className="flex-shrink-0 flex flex-col items-center md:items-start">
                  <div className="w-28 h-28 md:w-32 md:h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                    <User size={48} className="text-white" />
                  </div>
                </div>
                {/* Info and Stats */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Main Info */}
                  <div className="flex flex-col justify-center">
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1 truncate">
                      {teacher.name}
                    </h2>
                    <p className="text-gray-600 mb-2 text-base lg:text-lg font-medium">
                      {Array.from(
                        new Set(teacher.detailedSchedule.map((s) => s.subject))
                      ).join(", ")}
                    </p>
                    <div className="flex items-center space-x-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className="text-yellow-400 fill-current"
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">
                        5.0 (24 reviews)
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Mail
                          size={14}
                          className="text-gray-400 flex-shrink-0"
                        />
                        <span className="truncate">{teacher.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Phone
                          size={14}
                          className="text-gray-400 flex-shrink-0"
                        />
                        <span className="truncate">{teacher.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin
                          size={14}
                          className="text-gray-400 flex-shrink-0"
                        />
                        <span className="truncate">{teacher.address.city}</span>
                      </div>
                    </div>
                  </div>
                  {/* Stats and Actions */}
                  <div className="flex flex-col justify-between items-center md:items-end gap-4 h-full">
                    <div className="flex flex-row md:flex-col gap-4 w-full md:w-auto">
                      <div className="flex-1 p-4 bg-blue-100 rounded-xl text-center shadow-sm border border-blue-200">
                        <div className="text-2xl font-bold text-blue-700">
                          24
                        </div>
                        <div className="text-xs text-gray-600">Students</div>
                      </div>
                      <div className="flex-1 p-4 bg-green-100 rounded-xl text-center shadow-sm border border-green-200">
                        <div className="text-2xl font-bold text-green-700">
                          {teacher.detailedSchedule.length}
                        </div>
                        <div className="text-xs text-gray-600">Classes</div>
                      </div>
                    </div>
                    <div className="flex flex-row gap-3 mt-4 md:mt-6">
                      <button
                        className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition shadow"
                        onClick={() => {
                          if (router)
                            router.push(`/teacher/edit/${teacher.id}`);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="px-5 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition shadow"
                        onClick={handleDelete}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                    <BookOpen
                      size={16}
                      className="mr-2 text-blue-600 sm:w-5 sm:h-5"
                    />
                    Qualifications
                  </h3>
                  <button
                    onClick={() => toggleSection("qualifications")}
                    className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                  >
                    {expandedSections.qualifications ? (
                      <ChevronDown size={16} className="sm:w-5 sm:h-5" />
                    ) : (
                      <ChevronRight size={16} className="sm:w-5 sm:h-5" />
                    )}
                  </button>
                </div>
                {expandedSections.qualifications && (
                  <div className="flex flex-col gap-3">
                    {teacher.qualifications.map((qual, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100 shadow-sm"
                      >
                        <span className="font-medium text-gray-900 text-sm truncate pr-2 block sm:flex-1">
                          {qual.name}
                        </span>
                        <span className="text-sm font-semibold text-blue-600 flex-shrink-0 text-right sm:text-left">
                          {qual.institute}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <CalendarView />
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherManagementInterface;
