import React from "react";
import TemplateCard from "./TemplateCard";

type GalleryProps = {
  templates: {
    id: string;
    title: string;
    description: string;
    author: string;
  }[];
};

const Gallery: React.FC<GalleryProps> = ({ templates }) => {
  return (
    <div className="grid grid-cols-1   md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          title={template.title}
          description={template.description}
          author={template.author}
          onView={() => console.log(`Открыть шаблон ${template.id}`)}
        />
      ))}
    </div>
  );
};

export default Gallery;
