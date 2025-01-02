import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../supabaseClient";
import LoadingSpinner from "../Components/LoadingSpinner";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

type Form = {
  id: string;
  title: string;
  createdDate: string;
  responsesCount: number;
  author: string;
};

type Response = {
  email: string;
  created_at: string;
  templateId: string;
};

const FormsPage: React.FC = () => {
  const { t } = useTranslation();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState<Response[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const navigateToRegister = () => {
    navigate("/sign-up");
  };
  useEffect(() => {
    const fetchForms = async () => {
      const email = localStorage.getItem("email");
      if (
        accessToken === "undefined" ||
        accessToken === null ||
        accessToken === ""
      ) {
        toast.error((t as any)("You must be logged in to submit answers"));
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const { data: templates, error: templatesError } = await supabase
          .from("templates")
          .select("id, title, created_at, author, gmail")
          .eq("gmail", email);
        if (templatesError) throw templatesError;

        const templatesWithResponses = await Promise.all(
          templates.map(async (template) => {
            const { data: uniqueEmails, error: emailsError } =
              await supabase.rpc("get_unique_emails", {
                template_id: template.id,
              });

            if (emailsError) throw emailsError;

            return {
              id: template.id,
              title: template.title,
              createdDate: template.created_at,
              responsesCount: uniqueEmails?.length || 0,
              author: template.author,
            };
          })
        );

        setForms(templatesWithResponses);
      } catch (error) {
        console.error((t as any)("Error loading forms"), error);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await supabase.from("answers").delete().eq("template_id", id);

      const { data: questions, error: questionsError } = await supabase
        .from("questions")
        .select("id")
        .eq("template_id", id);

      if (questionsError) throw questionsError;

      if (questions) {
        const questionIds = questions.map((q) => q.id);
        await supabase.from("options").delete().in("question_id", questionIds);
      }

      await supabase.from("questions").delete().eq("template_id", id);

      const { error } = await supabase.from("templates").delete().eq("id", id);
      if (error) throw error;
      toast((t as any)("SuccessDelete"));
      setForms(forms.filter((form) => form.id !== id));
    } catch (error) {
      console.error((t as any)("Error deleting form"), error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewResponses = async (id: string) => {
    setLoading(true);
    try {
      const { data: uniqueEmails, error } = await supabase.rpc(
        "get_unique_emails",
        { template_id: id }
      );
      if (error) throw error;
      const responsesWithId = uniqueEmails.map((response: Response) => ({
        ...response,
        templateId: id,
      }));
      setResponses(responsesWithId || []);
      setIsModalOpen(true);
    } catch (error) {
      console.error((t as any)("Error fetching responses"), error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="p-4 dark:bg-gray-800 dark:text-white">
      <h1 className="text-2xl font-bold mb-4">
        {(t as any)("FormsManagement")}
      </h1>{" "}
      {forms.length === 0 ? (
        <div className="text-center text-xl font-semibold text-gray-500 dark:text-gray-300">
          {(t as any)("NoFormsFound")}
        </div>
      ) : null}
      {!accessToken ||
      accessToken === "undefined" ||
      accessToken === null ||
      accessToken === "" ? (
        <div className="p-4 border border-yellow-500 bg-yellow-100 text-yellow-700 rounded-lg text-center">
          <h3 className="text-lg font-semibold">
            {(t as any)("PleaseRegister")}
          </h3>
          <button
            onClick={() => navigateToRegister()}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            {(t as any)("Register")}
          </button>
        </div>
      ) : loading ? (
        <div className="text-center">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="space-y-4">
          {forms.map((form) => (
            <div
              key={form.id}
              className="border p-4 rounded-lg bg-gray-100 dark:bg-gray-700"
            >
              <h3 className="text-lg font-semibold">{form.title}</h3>
              <p>
                {(t as any)("Created on")}:{" "}
                <span className="font-bold">
                  {formatDate(form.createdDate)}
                </span>
              </p>
              <p>
                {(t as any)("Responses")}:{" "}
                <span className="font-bold">{form.responsesCount}</span>
              </p>
              <p>
                {(t as any)("Author")}:{" "}
                <span className="font-bold">{form.author}</span>
              </p>
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => handleDelete(form.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  {(t as any)("Delete")}
                </button>
                <button
                  onClick={() => handleViewResponses(form.id)}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  {(t as any)("View Responses")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {isModalOpen && (
        <div
          id="select-modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">{(t as any)("Responses")}</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                ✖
              </button>
            </div>
            <ul className="space-y-2">
              {responses.map((response, index) => (
                <li
                  key={index}
                  className="border-b flex items-center gap-3 dark:border-gray-600 pb-2"
                >
                  <p>
                    {(t as any)("Email")}: {response.email}
                  </p>
                  <Link
                    className="bg-blue-500 px-1 rounded-sm text-white "
                    to={`/teamplate/check/answer/${response.templateId}`}
                  >
                    {(t as any)("CheckAnswer")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormsPage;
