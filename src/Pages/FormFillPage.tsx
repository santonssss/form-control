import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  fetchTemplates,
  fetchComments,
  postComment,
  incrementViews,
  hasUserLiked,
  addLike,
  removeLike,
} from "../func/uploadFunc";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import CommentSection from "../Components/CommentSection";
import LoadingSpinner from "../Components/LoadingSpinner";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { supabase } from "../supabaseClient";

interface Template {
  id: string;
  title: string;
  description: string;
}

interface Comment {
  id: string;
  content: string;
  author: string;
  created_at: string;
}

const FormFillPage = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");

  const [currentTemplate, setCurrentTemplate] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const { t } = useTranslation();
  const limit = 10;
  const [likedTemplates, setLikedTemplates] = useState<Map<string, boolean>>(
    new Map()
  );
  const loadTemplates = async () => {
    setLoading(true);

    const start = page * limit;
    const end = start + limit;

    try {
      const data = await fetchTemplates(start, limit);
      if (data.length < limit) {
        setHasMore(false);
      }

      setTemplates((prev) => {
        const prevIds = prev.map((template) => template.id);
        const uniqueData = data.filter(
          (template) => !prevIds.includes(template.id)
        );

        return [...prev, ...shuffleArray(uniqueData)];
      });

      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const shuffleArray = (array: Template[]): Template[] => {
    return array.sort(() => Math.random() - 0.5);
  };

  const loadCommentsRealtime = async (templateId: string) => {
    if (currentTemplate === templateId) {
      setComments([]);
      setCurrentTemplate(null);
      return;
    }

    setLoading(true);
    try {
      const data = await fetchComments(templateId);
      setComments(data);

      setCurrentTemplate(templateId);

      const channel = supabase
        .channel(`public:comments:template_${templateId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "comments",
            filter: `template_id=eq.${templateId}`,
          },
          (payload) => {
            if (payload.eventType === "INSERT") {
              console.log("insert");

              setComments((prev) => [...prev, payload.new as Comment]);
            } else if (payload.eventType === "DELETE") {
              console.log("delete");

              setComments((prev) =>
                prev.filter((comment) => comment.id !== payload.old.id)
              );
            } else if (payload.eventType === "UPDATE") {
              console.log("update");

              setComments((prev) =>
                prev.map((comment) =>
                  comment.id === payload.new.id
                    ? (payload.new as Comment)
                    : comment
                )
              );
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() === "") return;

    if (currentTemplate) {
      try {
        const { data, error } = await postComment(currentTemplate, newComment);

        if (error) {
          console.error("Error posting comment:", error);
          return;
        }

        if (data) {
          setComments((prev) => [
            ...prev,
            {
              id: data.id,
              content: newComment,
              author: localStorage.getItem("email") || "Anonymous",
              created_at: new Date().toISOString(),
            },
          ]);

          setNewComment("");
        }
      } catch (error) {
        console.error("Error in handleCommentSubmit:", error);
      }
    }
  };

  const handleLikeClick = async (templateId: string) => {
    const email = localStorage.getItem("email");

    if (!email) {
      toast.error((t as any)("You must be logged in to submit answers"));
      return;
    }

    const isLiked = likedTemplates.get(templateId);

    if (isLiked) {
      await removeLike(templateId, email);
      setLikedTemplates((prev) => new Map(prev).set(templateId, false));
    } else {
      await addLike(templateId, email);
      setLikedTemplates((prev) => new Map(prev).set(templateId, true));
    }
  };

  useEffect(() => {
    loadTemplates();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const checkLikes = async () => {
      const email = localStorage.getItem("email");

      if (email) {
        const templateLikes: Map<string, boolean> = new Map();
        for (const template of templates) {
          const liked = await hasUserLiked(template.id, email);
          templateLikes.set(template.id, liked);
        }
        setLikedTemplates(templateLikes);
      }
    };

    checkLikes();
  }, [templates]);

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 5 && !loading && hasMore) {
      loadTemplates();
    }
  };

  return (
    <>
      <div className="dark:bg-gray-700 min-h-[100vh]">
        <Header />
        <div className="max-w-screen-lg mx-auto p-6 space-y-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="p-4 mb-4 bg-white rounded-lg shadow dark:bg-gray-800"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {template.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {template.description}
              </p>
              <div className="flex items-center gap-3 mt-4">
                <span
                  className="cursor-pointer"
                  onClick={() => handleLikeClick(template.id)}
                >
                  {likedTemplates.get(template.id) ? "❤️" : "🤍"}
                </span>
                <Link
                  to={`/teamplate/${template.id}`}
                  onClick={() => incrementViews(template.id)}
                  className="text-gray-900 dark:text-white border border-gray-800 dark:bg-blue-500 font-medium rounded-lg text-sm px-5 py-2.5"
                >
                  Посмотреть шаблон
                </Link>
                <button
                  onClick={() => loadCommentsRealtime(template.id)}
                  className="text-gray-900 dark:text-white border border-gray-800 dark:bg-blue-500 font-medium rounded-lg text-sm px-5 py-2.5"
                >
                  Комментарии &#128173;
                </button>
              </div>
              {currentTemplate === template.id && (
                <div className="mt-4">
                  <CommentSection
                    comments={comments}
                    onCommentSubmit={handleCommentSubmit}
                    newComment={newComment}
                    setNewComment={setNewComment}
                  />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex justify-center">
              <LoadingSpinner />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FormFillPage;
