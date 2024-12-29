import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface Comment {
  id: string;
  content: string;
  author: string;
  created_at: string;
}

interface Props {
  comments: Comment[];
  onCommentSubmit: (e: React.FormEvent) => void;
  newComment: string;
  setNewComment: React.Dispatch<React.SetStateAction<string>>;
}
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
const CommentSection = ({
  comments,
  onCommentSubmit,
  newComment,
  setNewComment,
}: Props) => {
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newComment.trim() === "") {
      setError((t as any)("Comment cannot be empty"));
      return;
    }

    setError(null);
    onCommentSubmit(e);
  };

  return (
    <section className="dark:bg-gray-900 py-8 lg:py-16 antialiased  ">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
            Discussion ({comments.length})
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <label htmlFor="comment" className="sr-only">
              Your comment
            </label>
            <textarea
              id="comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
              placeholder="Write a comment..."
              required
            ></textarea>
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="inline-flex bg-blue-500 text-white items-center py-2.5 px-4 text-xs font-medium text-center bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
          >
            Post comment
          </button>
        </form>
        <article className=" text-base bg-white rounded-lg dark:bg-gray-900 h-[300px] overflow-y-scroll">
          {comments.map((comment) => (
            <footer
              key={comment.id}
              className="flex justify-between flex-col w-full border my-2 "
            >
              <div className="flex items-center justify-between  ">
                <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
                  {comment.author}{" "}
                </p>
                <span className="text-gray-400 text-xs">
                  {formatDate(comment.created_at)}
                </span>
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                {comment.content}
              </p>
            </footer>
          ))}
        </article>
      </div>
    </section>
  );
};

export default CommentSection;
