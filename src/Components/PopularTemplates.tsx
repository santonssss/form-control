import React from "react";
import TemplateCard from "./TemplateCard";
import { useTranslation } from "react-i18next";

type PopularTemplatesProps = {
  templates: {
    id: string;
    title: string;
    description: string;
    author: string;
  }[];
};

const PopularTemplates: React.FC<PopularTemplatesProps> = ({ templates }) => {
  const { t } = useTranslation();

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-5 mt-5 dark:text-white">
        {(t as any)("Top5PopularTemplates")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            title={template.title}
            description={template.description}
            author={template.author}
            onView={() =>
              console.log(`Открыть популярный шаблон ${template.id}`)
            }
          />
        ))}
      </div>
    </div>
  );
};

export default PopularTemplates;
