import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import ToggleTheme from "./ToggleTheme";
import ToggleLanguage from "./ToggleLanguage";

const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { path: "/admin/users", label: (t as any)("UsersManagement") },
    { path: "/admin/templates", label: (t as any)("TemplatesManagement") },
    { path: "/admin/forms", label: (t as any)("FormsManagement") },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <div className="md:hidden">
        <button
          onClick={toggleSidebar}
          className="text-white bg-blue-500 p-2 rounded-full fixed top-4 right-42+ z-50"
        >
          {isSidebarOpen ? "X" : "☰"}
        </button>
      </div>
      <aside
        className={`fixed inset-0 bg-gray-100 dark:bg-gray-800 h-full flex flex-col transform transition-transform duration-300 md:relative md:w-64 md:flex md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b dark:border-gray-700">
          <h1 className="text-lg font-semibold dark:text-white">
            {(t as any)("AdminPanel")}
          </h1>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2 p-4">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `block p-2 rounded-lg ${
                      isActive
                        ? "bg-blue-500 text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="flex justify-between">
            <ToggleTheme />
            <ToggleLanguage />
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
