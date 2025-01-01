import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { incrementViews } from "../func/uploadFunc";

type TemplateProps = {
  title: string;
  description: string;
  author: string;
  views: any;
  id: string;
};

const TemplateCard: React.FC<TemplateProps> = ({
  title,
  description,
  author,
  id,
  views,
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
      <div className="flex items-center justify-between">
        <Link
          to={`/teamplate/${id}`}
          onClick={() => incrementViews(id)}
          className="bg-blue-500 dark:bg-gray-700 dark:text-white border border-white text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          {(t as any)("LookTeamplates")}
        </Link>
        <span>{views} ⚇</span>
      </div>
    </div>
  );
};

export default TemplateCard;
