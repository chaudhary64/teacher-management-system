# TeachHub – Teacher Management System

A modern web application for managing teacher information, schedules, and communication, built with Next.js and Tailwind CSS.

---

## Live Demo & Video

- **Live Demo:** [https://teacher-management-system-drab.vercel.app/](https://teacher-management-system-drab.vercel.app/)
- **Loom Video:** [Watch Video](https://drive.google.com/file/d/114j0CV0LZr-6KCjrnTdS7Ud0zHBAf02J/view?usp=drive_link)

## Setup and Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/chaudhary64/teacher-management-system
   cd peach-world
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000)

---

## Architecture

- **Framework:** Next.js (App Router, TypeScript)
- **State Management:** React Context API (`TeacherContext`)
- **Styling:** Tailwind CSS
- **Component Structure:**
  - `src/app/layout.tsx`: Root layout, wraps app in `TeacherProvider`
  - `src/context/TeacherContext.tsx`: Global teacher data and actions
  - `src/app/template.tsx`: Main UI shell with sidebar, header, and content
  - `src/app/components/TeacherManagementInterface.tsx`: Detailed teacher view and calendar
  - `src/app/teachers/page.tsx`: List of all teachers
  - `src/app/teacher/[id]/page.tsx`: Individual teacher profile
  - `src/app/teacher/edit/[id]/page.tsx`: Edit teacher details
  - `src/app/page.tsx`: Add new teacher form
  - `src/app/messages/page.tsx`: Placeholder for messaging

---

## Feature Explanations

- **Sidebar Navigation:** Responsive sidebar with navigation and badges for teachers/messages.
- **Teacher List:** Grid view of all teachers with avatars, subjects, and quick info.
- **Teacher Profile:** Detailed view with qualifications, contact info, and a schedule calendar.
- **Schedule Calendar:** Interactive calendar showing classes per day, with modal for daily details.
- **Add/Edit Teacher:** Multi-step forms for adding or editing teacher info, qualifications, and schedules.
- **Delete Teacher:** Remove a teacher from the system.
- **Context-based State:** All teacher data is managed globally via React Context.
- **Responsive Design:** Mobile-friendly layout with sidebar overlay and adaptive components.

---

## Design Decisions and Rationale

- **Next.js App Router:** Enables file-based routing and server/client component separation.
- **React Context for State:** Simple, scalable state management for teacher data without external libraries.
- **Tailwind CSS:** Utility-first CSS for rapid, consistent, and responsive UI development.
- **Component Modularity:** Each page and feature is encapsulated in its own component for maintainability.
- **Demo Data:** Initial teacher data is hardcoded for demonstration; can be replaced with API integration.
- **Accessibility:** Buttons, navigation, and modals are keyboard and screen-reader friendly.

---

## Assumptions

- The app is intended for school administrators to manage teacher data.
- No authentication or backend integration is present; all data is in-memory and resets on reload.
- The messaging feature is a placeholder and not yet implemented.
- Teacher reviews, student counts, and some statistics are static/dummy for UI demonstration.
- The app is designed for desktop and mobile browsers.

---

## UI Layout and Sidebar Implementation

The main application shell and sidebar are implemented in `src/app/template.tsx`.

- **Responsive Sidebar:**

  - The sidebar is hidden on mobile by default and can be toggled with a menu button.
  - On mobile, an overlay (`bg-black/25 backdrop-blur`) appears when the sidebar is open, allowing users to click outside to close it.
  - The sidebar slides in/out with a smooth transition using Tailwind's `transform` and `transition-transform` classes.
  - Sidebar navigation items are defined in an array and rendered dynamically, with badges for counts (e.g., number of teachers, unread messages).
  - The sidebar includes a header (app name, school), navigation, and a footer with user info and quick action buttons (settings, logout).

- **Top Header:**

  - Sticky header with app title, description, and notification bell (with badge).
  - The menu button toggles the sidebar on mobile.

- **Main Content:**

  - The main content area renders the current page's children.

- **Accessibility & UX:**
  - Sidebar and overlay are keyboard and screen-reader friendly.
  - Sidebar closes when clicking outside or on navigation (on mobile).
  - Uses Lucide icons for a modern look.

**Relevant code excerpt:**

```tsx
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
  ...
```

See `src/app/template.tsx` for the full implementation.
