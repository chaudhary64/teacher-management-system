"use client";
import React, { useState, useEffect } from "react";
import {
  User,
  Users,
  Home,
  Menu,
  X,
  Settings,
  LogOut,
  Bell,
  GraduationCap,
  MessageSquare,
} from "lucide-react";

import { useTeacherContext } from "@/context/TeacherContext";
import Link from "next/link";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

const TeacherManagementInterface: React.FC<React.PropsWithChildren<object>> = ({
  children,
}) => {
  const { teachers } = useTeacherContext();

  const sidebarItems: SidebarItem[] = [
    { id: "/", label: "Home", icon: <Home size={18} /> },
    {
      id: "teachers",
      label: "Teachers",
      icon: <Users size={18} />,
      badge: teachers ? teachers.length : 0,
    },
    {
      id: "messages",
      label: "Messages",
      icon: <MessageSquare size={18} />,
      badge: 3,
    },
  ];

  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Mobile detection hook
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && isSidebarOpen) {
        const sidebar = document.getElementById("sidebar");
        const menuButton = document.getElementById("menu-button");

        if (
          sidebar &&
          !sidebar.contains(event.target as Node) &&
          menuButton &&
          !menuButton.contains(event.target as Node)
        ) {
          setIsSidebarOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const SidebarItem: React.FC<
    SidebarItem & { isActive: boolean; onClick: () => void }
  > = ({ id, label, icon, badge, isActive, onClick }) => (
    <Link href={`/${id}`}>
      <button
        onClick={onClick}
        className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-all duration-200 group text-left cursor-pointer ${
          isActive
            ? "bg-blue-600 text-white shadow-md"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200"
        }`}
      >
        <div className="flex items-center space-x-2.5">
          <div
            className={`flex-shrink-0 ${
              isActive
                ? "text-white"
                : "text-gray-400 group-hover:text-gray-600"
            }`}
          >
            {icon}
          </div>
          <span className="font-medium text-sm truncate">{label}</span>
        </div>
        {badge && (
          <span
            className={`px-1.5 py-0.5 text-xs font-bold rounded-full flex-shrink-0 ${
              isActive ? "bg-white text-blue-600" : "bg-blue-100 text-blue-600"
            }`}
          >
            {badge}
          </span>
        )}
      </button>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/25 backdrop-blur z-40 cursor-pointer"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        id="sidebar"
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <GraduationCap size={16} className="text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-bold text-gray-900 truncate">
                  TeachHub
                </h2>
                <p className="text-xs text-gray-500 truncate">
                  Richmond Hill School
                </p>
              </div>
            </div>
            <button
              onClick={toggleSidebar}
              className="p-1.5 hover:bg-gray-100 rounded-lg flex-shrink-0 cursor-pointer"
            >
              <X size={18} className="text-gray-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {sidebarItems.map((item) => (
              <SidebarItem
                key={item.id}
                {...item}
                isActive={activeTab === item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (isMobile) setIsSidebarOpen(false);
                }}
              />
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-gray-200">
            <div className="flex items-center space-x-2.5 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 truncate">
                  Admin User
                </p>
                <p className="text-xs text-gray-500 truncate">
                  admin@school.com
                </p>
              </div>
            </div>
            <div className="flex space-x-1">
              <button className="flex-1 p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings size={16} className="mx-auto" />
              </button>
              <button className="flex-1 p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <LogOut size={16} className="mx-auto" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="px-3 sm:px-4 lg:px-6">
            <div className="flex items-center justify-between h-14 sm:h-16">
              <div className="flex items-center space-x-3 min-w-0">
                <button
                  id="menu-button"
                  onClick={toggleSidebar}
                  className="p-2 hover:bg-gray-100 rounded-lg flex-shrink-0 cursor-pointer"
                >
                  <Menu size={18} className="text-gray-600" />
                </button>
                <div className="min-w-0">
                  <h1 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                    Teach Hub
                  </h1>
                  <p className="text-xs text-gray-500 hidden sm:block truncate">
                    Manage teacher information and schedule
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg relative flex-shrink-0">
                  <Bell size={18} className="text-gray-600" />
                  <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">3</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
};

export default TeacherManagementInterface;
