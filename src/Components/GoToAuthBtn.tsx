import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

type Props = {};

const GoToAuthBtn = (props: Props) => {
  const { t } = useTranslation();
  return (
    <Link
      to={"/sign-in"}
      className="text-gray-900 dark:text-white border border-gray-800 dark:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center  dark:border-gray-600 dark:focus:ring-gray-800"
    >
      {(t as any)("GoToAuth")}
    </Link>
  );
};

export default GoToAuthBtn;
