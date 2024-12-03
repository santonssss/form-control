import { useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {};

const ToggleTheme = (props: Props) => {
  const [dark, setDark] = useState(false);
  const { t } = useTranslation();

  const darkModeHandler = () => {
    setDark(!dark);
    document.body.classList.toggle("dark");
  };

  return (
    <button
      onClick={darkModeHandler}
      type="button"
      className="text-gray-900  dark:text-white border border-gray-800 dark:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center  dark:border-gray-600 dark:focus:ring-gray-800"
    >
      {dark ? (t as any)("darkMode") : (t as any)("LightMode")}
    </button>
  );
};

export default ToggleTheme;
