import React from "react";
import { useTranslation } from "react-i18next";

type TagsCloudProps = {
  tags: string[];
  onTagClick: (tag: string) => void;
};

const TagsCloud: React.FC<TagsCloudProps> = ({ tags, onTagClick }) => {
  const { t } = useTranslation();

  return (
    <div className="mt-10 mb-10">
      <h2 className="text-2xl font-semibold mb-5 dark:text-white">
        {(t as any)("TagsCloud")}
      </h2>
      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => onTagClick(tag)}
            className="bg-gray-200 dark:text-blue-600 dark:bg-gray-700 text-gray-800  px-3 py-1 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            #{tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TagsCloud;
