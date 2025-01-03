import React, { useState, Dispatch, SetStateAction } from "react";
import { saveTemplateToSupabase } from "../func/uploadFunc";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "./LoadingSpinner";
import toast from "react-hot-toast";

type Option = {
  id: string;
  value: string;
  checked: boolean;
};

type Question = {
  id: string;
  title: string;
  description: string;
  type: "checkbox" | "radio" | "text" | "textarea" | "number";
  options?: Option[];
};

type Props = {
  showModal: boolean;
  templateData: {
    title: string;
    description: string;
    accessType: string;
    questions: Question[];
  };
  onClose: () => void;
  setTemplateData: Dispatch<SetStateAction<any>>;
};

const TemplatePreviewModal: React.FC<Props> = ({
  showModal,
  templateData,
  onClose,
  setTemplateData,
}) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  if (!showModal) return null;
  const author = localStorage.getItem("fullName");
  const email = localStorage.getItem("email");
  const handleSave = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (
      accessToken === "undefined" ||
      accessToken === null ||
      accessToken === ""
    ) {
      toast.error((t as any)("You must be logged in to submit answers"));
      return;
    }
    setIsSubmitting(true);
    try {
      await saveTemplateToSupabase(templateData, author, email, t);
      setTemplateData([]);
      onClose();
    } catch (error) {
      console.error("Error saving template:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-3/4 md:w-1/2 p-6 shadow-xl">
        <div className="flex items-center justify-between ">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            {(t as any)("Your template now looks like this")}:
          </h2>
          <span
            className="text-lg text-blue-500 cursor-pointer"
            onClick={onClose}
          >
            X
          </span>
        </div>

        <div className="mb-4">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
            {templateData.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {templateData.description}
          </p>
        </div>

        <ul className="space-y-4">
          {templateData.questions.map((question) => (
            <li
              key={question.id}
              className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg"
            >
              <strong className="text-lg text-gray-800 dark:text-white">
                {question.title}
              </strong>
              <p className="text-gray-500 dark:text-gray-300 mt-1">
                {question.description}
              </p>

              {question.type === "checkbox" || question.type === "radio" ? (
                <ul className="mt-2 space-y-2">
                  {question.options?.map((option) => (
                    <li key={option.id} className="flex items-center space-x-2">
                      <input
                        type={question.type}
                        name={question.id}
                        id={option.id}
                        value={option.value}
                        defaultChecked={option.checked}
                        disabled
                        className="cursor-not-allowed"
                      />
                      <label
                        htmlFor={option.id}
                        className="text-gray-600 dark:text-gray-300"
                      >
                        {option.value}
                      </label>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex justify-end">
          {isSubmitting ? (
            <div className="flex items-center">
              <LoadingSpinner />
            </div>
          ) : (
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-300"
            >
              {(t as any)("save")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplatePreviewModal;
