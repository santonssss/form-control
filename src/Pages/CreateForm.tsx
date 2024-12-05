// CreateForm.tsx
import React, { useState } from "react";
import Header from "../Components/Header";
import TemplateSettings from "../Components/TemplateSettings";
import TemplatePreviewModal from "../Components/TemplatePreviewModal"; // Импортируем модалку

type Props = {};

const CreateForm = (props: Props) => {
  const [showModal, setShowModal] = useState(false); // Состояние для показа модалки
  const [templateData, setTemplateData] = useState<any>(null); // Данные для модалки

  const handleSaveSettings = (settings: {
    title: string;
    description: string;
    accessType: string;
    questions: any[];
  }) => {
    console.log("Сохранённые настройки шаблона:", settings);
    setTemplateData(settings); // Сохраняем данные шаблона
    setShowModal(true); // Показываем модалку
  };

  const handleCloseModal = () => {
    setShowModal(false); // Закрываем модалку
  };

  return (
    <div className="dark:bg-gray-700 ">
      <Header />
      <div className="max-w-screen-xl mr-auto ml-auto">
        <TemplateSettings onSave={handleSaveSettings} />
      </div>

      {/* Модалка с предпросмотром */}
      <TemplatePreviewModal
        showModal={showModal}
        templateData={templateData}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default CreateForm;
