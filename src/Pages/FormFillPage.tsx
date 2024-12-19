import React, { useState } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

interface Template {
  id: string;
  accessType: string;
  description: string;
  author: string;
  gmail: string;
  title: string;
  questions: {
    id: string;
    type: string;
    title: string;
    description: string;
    options: { id: string; value: string; checked: boolean }[];
  }[];
}

interface Responses {
  [templateId: string]: {
    [questionId: string]: string | string[];
  };
}

export const FormFill: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: "1",
      accessType: "private",
      description: "how long your experience?",
      author: "Sarvar",
      gmail: "sarvarkalmuratov370@gmail.com",
      title: "title",
      questions: [
        {
          id: "1733820461638",
          type: "text",
          title: "How you long?",
          description: "Расскажите подробно",
          options: [],
        },
        {
          id: "1733820491706",
          type: "checkbox",
          title: "Какие фрукты вы любите?",
          description: "Выделите все",
          options: [
            { id: "1733820514718", value: "Апельсин", checked: false },
            { id: "1733820510062", value: "Банан", checked: false },
          ],
        },
        {
          id: "1733820491707",
          type: "radio",
          title: "Выберите свой любимый цвет",
          description: "Выберите один из вариантов",
          options: [
            { id: "1733820514720", value: "Красный", checked: false },
            { id: "1733820510063", value: "Синий", checked: false },
            { id: "1733820510064", value: "Зеленый", checked: false },
          ],
        },
      ],
    },
  ]);

  const [responses, setResponses] = useState<Responses>({
    "1": {
      "1733820461638": "",
      "1733820491706": [],
      "1733820491707": "",
    },
  });

  const handleInputChange = (
    templateId: string,
    questionId: string,
    value: string
  ) => {
    setResponses((prev: Responses) => ({
      ...prev,
      [templateId]: {
        ...prev[templateId],
        [questionId]: value,
      },
    }));
  };

  const handleCheckboxChange = (
    templateId: string,
    questionId: string,
    value: string
  ) => {
    setResponses((prev: Responses) => {
      const updatedResponses = prev[templateId]?.[questionId] || [];

      if (Array.isArray(updatedResponses)) {
        if (updatedResponses.includes(value)) {
          updatedResponses.splice(updatedResponses.indexOf(value), 1);
        } else {
          updatedResponses.push(value);
        }
      } else {
        let updatedResponses = [value];
      }

      return {
        ...prev,
        [templateId]: {
          ...prev[templateId],
          [questionId]: updatedResponses,
        },
      };
    });
  };

  const handleRadioChange = (
    templateId: string,
    questionId: string,
    value: string
  ) => {
    setResponses((prev: Responses) => ({
      ...prev,
      [templateId]: {
        ...prev[templateId],
        [questionId]: value,
      },
    }));
  };

  return (
    <div className="dark:bg-gray-700">
      <Header />
      <div className="max-w-screen-lg mx-auto p-6 space-y-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow-md"
          >
            <h2 className="text-xl font-semibold">{template.title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Автор: {template.author} ({template.gmail})
            </p>
            <p className="mt-2">{template.description}</p>

            <div className="mt-4">
              {template.questions.map((question) => (
                <div key={question.id} className="mb-4">
                  <h3 className="font-medium">{question.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {question.description}
                  </p>

                  {question.type === "text" && (
                    <input
                      type="text"
                      className="mt-2 p-2 border rounded w-full"
                      placeholder="Ваш ответ"
                      value={responses[template.id]?.[question.id] || ""}
                      onChange={(e) =>
                        handleInputChange(
                          template.id,
                          question.id,
                          e.target.value
                        )
                      }
                    />
                  )}

                  {question.type === "checkbox" &&
                    question.options.map((option) => (
                      <div key={option.id} className="flex items-center mt-2">
                        <input
                          type="checkbox"
                          id={option.id}
                          checked={responses[template.id]?.[
                            question.id
                          ]?.includes(option.value)}
                          onChange={() =>
                            handleCheckboxChange(
                              template.id,
                              question.id,
                              option.value
                            )
                          }
                          className="mr-2"
                        />
                        <label htmlFor={option.id}>{option.value}</label>
                      </div>
                    ))}

                  {question.type === "radio" &&
                    question.options.map((option) => (
                      <div key={option.id} className="flex items-center mt-2">
                        <input
                          type="radio"
                          id={option.id}
                          name={question.id}
                          checked={
                            responses[template.id]?.[question.id] ===
                            option.value
                          }
                          onChange={() =>
                            handleRadioChange(
                              template.id,
                              question.id,
                              option.value
                            )
                          }
                          className="mr-2"
                        />
                        <label htmlFor={option.id}>{option.value}</label>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default FormFill;
