import { useTranslation } from "react-i18next";
import i18n from "../i18n/config";

type Props = {};

const ToggleLanguage = (props: Props) => {
  const { t } = useTranslation();

  const toggleLanguage = async (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="lg:max-w-[200px] max-w-[100%]">
      <select
        onChange={(e) => {
          toggleLanguage(e.target.value);
        }}
        id="countries"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option value="en">{(t as any)("english")}</option>{" "}
        <option value="ru">{(t as any)("russian")}</option>{" "}
      </select>
    </div>
  );
};

export default ToggleLanguage;
