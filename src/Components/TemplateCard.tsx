import React from "react";
import { useTranslation } from "react-i18next";

type TemplateProps = {
  title: string;
  description: string;
  author: string;
  onView: () => void;
};

const TemplateCard: React.FC<TemplateProps> = ({
  title,
  description,
  author,
  onView,
}) => {
  const { t } = useTranslation();
  return (
    <div className="border dark:bg-gray-700 dark:text-white border-gray-300 rounded-lg p-4 shadow-md hover:shadow-lg transition">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-white mb-4">
        {description}
      </p>
      <p className="text-xs text-gray-500 dark:text-white mb-4">
        {(t as any)("Author")}: {author}
      </p>
      <button
        onClick={onView}
        className="bg-blue-500 dark:bg-gray-700 dark:text-white border border-white text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
      >
        {(t as any)("LookTeamplates")}
      </button>
    </div>
  );
};

export default TemplateCard;
