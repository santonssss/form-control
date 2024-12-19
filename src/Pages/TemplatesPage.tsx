import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";

interface Option {
  id: string;
  value: string;
  checked?: boolean;
}

interface Question {
  id: string;
  type: string;
  title: string;
  description: string;
  options: Option[];
}

interface Template {
  id: string;
  gmail: string;
  title: string;
  author: string;
  accessType: string;
  description: string;
  questions: Question[];
}

const TemplatesPage: React.FC = () => {
  const { t } = useTranslation();
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
      ],
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

  const questionTypes = [
    { value: "text", label: (t as any)("Text") },
    { value: "checkbox", label: (t as any)("Checkbox") },
    { value: "radio", label: (t as any)("Radio") },
    { value: "number", label: (t as any)("number") },
  ];

  const handleEditClick = (template: Template) => {
    setEditingTemplate(template);
    setIsEditing(true);
  };

  const handleSaveChanges = () => {
    if (editingTemplate) {
      setTemplates((prevTemplates) =>
        prevTemplates.map((template) =>
          template.id === editingTemplate.id ? editingTemplate : template
        )
      );
      setIsEditing(false);
      setEditingTemplate(null);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingTemplate(null);
  };

  const handleTemplateChange = (field: keyof Template, value: any) => {
    if (!editingTemplate) return;
    setEditingTemplate({ ...editingTemplate, [field]: value });
  };

  const handleQuestionChange = (
    questionId: string,
    field: keyof Question,
    value: any
  ) => {
    if (!editingTemplate) return;
    const updatedQuestions = editingTemplate.questions.map((question) =>
      question.id === questionId ? { ...question, [field]: value } : question
    );
    setEditingTemplate({ ...editingTemplate, questions: updatedQuestions });
  };

  const handleAddQuestion = () => {
    if (!editingTemplate) return;
    const newQuestion: Question = {
      id: uuidv4(),
      type: "text",
      title: "",
      description: "",
      options: [],
    };
    setEditingTemplate({
      ...editingTemplate,
      questions: [...editingTemplate.questions, newQuestion],
    });
  };

  const handleAddOption = (questionId: string) => {
    if (!editingTemplate) return;

    const updatedQuestions = editingTemplate.questions.map((question) =>
      question.id === questionId
        ? {
            ...question,
            options: [
              ...question.options,
              { id: uuidv4(), value: "", checked: false },
            ],
          }
        : question
    );

    setEditingTemplate({ ...editingTemplate, questions: updatedQuestions });
  };

  const handleRemoveOption = (questionId: string, optionId: string) => {
    if (!editingTemplate) return;

    const updatedQuestions = editingTemplate.questions.map((question) =>
      question.id === questionId
        ? {
            ...question,
            options: question.options.filter(
              (option) => option.id !== optionId
            ),
          }
        : question
    );

    setEditingTemplate({ ...editingTemplate, questions: updatedQuestions });
  };

  return (
    <div className="p-4 text-gray-800 dark:text-gray-100">
      <h2 className="text-2xl font-bold mb-4">
        {(t as any)("TemplatesManagement")}
      </h2>
      <div className="space-y-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className="border rounded-lg p-4 bg-gray-100 dark:bg-gray-800"
          >
            <h3 className="text-lg font-semibold">{template.title}</h3>
            <p>
              {(t as any)("Description")}:{" "}
              <span className="text-xl font-semibold text-gray-900 dark:text-white">
                {template.description}
              </span>
            </p>
            <p>
              {(t as any)("Author")}:{" "}
              <span className="text-xl font-semibold text-gray-900 dark:text-white">
                {template.author}
              </span>
            </p>
            <p>
              {(t as any)("AccessType")}:{" "}
              <span className="text-xl font-semibold text-gray-900 dark:text-white">
                {template.accessType}
              </span>
            </p>
            <button
              onClick={() => handleEditClick(template)}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {(t as any)("EditTemplate")}
            </button>
          </div>
        ))}
      </div>

      {isEditing && editingTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-11/12 max-w-4xl overflow-y-auto max-h-screen">
            <h3 className="text-xl font-semibold mb-4">
              {(t as any)("EditTemplate")}
            </h3>
            <div className="space-y-4">
              <label className="block text-sm font-medium mb-2">
                {(t as any)("TemplateTitle")}
              </label>
              <input
                type="text"
                value={editingTemplate.title}
                onChange={(e) => handleTemplateChange("title", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              />
              <label className="block text-sm font-medium mb-2">
                {(t as any)("TemplateDescription")}
              </label>
              <textarea
                value={editingTemplate.description}
                onChange={(e) =>
                  handleTemplateChange("description", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                rows={3}
              />
              <label className="block text-sm font-medium mb-2">
                {(t as any)("AccessType")}
              </label>
              <select
                value={editingTemplate.accessType}
                onChange={(e) =>
                  handleTemplateChange("accessType", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="private">{(t as any)("Private")}</option>
                <option value="public">{(t as any)("Public")}</option>
              </select>
              {editingTemplate.questions.map((question, index) => (
                <div key={question.id} className="border p-4 rounded-lg">
                  <h4 className="font-medium">
                    {(t as any)("Question")} {index + 1}
                  </h4>
                  <label className="block text-sm font-medium mb-2">
                    {(t as any)("QuestionTitle")}
                  </label>
                  <input
                    type="text"
                    value={question.title}
                    onChange={(e) =>
                      handleQuestionChange(question.id, "title", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                  />
                  <label className="block text-sm font-medium mt-2 mb-2">
                    {(t as any)("QuestionDescription")}
                  </label>
                  <textarea
                    value={question.description}
                    onChange={(e) =>
                      handleQuestionChange(
                        question.id,
                        "description",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                    rows={3}
                  />
                  <label className="block text-sm font-medium mt-2 mb-2">
                    {(t as any)("QuestionType")}
                  </label>
                  <select
                    value={question.type}
                    onChange={(e) =>
                      handleQuestionChange(question.id, "type", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                  >
                    {questionTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {question.type !== "text" && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium">
                        {(t as any)("Options")}
                      </h4>
                      {question.options.map((option) => (
                        <div
                          key={option.id}
                          className="flex items-center mt-2 space-x-2"
                        >
                          <input
                            type="text"
                            value={option.value}
                            onChange={(e) =>
                              handleQuestionChange(question.id, "options", [
                                ...question.options.map((opt) =>
                                  opt.id === option.id
                                    ? { ...opt, value: e.target.value }
                                    : opt
                                ),
                              ])
                            }
                            className="w-full p-2 border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                          />
                          <button
                            onClick={() =>
                              handleRemoveOption(question.id, option.id)
                            }
                            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            {(t as any)("Remove")}
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => handleAddOption(question.id)}
                        className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        {(t as any)("AddOption")}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handleAddQuestion}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                {(t as any)("AddQuestion")}
              </button>
              <div className="flex space-x-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover
:bg-gray-400"
                >
                  {(t as any)("Cancel")}
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  {(t as any)("SaveChanges")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplatesPage;
