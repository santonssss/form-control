import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

type Props = {};

const Footer: React.FC<Props> = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-100  dark:bg-gray-800 text-gray-800 dark:text-gray-200 py-8">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Верхний блок футера */}
        <div className="flex flex-wrap justify-between items-center">
          {/* Логотип */}
          <div className="mb-4">
            <Link to="/" className="text-xl font-bold dark:text-white">
              Form-Control
            </Link>
          </div>

          {/* Социальные сети */}
          <div className="flex space-x-4 mb-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-500"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-400"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-700"
            >
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>

        {/* Нижний блок футера */}
        <div className="border-t border-gray-300 dark:border-gray-700 mt-4 pt-4 text-sm text-center">
          <p>
            {(t as any)("FooterCopy")} © {new Date().getFullYear()}{" "}
            Form-Control. {(t as any)("FooterRights")}.
          </p>
          <p>
            {(t as any)("FooterContact")}:
            <a
              href="mailto:sarvarkalmuratov370@gmail.com"
              className="ml-1 text-blue-500"
            >
              sarvarkalmuratov370@gmail.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
