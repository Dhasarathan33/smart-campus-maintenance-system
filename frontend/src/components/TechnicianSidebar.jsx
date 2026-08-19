import {
  FaTachometerAlt,
  FaClipboardList,
  FaCog,
  FaSignOutAlt
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

function TechnicianSidebar() {

  const navigate = useNavigate();

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("user_id");
    localStorage.removeItem("full_name");
    localStorage.removeItem("role");

    navigate("/");

  };

  return (

    <aside className="w-20 shrink-0 min-h-screen bg-blue-900 text-white flex flex-col md:w-64">

      <div className="border-b border-blue-700 p-4 md:p-6">

        <h1 className="hidden text-2xl font-bold md:block">
          Smart Campus
        </h1>

        <p className="hidden text-sm text-blue-200 md:block">
          Technician Panel
        </p>

      </div>

      <nav className="mt-6 flex-1">

        <ul className="space-y-2">

          <li>

            <NavLink
              to="/technician-dashboard"
              className={({ isActive }) =>
                `flex items-center justify-center gap-3 px-3 py-3 md:justify-start md:px-6 ${
                  isActive ? "bg-blue-700" : "hover:bg-blue-700"
                }`
              }
            >
              <FaTachometerAlt className="shrink-0" />
              <span className="hidden md:inline">Dashboard</span>
            </NavLink>

          </li>

          <li>

            <NavLink
              to="/technician-assigned-complaints"
              className={({ isActive }) =>
                `flex items-center justify-center gap-3 px-3 py-3 md:justify-start md:px-6 ${
                  isActive ? "bg-blue-700" : "hover:bg-blue-700"
                }`
              }
            >
              <FaClipboardList className="shrink-0" />
              <span className="hidden md:inline">Assigned Complaints</span>
            </NavLink>

          </li>

          <li>
            <NavLink
              to="/technician-settings"
              className={({ isActive }) =>
                `flex items-center justify-center gap-3 px-3 py-3 md:justify-start md:px-6 ${
                  isActive ? "bg-blue-700" : "hover:bg-blue-700"
                }`
              }
            >
              <FaCog className="shrink-0" />
              <span className="hidden md:inline">Settings</span>
            </NavLink>
          </li>

        </ul>

      </nav>

      <div className="border-t border-blue-700 p-4 md:p-6">

        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-3 hover:text-red-300 md:justify-start"
        >
          <FaSignOutAlt />
          <span className="hidden md:inline">Logout</span>
        </button>

      </div>

    </aside>

  );

}

export default TechnicianSidebar;
