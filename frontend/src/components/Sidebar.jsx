import {
  FaTachometerAlt,
  FaClipboardList,
  FaTools,
  FaUsers,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {

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

    <aside className="w-64 shrink-0 min-h-screen overflow-hidden bg-blue-900 text-white flex flex-col">

      {/* Logo */}

      <div className="border-b border-blue-700 p-6">

        <h1 className="text-2xl font-bold">
          Smart Campus
        </h1>

        <p className="text-sm text-blue-200">
          Admin Panel
        </p>

      </div>

      {/* Menu */}

      <nav className="mt-6 flex-1">

        <ul className="space-y-2">

          <li>

            <NavLink
              to="/admin-dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 ${
                  isActive
                    ? "bg-blue-700"
                    : "hover:bg-blue-700"
                }`
              }
            >
              <FaTachometerAlt className="shrink-0" />
              Dashboard
            </NavLink>

          </li>

          <li>

            <NavLink
              to="/admin-complaints"
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 ${
                  isActive
                    ? "bg-blue-700"
                    : "hover:bg-blue-700"
                }`
              }
            >
              <FaClipboardList className="shrink-0" />
              Complaints
            </NavLink>

          </li>

          <li>

            <NavLink
              to="/admin-technicians"
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 ${
                  isActive
                    ? "bg-blue-700"
                    : "hover:bg-blue-700"
                }`
              }
            >
              <FaTools className="shrink-0" />
              Technicians
            </NavLink>

          </li>

          <li>

            <NavLink
              to="/admin-students"
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 ${
                  isActive
                    ? "bg-blue-700"
                    : "hover:bg-blue-700"
                }`
              }
            >
              <FaUsers className="shrink-0" />
              Students
            </NavLink>

          </li>

          <li>

            <NavLink
              to="/admin-reports"
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 ${
                  isActive
                    ? "bg-blue-700"
                    : "hover:bg-blue-700"
                }`
              }
            >
              <FaChartBar className="shrink-0" />
              Reports
            </NavLink>

          </li>

          <li>

            <NavLink
              to="/admin-settings"
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 ${
                  isActive
                    ? "bg-blue-700"
                    : "hover:bg-blue-700"
                }`
              }
            >
              <FaCog className="shrink-0" />
              Settings
            </NavLink>

          </li>

        </ul>

      </nav>

      {/* Logout */}

      <div className="border-t border-blue-700 p-6">

        <button
          onClick={logout}
          className="flex items-center gap-3 hover:text-red-300"
        >

          <FaSignOutAlt />

          Logout

        </button>

      </div>

    </aside>

  );

}

export default Sidebar;
