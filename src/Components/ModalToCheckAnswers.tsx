import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { useTranslation } from "react-i18next";
import { supabase } from "../supabaseClient";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import { Link } from "react-router-dom";

type Props = {};

interface Template {
  id: string;
  questions: {
    id: string;
    type: string;
    title: string;
    description: string;
    options: { id: string; value: string; checked: boolean }[];
  }[];
}

const ModalToCheckAnswers = (props: Props) => {
  const [template, setTemplate] = useState<Template | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const { id } = useParams();
  const userEmail = localStorage.getItem("email");
  const accessToken = localStorage.getItem("accessToken");
  const fetchTemplateAndAnswers = async () => {
    setLoading(true);

    try {
      const { data: templateData, error: templateError } = await supabase
        .from("templates")
        .select(
          `*,
    questions!fk_template (
      id,
      type,
      title,
      description,
      options!fk_question (
        id,
        value,
        checked
      )
    )`
        )
        .eq("id", id);

      if (templateError) throw templateError;

      const { data: answersData, error: answersError } = await supabase
        .from("answers")
        .select("question_id, answer_text, option_id")
        .eq("template_id", id)
        .eq("email", userEmail);

      if (answersError) throw answersError;

      const formattedAnswers = answersData.reduce((acc: any, answer: any) => {
        if (answer.option_id) {
          acc[answer.question_id] = acc[answer.question_id] || [];
          acc[answer.question_id].push(answer.option_id);
        } else {
          acc[answer.question_id] = answer.answer_text;
        }
        return acc;
      }, {});

      setTemplate(templateData[0]);
      setAnswers(formattedAnswers);
    } catch (error) {
      console.error((t as any)("Error loading data"), error);
      toast.error((t as any)("Error loading data"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && userEmail) fetchTemplateAndAnswers();
  }, [id, userEmail]);
  if (
    accessToken === "undefined" ||
    accessToken === null ||
    accessToken === ""
  ) {
    return (
      <div className="h-[100vh] gap-3 text-red-500 flex items-center justify-center font-mono">
        <span> {(t as any)("PleaseRegister")}</span>
        <Link className="text-blue-400 cursor-pointer" to={"/sign-up"}>
          {(t as any)("Back")}
        </Link>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="h-[100vh] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!template) {
    return (
      <div className="h-[100vh] flex items-center justify-center">
        <p className="text-gray-700 dark:text-gray-300">
          {(t as any)("Template not found")}
        </p>
      </div>
    );
  }

  return (
    <div className="transition-all duration-300 dark:bg-gray-800">
      <div className="dark:bg-gray-800 transition-all duration-300 max-w-7xl mx-auto bg-white">
        <Header />
        <div className="max-w-screen-lg mx-auto p-6 space-y-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {(t as any)("Answers for Template")} {template.id}
          </h2>
          {template.questions.map((question) => (
            <div key={question.id} className="mb-6">
              <h3 className="font-medium text-lg text-gray-800 dark:text-gray-100">
                {question.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {question.description}
              </p>
              {question.type === "text" && (
                <input
                  type="text"
                  value={answers[question.id] || ""}
                  readOnly
                  className="mt-3 p-3 border border-gray-300 rounded-md w-full bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              )}
              {question.type === "number" && (
                <input
                  type="number"
                  value={answers[question.id] || ""}
                  readOnly
                  className="mt-3 p-3 border border-gray-300 rounded-md w-full bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              )}
              {question.type === "textarea" && (
                <textarea
                  value={answers[question.id] || ""}
                  readOnly
                  className="mt-3 p-3 border border-gray-300 rounded-md w-full bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              )}

              {question.type === "checkbox" &&
                question.options.map((option) => (
                  <div key={option.id} className="flex items-center mt-4">
                    <input
                      type="checkbox"
                      checked={(answers[question.id] || []).includes(option.id)}
                      readOnly
                      className="mr-2 w-5 h-5 text-blue-500"
                    />
                    <label
                      htmlFor={option.id}
                      className="text-gray-700 dark:text-gray-300"
                    >
                      {option.value}
                    </label>
                  </div>
                ))}

              {question.type === "radio" &&
                question.options.map((option) => (
                  <div key={option.id} className="flex items-center mt-4">
                    <input
                      type="radio"
                      checked={answers[question.id] === option.id}
                      readOnly
                      className="mr-2 w-5 h-5 text-blue-500"
                    />
                    <label
                      htmlFor={option.id}
                      className="text-gray-700 dark:text-gray-300"
                    >
                      {option.value}
                    </label>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ModalToCheckAnswers;
