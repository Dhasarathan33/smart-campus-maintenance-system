import StudentSidebar from "../components/StudentSidebar";
import NotificationBell from "../components/NotificationBell";

function StudentLayout({ children }) {
  const fullName = localStorage.getItem("full_name") || "Student";
  const role = localStorage.getItem("role") || "Student";

  return (
    <div className="flex min-h-screen bg-gray-100">
      <StudentSidebar />

      <div className="min-w-0 flex-1 flex flex-col">
        <header className="min-h-16 gap-3 bg-white px-3 shadow-md flex items-center justify-between sm:px-6">
          <h1 className="min-w-0 flex-1 truncate text-base font-bold text-gray-800 sm:text-2xl">
            Smart Campus Maintenance System
          </h1>

          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <NotificationBell />

            <div className="hidden text-right sm:block">
              <h2 className="font-semibold text-gray-800">
                {fullName}
              </h2>

              <p className="text-sm text-gray-500">
                {role}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-700 font-bold text-white sm:h-10 sm:w-10">
              S
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1 overflow-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default StudentLayout;
