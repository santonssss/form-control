import React from "react";

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
};

const TemplatePreviewModal: React.FC<Props> = ({
  showModal,
  templateData,
  onClose,
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-3/4 md:w-1/2 p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Ваш шаблон теперь выглядит так:
        </h2>

        {/* Заголовок шаблона */}
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
            {templateData.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {templateData.description}
          </p>
        </div>

        {/* Вопросы и ответы */}
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

              {/* Опции для checkbox или radio */}
              {question.options && (
                <ul className="mt-2 pl-4">
                  {question.options.map((option) => (
                    <li
                      key={option.id}
                      className="text-gray-600 dark:text-gray-300"
                    >
                      {option.value}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        {/* Кнопка закрытия модалки */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-300"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreviewModal;
