import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

type Props = {};

const GoToAuthBtn = (props: Props) => {
  const { t } = useTranslation();
  const access_token = localStorage.getItem("accessToken");
  const email = localStorage.getItem("email");

  const isAuth = () => {
    if (email === "" || email === undefined || email === null) {
      return true;
    } else {
      return false;
    }
  };
  return (
    <>
      {isAuth() ? (
        <Link
          to={"/sign-up"}
          className="text-gray-900 dark:text-white border border-gray-800 dark:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center  dark:border-gray-600 dark:focus:ring-gray-800"
        >
          {(t as any)("GoToAuth")}
        </Link>
      ) : (
        <span className="dark:text-white text-gray-900">{email}</span>
      )}
    </>
  );
};

export default GoToAuthBtn;
