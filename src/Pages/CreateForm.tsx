import React from "react";
import Header from "../Components/Header";
import TemplateSettings from "../Components/TemplateSettings";

type Props = {};

const CreateForm = (props: Props) => {
  const handleSaveSettings = (settings: {
    title: string;
    description: string;
    accessType: string;
  }) => {
    console.log("Сохранённые настройки шаблона:", settings);
  };
  return (
    <div className="dark:bg-gray-700 ">
      <Header />
      <div className="max-w-screen-xl mr-auto ml-auto">
        <TemplateSettings onSave={handleSaveSettings} />
      </div>
    </div>
  );
};

export default CreateForm;
