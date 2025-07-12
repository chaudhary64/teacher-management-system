"use client";
import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTeacherContext } from "@/context/TeacherContext";
import {
  PlusIcon,
  XMarkIcon,
  UserPlusIcon,
  AcademicCapIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

const EditTeacherPage = () => {
  const { teachers, setTeachers } = useTeacherContext();
  const router = useRouter();
  const params = useParams();
  const teacherId = params?.id;
  const teacher = teachers.find((t) => t.id === teacherId);

  const [currentStep, setCurrentStep] = useState(1);
  type Qualification = { name: string; institute: string };
  type Schedule = {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    subject: string;
    classNumber: string;
    dayOfWeek: string;
  };
  type FormState = {
    name: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    country: string;
    qualifications: Qualification[];
    detailedSchedule: Schedule[];
  };
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    country: "",
    qualifications: [{ name: "", institute: "" }],
    detailedSchedule: [
      {
        id: "",
        date: "",
        startTime: "",
        endTime: "",
        subject: "",
        classNumber: "",
        dayOfWeek: "",
      },
    ],
  });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (teacher) {
      setForm({
        name: teacher.name || "",
        email: teacher.email || "",
        phone: teacher.phone || "",
        street: teacher.address?.street || "",
        city: teacher.address?.city || "",
        country: teacher.address?.country || "",
        qualifications:
          teacher.qualifications?.length > 0
            ? teacher.qualifications
            : [{ name: "", institute: "" }],
        detailedSchedule:
          teacher.detailedSchedule?.length > 0
            ? teacher.detailedSchedule
            : [
                {
                  id: "",
                  date: "",
                  startTime: "",
                  endTime: "",
                  subject: "",
                  classNumber: "",
                  dayOfWeek: "",
                },
              ],
      });
    }
  }, [teacher]);

  // Function to get day of week from date
  const getDayOfWeek = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[date.getDay()];
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Qualifications handlers
  const handleQualificationChange = (
    index: number,
    field: keyof Qualification,
    value: string
  ) => {
    const updated = form.qualifications.map((q, i) =>
      i === index ? { ...q, [field]: value } : q
    );
    setForm({ ...form, qualifications: updated });
  };

  const addQualification = () => {
    setForm({
      ...form,
      qualifications: [...form.qualifications, { name: "", institute: "" }],
    });
  };

  const removeQualification = (index: number) => {
    setForm({
      ...form,
      qualifications: form.qualifications.filter((_, i) => i !== index),
    });
  };

  // Schedule handlers
  const handleScheduleChange = (
    index: number,
    field: keyof Schedule,
    value: string
  ) => {
    const updated = form.detailedSchedule.map((s, i) => {
      if (i === index) {
        const updatedItem = { ...s, [field]: value };
        if (field === "date") {
          updatedItem.dayOfWeek = getDayOfWeek(value);
        }
        return updatedItem;
      }
      return s;
    });
    setForm({ ...form, detailedSchedule: updated });
  };

  const addSchedule = () => {
    setForm({
      ...form,
      detailedSchedule: [
        ...form.detailedSchedule,
        {
          id: "",
          date: "",
          startTime: "",
          endTime: "",
          subject: "",
          classNumber: "",
          dayOfWeek: "",
        },
      ],
    });
  };

  const removeSchedule = (index: number) => {
    setForm({
      ...form,
      detailedSchedule: form.detailedSchedule.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTeachers((prev) =>
      prev.map((t) =>
        t.id === teacherId
          ? {
              ...t,
              name: form.name,
              email: form.email,
              phone: form.phone,
              address: {
                street: form.street,
                city: form.city,
                country: form.country,
              },
              qualifications: form.qualifications.filter(
                (q) => q.name && q.institute
              ),
              detailedSchedule: form.detailedSchedule.filter(
                (s) =>
                  s.date &&
                  s.startTime &&
                  s.endTime &&
                  s.subject &&
                  s.classNumber
              ),
            }
          : t
      )
    );
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      router.push(`/teacher/${teacherId}`);
    }, 2000);
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const steps = [
    { number: 1, title: "Personal Info", icon: UserPlusIcon },
    { number: 2, title: "Qualifications", icon: AcademicCapIcon },
    { number: 3, title: "Schedule", icon: CalendarIcon },
  ];

  if (!teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-red-600">
        Teacher not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-2 sm:p-4">
      <div className="max-w-full sm:max-w-4xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2">
            Edit Teacher
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Update the information for this teacher
          </p>
        </div>
        <div className="mb-6 sm:mb-8">
          {/* Mobile Steps: vertical, always visible, improved UI */}
          <div className="sm:hidden flex flex-col items-center">
            <div className="bg-white rounded-xl shadow border border-gray-200 px-4 py-3 w-full max-w-xs flex flex-col items-center relative">
              {/* Vertical progress bar */}
              <div
                className="absolute left-6 top-6 bottom-6 w-1 bg-gray-200 z-0 rounded-full"
                style={{
                  height: steps.length > 1 ? "calc(100% - 2.5rem)" : "0",
                }}
              />
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className="flex items-center w-full relative z-10 mb-2 last:mb-0"
                >
                  <div className="flex flex-col items-center mr-3">
                    <div
                      className={`flex items-center justify-center w-9 h-9 rounded-full border-2 transition-all duration-300 ${
                        currentStep >= step.number
                          ? "bg-indigo-600 border-indigo-600 text-white"
                          : "bg-white border-gray-300 text-gray-400"
                      }`}
                    >
                      <step.icon className="w-5 h-5" />
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className="flex-1 w-0.5 bg-gray-200"
                        style={{ height: "1.5rem" }}
                      />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`text-xs font-semibold ${
                        currentStep >= step.number
                          ? "text-indigo-600"
                          : "text-gray-400"
                      }`}
                    >
                      Step {step.number}
                    </span>
                    <span
                      className={`text-xs ${
                        currentStep >= step.number
                          ? "text-gray-900"
                          : "text-gray-400"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Desktop Steps: horizontal */}
          <div className="hidden sm:flex justify-center items-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                    currentStep >= step.number
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : "bg-white border-gray-300 text-gray-400"
                  }`}
                >
                  <step.icon className="w-6 h-6" />
                </div>
                <div className="ml-3">
                  <p
                    className={`text-sm font-medium ${
                      currentStep >= step.number
                        ? "text-indigo-600"
                        : "text-gray-400"
                    }`}
                  >
                    Step {step.number}
                  </p>
                  <p
                    className={`text-xs ${
                      currentStep >= step.number
                        ? "text-gray-900"
                        : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 ml-4 ${
                      currentStep > step.number
                        ? "bg-indigo-600"
                        : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <form
            onSubmit={handleSubmit}
            onKeyDown={(e) => {
              // Prevent Enter from submitting form unless on last step
              if (e.key === "Enter" && currentStep < 3) {
                e.preventDefault();
              }
            }}
          >
            <div className="p-8">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-4">
                    <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                      <UserPlusIcon className="w-6 h-6 mr-2 text-indigo-600" />
                      Personal Information
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Edit the teacher&apos;s basic details
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        placeholder={teacher.name}
                        required
                        autoComplete="off"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        placeholder={teacher.email}
                        required
                        autoComplete="off"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        placeholder={teacher.phone}
                        required
                        autoComplete="off"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="street"
                        value={form.street}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        placeholder={teacher.address?.street}
                        required
                        autoComplete="off"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        placeholder={teacher.address?.city}
                        required
                        autoComplete="off"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={form.country}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        placeholder={teacher.address?.country}
                        required
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </div>
              )}
              {/* Step 2: Qualifications */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-4">
                    <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                      <AcademicCapIcon className="w-6 h-6 mr-2 text-indigo-600" />
                      Qualifications
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Edit teacher&apos;s qualifications and hourly rates
                    </p>
                  </div>
                  <div className="space-y-4">
                    {form.qualifications.map((q, i) => (
                      <div
                        key={i}
                        className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-medium text-gray-900">
                            Qualification {i + 1}
                          </h3>
                          {form.qualifications.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeQualification(i)}
                              className="text-red-500 hover:text-red-700 transition-colors duration-200"
                              aria-label={`Remove Qualification ${i + 1}`}
                            >
                              <XMarkIcon
                                className="w-5 h-5"
                                aria-hidden="true"
                              />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Qualification Name
                            </label>
                            <input
                              type="text"
                              placeholder={
                                teacher.qualifications?.[i]?.name ||
                                "e.g., Master's in Mathematics"
                              }
                              value={q.name}
                              onChange={(e) =>
                                handleQualificationChange(
                                  i,
                                  "name",
                                  e.target.value
                                )
                              }
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Institute
                            </label>
                            <input
                              type="text"
                              placeholder={
                                teacher.qualifications?.[i]?.institute ||
                                "e.g., University of Toronto"
                              }
                              value={q.institute}
                              onChange={(e) =>
                                handleQualificationChange(
                                  i,
                                  "institute",
                                  e.target.value
                                )
                              }
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addQualification}
                      className="w-full py-3 border-2 border-dashed border-indigo-300 rounded-xl text-indigo-600 hover:border-indigo-400 hover:text-indigo-700 transition-all duration-200 flex items-center justify-center"
                      aria-label="Add Another Qualification"
                    >
                      <PlusIcon className="w-5 h-5 mr-2" aria-hidden="true" />
                      Add Another Qualification
                    </button>
                  </div>
                </div>
              )}
              {/* Step 3: Schedule */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-4">
                    <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                      <CalendarIcon className="w-6 h-6 mr-2 text-indigo-600" />
                      Teaching Schedule
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Edit the teacher&apos;s class schedule
                    </p>
                  </div>
                  <div className="space-y-4">
                    {form.detailedSchedule.map((s, i) => (
                      <div
                        key={i}
                        className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-medium text-gray-900">
                            Schedule {i + 1}
                          </h3>
                          {form.detailedSchedule.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSchedule(i)}
                              className="text-red-500 hover:text-red-700 transition-colors duration-200"
                              aria-label={`Remove Schedule ${i + 1}`}
                            >
                              <XMarkIcon
                                className="w-5 h-5"
                                aria-hidden="true"
                              />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Date
                            </label>
                            <input
                              type="date"
                              value={s.date}
                              onChange={(e) =>
                                handleScheduleChange(i, "date", e.target.value)
                              }
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                              placeholder={teacher.detailedSchedule?.[i]?.date}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Day of Week
                            </label>
                            <input
                              type="text"
                              value={s.dayOfWeek}
                              readOnly
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-600 cursor-not-allowed"
                              placeholder="Select date first"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Subject
                            </label>
                            <input
                              type="text"
                              placeholder={
                                teacher.detailedSchedule?.[i]?.subject ||
                                "Mathematics"
                              }
                              value={s.subject}
                              onChange={(e) =>
                                handleScheduleChange(
                                  i,
                                  "subject",
                                  e.target.value
                                )
                              }
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Start Time
                            </label>
                            <input
                              type="time"
                              value={s.startTime}
                              onChange={(e) =>
                                handleScheduleChange(
                                  i,
                                  "startTime",
                                  e.target.value
                                )
                              }
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                              placeholder={
                                teacher.detailedSchedule?.[i]?.startTime
                              }
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              End Time
                            </label>
                            <input
                              type="time"
                              value={s.endTime}
                              onChange={(e) =>
                                handleScheduleChange(
                                  i,
                                  "endTime",
                                  e.target.value
                                )
                              }
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                              placeholder={
                                teacher.detailedSchedule?.[i]?.endTime
                              }
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Class Number
                            </label>
                            <input
                              type="text"
                              placeholder={
                                teacher.detailedSchedule?.[i]?.classNumber ||
                                "Room 101"
                              }
                              value={s.classNumber}
                              onChange={(e) =>
                                handleScheduleChange(
                                  i,
                                  "classNumber",
                                  e.target.value
                                )
                              }
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addSchedule}
                      className="w-full py-3 border-2 border-dashed border-indigo-300 rounded-xl text-indigo-600 hover:border-indigo-400 hover:text-indigo-700 transition-all duration-200 flex items-center justify-center"
                      aria-label="Add Another Schedule"
                    >
                      <PlusIcon className="w-5 h-5 mr-2" aria-hidden="true" />
                      Add Another Schedule
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-gray-50 px-3 py-3 sm:px-6 sm:py-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 sm:gap-0">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`w-full sm:w-auto px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-medium text-sm transition-all duration-200 ${
                    currentStep === 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                  aria-label="Previous Step"
                >
                  Previous
                </button>
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-full sm:w-auto px-3 sm:px-5 py-2 sm:py-2.5 bg-indigo-600 text-white rounded-lg sm:rounded-xl font-medium text-sm hover:bg-indigo-700 transition-all duration-200"
                    aria-label="Next Step"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      handleSubmit(
                        new Event("submit", {
                          bubbles: true,
                          cancelable: true,
                        }) as unknown as React.FormEvent<HTMLFormElement>
                      )
                    }
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-green-600 text-white rounded-lg sm:rounded-xl font-medium text-sm hover:bg-green-700 transition-all duration-200 flex items-center justify-center"
                    aria-label="Save Changes"
                  >
                    <UserPlusIcon className="w-5 h-5 mr-2" aria-hidden="true" />
                    Save Changes
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
        {/* Success Toast Popup */}
        {success && (
          <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
            <div className="bg-green-600 text-white rounded-xl shadow-lg px-6 py-4 flex items-center min-w-[250px]">
              <svg
                className="w-7 h-7 text-white mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <div>
                <div className="font-semibold text-base">Success!</div>
                <div className="text-sm">Teacher information updated.</div>
              </div>
            </div>
          </div>
        )}
        {/* Toast Animation Style */}
        <style jsx global>{`
          @keyframes fade-in-up {
            0% {
              opacity: 0;
              transform: translateY(40px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
        `}</style>
      </div>
    </div>
  );
};

export default EditTeacherPage;
