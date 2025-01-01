import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { t } from "i18next";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import LoadingSpinner from "../Components/LoadingSpinner";
import { useNavigate } from "react-router-dom";
interface Option {
  id: string;
  value: string;
  checked: boolean;
}

interface Question {
  id: string;
  template_id?: string;
  type: string;
  title: string;
  description: string;
  options: Option[];
}

interface Template {
  id: string;
  access_type: string;
  description: string;
  author: string;
  gmail: string;
  title: string;
  likes: number;
  views: number;
  created_at: string;
  updated_at: string;
  questions: Question[];
}

const TemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const questionTypes = [
    { value: "text", label: (t as any)("Text") },
    { value: "textarea", label: (t as any)("Textarea") },
    { value: "number", label: (t as any)("Number") },
    { value: "checkbox", label: (t as any)("Checkbox") },
    { value: "radio", label: (t as any)("Radio") },
  ];
  const navigateToRegister = () => {
    navigate("/sign-up");
  };
  const accessToken = localStorage.getItem("accessToken");
  useEffect(() => {
    if (
      accessToken === "undefined" ||
      accessToken === null ||
      accessToken === ""
    ) {
      toast.error((t as any)("You must be logged in to submit answers"));
      return;
    }
    const fetchTemplates = async () => {
      const gmail = localStorage.getItem("email");
      if (!gmail) return;

      setLoading(true);
      setError(null);

      try {
        const pageSize = 10;
        const offset = (currentPage - 1) * pageSize;

        const {
          data: templatesData,
          error: templatesError,
          count,
        } = await supabase
          .from("templates")
          .select("*", { count: "exact" })
          .eq("gmail", gmail)
          .range(offset, offset + pageSize - 1);

        if (templatesError || !templatesData) {
          throw new Error(
            templatesError?.message || "Failed to fetch templates"
          );
        }

        const totalTemplatesCount = count ?? 0;
        setTotalPages(Math.ceil(totalTemplatesCount / pageSize));
        const templateIds = templatesData.map((t) => t.id);

        const { data: questionsData, error: questionsError } = await supabase
          .from("questions")
          .select("*")
          .in("template_id", templateIds);

        if (questionsError) {
          throw new Error(
            questionsError.message || "Failed to fetch questions"
          );
        }
        const { data: optionsData, error: optionsError } = await supabase
          .from("options")
          .select("*")
          .in(
            "question_id",
            questionsData.map((q) => q.id)
          );

        if (optionsError) {
          throw new Error(optionsError.message || "Failed to fetch options");
        }

        const optionsByQuestion = optionsData?.reduce((acc, option) => {
          if (!acc[option.question_id]) {
            acc[option.question_id] = [];
          }
          acc[option.question_id].push(option);
          return acc;
        }, {} as Record<string, any[]>);

        const questionsWithOptions = questionsData.map((question) => ({
          ...question,
          options: optionsByQuestion[question.id] || [],
        }));

        const templatesWithDetails = templatesData.map((template) => ({
          ...template,
          questions: questionsWithOptions.filter(
            (question) => question.template_id === template.id
          ),
        }));

        setTemplates(templatesWithDetails as Template[]);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [currentPage]);

  const handleEditClick = (template: Template) => {
    setEditingTemplate(template);
    setIsEditing(true);
  };

  const handleTemplateChange = (field: keyof Template, value: any) => {
    if (editingTemplate) {
      setEditingTemplate({ ...editingTemplate, [field]: value });
    }
  };

  const handleQuestionChange = (
    questionId: string,
    field: keyof Question,
    value: any
  ) => {
    if (editingTemplate) {
      setEditingTemplate({
        ...editingTemplate,
        questions: editingTemplate.questions.map((q) =>
          q.id === questionId ? { ...q, [field]: value } : q
        ),
      });
    }
  };

  const handleAddQuestion = () => {
    if (editingTemplate) {
      const newQuestion: Question = {
        id: uuidv4(),
        title: "",
        description: "",
        type: "text",
        options: [],
      };
      setEditingTemplate({
        ...editingTemplate,
        questions: [...editingTemplate.questions, newQuestion],
      });
    }
  };

  const handleAddOption = (questionId: string) => {
    if (editingTemplate) {
      const newOption: Option = { id: uuidv4(), value: "", checked: false };
      setEditingTemplate({
        ...editingTemplate,
        questions: editingTemplate.questions.map((q) =>
          q.id === questionId ? { ...q, options: [...q.options, newOption] } : q
        ),
      });
    }
  };

  const handleRemoveOption = (questionId: string, optionId: string) => {
    if (editingTemplate) {
      setEditingTemplate({
        ...editingTemplate,
        questions: editingTemplate.questions.map((q) =>
          q.id === questionId
            ? {
                ...q,
                options: q.options.filter((option) => option.id !== optionId),
              }
            : q
        ),
      });
    }
  };

  const handleSaveChanges = async () => {
    if (!editingTemplate) return;

    setIsLoading(true);
    const { id, questions, ...templateData } = editingTemplate;

    const { error: updateError } = await supabase
      .from("templates")
      .update(templateData)
      .eq("id", id);

    if (updateError) {
      console.error(updateError);
      return;
    }

    for (const question of questions) {
      const { id: questionId, options, ...questionData } = question;

      await supabase.from("questions").upsert({
        id: questionId,
        template_id: id,
        ...questionData,
      });

      const { data: existingOptions, error: existingOptionsError } =
        await supabase
          .from("options")
          .select("id")
          .eq("question_id", questionId);

      if (existingOptionsError) {
        console.error(existingOptionsError);
        toast.error((t as any)("Failed to save data"));
        return;
      }

      const existingOptionIds = existingOptions.map((option) => option.id);
      const optionIdsToDelete = existingOptionIds.filter(
        (optionId) => !options.some((option) => option.id === optionId)
      );

      if (optionIdsToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from("options")
          .delete()
          .in("id", optionIdsToDelete);

        if (deleteError) {
          console.error(deleteError);
          return;
        }
      }

      for (const option of options) {
        await supabase
          .from("options")
          .upsert({ question_id: questionId, ...option });
      }
    }

    setIsLoading(false);
    setIsEditing(false);
    setEditingTemplate(null);
    toast.success((t as any)("Data saved successfully"));
  };
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const handleCancel = () => {
    setIsEditing(false);
    setEditingTemplate(null);
  };

  return (
    <div className="p-4 text-gray-800 dark:text-gray-100">
      <h2 className="text-2xl font-bold mb-4">
        {(t as any)("TemplatesManagement")}
      </h2>
      {accessToken === "undefined" ||
      accessToken === null ||
      accessToken === "" ? (
        <div className="p-4 border border-yellow-500 bg-yellow-100 text-yellow-700 rounded-lg text-center">
          <h3 className="text-lg font-semibold">
            {(t as any)("PleaseRegister")}
          </h3>
          <p>{(t as any)("AccessRestricted")}</p>
          <button
            onClick={() => navigateToRegister()}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            {(t as any)("Register")}
          </button>
        </div>
      ) : error ? (
        <div className="p-4 border border-red-500 bg-red-100 text-red-700 rounded-lg text-center">
          <h3 className="text-lg font-semibold">{(t as any)("Error")}</h3>
          <p>{(t as any)("FailedToLoadData")}</p>
        </div>
      ) : loading ? (
        <LoadingSpinner />
      ) : (
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
                  {template.access_type}
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
      )}
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
                value={editingTemplate.access_type}
                onChange={(e) =>
                  handleTemplateChange("access_type", e.target.value)
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
                  {isLoading ? <LoadingSpinner /> : (t as any)("SaveChanges")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}{" "}
      <div className="mt-8 flex justify-between ">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-md"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          {(t as any)("Previous")}
        </button>
        <span className="text-xl">
          {currentPage} / {totalPages}
        </span>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-md"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          {(t as any)("Next")}
        </button>
      </div>
    </div>
  );
};

export default TemplatesPage;
