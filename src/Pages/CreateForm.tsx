import React, { useState } from "react";
import Header from "../Components/Header";
import TemplateSettings from "../Components/TemplateSettings";
import TemplatePreviewModal from "../Components/TemplatePreviewModal";

type Props = {};

const CreateForm = (props: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [templateData, setTemplateData] = useState<any>(null);

  const handleSaveSettings = (settings: {
    title: string;
    description: string;
    accessType: string;
    questions: any[];
  }) => {
    setTemplateData(settings);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="dark:bg-gray-700 min-h-[100vh] ">
      <Header />
      <div className="max-w-screen-xl mr-auto ml-auto w-[95%]">
        <TemplateSettings onSave={handleSaveSettings} />
      </div>

      <TemplatePreviewModal
        showModal={showModal}
        templateData={templateData}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default CreateForm;
