import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import LoadingSpinner from "../Components/LoadingSpinner";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { Link, useParams } from "react-router-dom";

type Props = {};

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

const ViewToTemplate = (props: Props) => {
  const { id } = useParams<{ id: string }>();
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const { t } = useTranslation();

  const fetchTemplate = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("templates")
      .select(
        `*,
        questions!questions_template_id_fkey (
          * ,
          options!options_question_id_fkey (*)
        )`
      )
      .eq("id", id)
      .single();

    if (error) {
      console.log(error);
      toast.error((t as any)("Error finding template"));
      setLoading(false);
      return;
    }

    const formattedTemplate = {
      id: data.id,
      accessType: data.access_type,
      description: data.description,
      author: data.author,
      gmail: data.gmail,
      title: data.title,
      questions: data.questions.map((question: any) => ({
        id: question.id,
        type: question.type,
        title: question.title,
        description: question.description,
        options: question.options.map((option: any) => ({
          id: option.id,
          value: option.value,
          checked: option.checked,
        })),
      })),
    };

    setTemplate(formattedTemplate);
    setLoading(false);
  };

  const handleInputChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const gmail = localStorage.getItem("email");

    if (!accessToken) {
      toast.error((t as any)("You must be logged in to submit answers"));
      return;
    }

    if (!gmail) {
      toast.error((t as any)("Email is not available"));
      return;
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", gmail)
      .single();

    if (userError) {
      toast.error((t as any)("Error fetching user ID"));
      return;
    }

    const userId = userData?.id;

    if (!userId) {
      toast.error((t as any)("User not found"));
      return;
    }

    const { data: existingAnswers, error: existingAnswersError } =
      await supabase
        .from("answers")
        .select("id")
        .eq("user_id", userId)
        .eq("template_id", id)
        .limit(1);

    if (existingAnswersError) {
      toast.error((t as any)("Error checking existing answers"));
      return;
    }

    if (existingAnswers.length > 0) {
      toast.error(
        (t as any)("You have already submitted answers for this template")
      );
      return;
    }
    if (!template?.questions || template.questions.length === 0) {
      toast.error((t as any)("No questions found in the template"));
      return;
    }

    const unansweredQuestions =
      template.questions.filter(
        (question) =>
          !answers ||
          !answers[question.id] ||
          (Array.isArray(answers[question.id]) &&
            answers[question.id].length === 0)
      ) || [];

    if (unansweredQuestions.length > 0) {
      toast.error(
        (t as any)("Please answer all questions before submitting the form")
      );
      return;
    }
    const entries = Object.entries(answers).map(([questionId, answer]) => {
      const question = template?.questions.find((q) => q.id === questionId);

      if (!question) return null;

      if (typeof answer === "string") {
        return {
          user_id: userId,
          template_id: id,
          question_id: questionId,
          answer_text: answer,
          email: gmail,
        };
      } else if (Array.isArray(answer)) {
        return answer.map((optionId) => ({
          user_id: userId,
          template_id: id,
          question_id: questionId,
          option_id: optionId,
          email: gmail,
        }));
      }
    });

    const flattenedEntries = entries.flat().filter(Boolean);

    const { error } = await supabase.from("answers").insert(flattenedEntries);

    if (error) {
      toast.error((t as any)("Error submitting answers"));
    } else {
      toast.success((t as any)("Answers submitted successfully"));
    }
  };

  useEffect(() => {
    if (id) {
      fetchTemplate();
    }
  }, [id]);

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
        <span>{(t as any)("Template not found")}</span>
      </div>
    );
  }

  if (template.accessType === "private") {
    return (
      <div className="h-[100vh] w-full text-red-500 font-bold flex items-center justify-center">
        <span>
          {(t as any)("This template is private so it's shared with you")}
        </span>
        <Link className="ml-2 text-blue-500 font-mono text-xl" to={"/"}>
          {(t as any)("Back")}
        </Link>
      </div>
    );
  }

  return (
    <div className="transition-all duration-300 dark:bg-gray-800">
      <div className="dark:bg-gray-800 transition-all duration-300 max-w-7xl mx-auto bg-white">
        <Header />
        <div className="max-w-screen-lg h-[100vh] flex items-center justify-center mx-auto p-6 space-y-8">
          <div className="rounded-lg p-6 w-full bg-white dark:bg-gray-800 shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              {template.title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {(t as any)("author")}: {template.author} ({template.gmail})
            </p>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              {template.description}
            </p>

            <div className="mt-6">
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
                      className="mt-3 p-3 border border-gray-300 rounded-md w-full bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder={(t as any)("Your answer")}
                      onChange={(e) =>
                        handleInputChange(question.id, e.target.value)
                      }
                    />
                  )}
                  {question.type === "textarea" && (
                    <textarea
                      className="mt-3 p-3 border border-gray-300 rounded-md w-full bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder={(t as any)("Your answer")}
                      rows={4}
                      onChange={(e) =>
                        handleInputChange(question.id, e.target.value)
                      }
                    />
                  )}
                  {question.type === "number" && (
                    <input
                      type="number"
                      className="mt-3 p-3 border border-gray-300 rounded-md w-full bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder={(t as any)("Your answer")}
                      onChange={(e) =>
                        handleInputChange(question.id, e.target.value || "")
                      }
                    />
                  )}
                  {question.type === "checkbox" &&
                    question.options.map((option) => (
                      <div key={option.id} className="flex items-center mt-4">
                        <input
                          type="checkbox"
                          id={option.id}
                          className="mr-2 w-5 h-5 text-blue-500"
                          onChange={(e) => {
                            const value = answers[question.id] || [];
                            const updatedValue = e.target.checked
                              ? [...value, option.id]
                              : value.filter((id: string) => id !== option.id);
                            handleInputChange(question.id, updatedValue);
                          }}
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
                          id={option.id}
                          name={question.id}
                          className="mr-2 w-5 h-5 text-blue-500"
                          onChange={() =>
                            handleInputChange(question.id, option.id)
                          }
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

            <div className="flex items-center justify-end mt-4">
              <button
                className="bg-blue-600 text-white py-2 px-6 rounded-md shadow-lg hover:bg-blue-700 transition-all duration-300"
                onClick={handleSubmit}
              >
                {(t as any)("Send")}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ViewToTemplate;
