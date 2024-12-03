import React, { useState } from "react";
import { Link } from "react-router-dom";
import ToggleTheme from "./ToggleTheme";
import ToggleLanguage from "./ToggleLanguage";
import { useTranslation } from "react-i18next";
import GoToAuthBtn from "./GoToAuthBtn";

type Props = {};

const Header = (props: Props) => {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white text-white p-4 dark:bg-gray-800 dark:text-white">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        {/* Логотип */}
        <div className="text-xl font-bold text-black dark:text-white">
          <Link to="/" className="hover:text-gray-300">
            Form-Control
          </Link>
        </div>

        {/* Чекбокс/меню для мобильных */}
        <div className="md:hidden flex items-center gap-5">
          {/* Кнопка для управления меню */}
          <button
            className="text-black dark:text-white focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="text-xl">&#9776;</span>
          </button>
          {/* Кнопка "Войти" */}
          <GoToAuthBtn />
        </div>

        {/* Навигация для десктопа */}
        <nav className="hidden md:flex space-x-4">
          <Link
            to="/"
            className="hover:text-gray-300 text-black dark:text-white"
          >
            {(t as any)("Home")}
          </Link>
          <Link
            to="/create"
            className="hover:text-gray-300 text-black dark:text-white"
          >
            {(t as any)("Create-Form")}
          </Link>
          <Link
            to="/admin"
            className="hover:text-gray-300 text-black dark:text-white"
          >
            {(t as any)("Admin-Panel")}
          </Link>
          <Link
            to="/profile"
            className="hover:text-gray-300 text-black dark:text-white"
          >
            {(t as any)("Profile")}
          </Link>
          <Link
            to="/formFill"
            className="hover:text-gray-300 text-black dark:text-white"
          >
            {(t as any)("Form-Fill")}
          </Link>
        </nav>

        {/* Переключатели для десктопа */}
        <div className="hidden md:flex items-center justify-center space-x-4">
          <ToggleTheme />
          <ToggleLanguage />
          <GoToAuthBtn />
        </div>
      </div>

      {/* Мобильное меню */}
      {menuOpen && (
        <div className="md:hidden bg-gray-100 dark:bg-gray-700 text-black dark:text-white">
          <nav className="flex flex-col space-y-2 p-4">
            <Link
              to="/"
              className="hover:text-gray-300 text-black dark:text-white"
              onClick={() => setMenuOpen(false)}
            >
              {(t as any)("Home")}
            </Link>
            <Link
              to="/create"
              className="hover:text-gray-300 text-black dark:text-white"
              onClick={() => setMenuOpen(false)}
            >
              {(t as any)("Create-Form")}
            </Link>
            <Link
              to="/admin"
              className="hover:text-gray-300 text-black dark:text-white"
              onClick={() => setMenuOpen(false)}
            >
              {(t as any)("Admin-Panel")}
            </Link>
            <Link
              to="/profile"
              className="hover:text-gray-300 text-black dark:text-white"
              onClick={() => setMenuOpen(false)}
            >
              {(t as any)("Profile")}
            </Link>
            <Link
              to="/formFill"
              className="hover:text-gray-300 text-black dark:text-white"
              onClick={() => setMenuOpen(false)}
            >
              {(t as any)("Form-Fill")}
            </Link>
          </nav>

          {/* Переключатели внутри мобильного меню */}
          <div className="flex flex-col space-y-2 p-4 border-t border-gray-300 dark:border-gray-600">
            <ToggleTheme />
            <ToggleLanguage />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
