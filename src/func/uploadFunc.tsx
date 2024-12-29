import toast from "react-hot-toast";
import { supabase } from "../supabaseClient";

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

type TemplateData = {
  title: string;
  description: string;
  accessType: string;
  questions: Question[];
};

export const saveTemplateToSupabase = async (
  templateData: TemplateData,
  author: any,
  gmail: any,
  t: any
) => {
  try {
    const { data: template, error: templateError } = await supabase
      .from("templates")
      .insert([
        {
          title: templateData.title,
          description: templateData.description,
          access_type: templateData.accessType,
          author: author,
          gmail: gmail,
        },
      ])
      .select();

    if (templateError) {
      throw new Error(
        `Ошибка при добавлении шаблона: ${templateError.message}`
      );
    }

    const templateId = template[0].id;

    for (const question of templateData.questions) {
      const { data: questionData, error: questionError } = await supabase
        .from("questions")
        .insert([
          {
            template_id: templateId,
            title: question.title,
            description: question.description,
            type: question.type,
          },
        ])
        .select();

      if (questionError) {
        throw new Error(
          `Ошибка при добавлении вопроса: ${questionError.message}`
        );
      }

      const questionId = questionData[0].id;

      if (question.options && question.options.length > 0) {
        const options = question.options.map((option) => ({
          question_id: questionId,
          value: option.value,
          checked: option.checked,
        }));

        const { error: optionsError } = await supabase
          .from("options")
          .insert(options);

        if (optionsError) {
          throw new Error(
            `Ошибка при добавлении опций для вопроса ${question.title}: ${optionsError.message}`
          );
        }
      }
    }
    toast.success((t as any)("Data saved successfully"));
    return { success: true };
  } catch (error) {
    toast.error((t as any)("Failed to save data"));
    return { success: false, error: error };
  }
};
export const incrementViews = async (templateId: string) => {
  try {
    const { data, error: fetchError } = await supabase
      .from("templates")
      .select("views")
      .eq("id", templateId)
      .single();

    if (fetchError) throw fetchError;

    const updatedViews = data.views + 1;

    const { data: updatedData, error: updateError } = await supabase
      .from("templates")
      .update({ views: updatedViews })
      .eq("id", templateId);

    if (updateError) throw updateError;
  } catch (error) {
    console.error("Error incrementing views:", error);
  }
};
export const hasUserLiked = async (templateId: string, email: string) => {
  const { data, error } = await supabase
    .from("likes")
    .select("id")
    .eq("template_id", templateId)
    .eq("email", email)
    .single();
  if (error) {
    console.error("Error checking if user has liked:", error);
    return false;
  }

  return data ? true : false;
};
export const addLike = async (templateId: string, email: string) => {
  const { error } = await supabase
    .from("likes")
    .insert([{ template_id: templateId, email }]);

  if (error) {
    console.error("Error adding like:", error);
    return false;
  }

  return true;
};
export const removeLike = async (templateId: string, email: string) => {
  const { error } = await supabase
    .from("likes")
    .delete()
    .eq("template_id", templateId)
    .eq("email", email);

  if (error) {
    console.error("Error removing like:", error);
    return false;
  }

  return true;
};
export const fetchTemplates = async (start: number, end: number) => {
  const { data, error } = await supabase
    .from("templates")
    .select("*")
    .order("created_at", { ascending: false })
    .range(start, end);

  if (error) throw error;
  return data;
};

interface Comment {
  id: string;
  content: string;
  author: string;
  created_at: string;
}

type FetchCommentsResponse = Comment[];

export const fetchComments = async (
  templateId: string
): Promise<FetchCommentsResponse> => {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("template_id", templateId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data as FetchCommentsResponse;
};

export const postComment = async (
  templateId: string,
  content: string
): Promise<void> => {
  const fullname = localStorage.getItem("fullName");
  const { data, error } = await supabase
    .from("comments")
    .insert([{ template_id: templateId, content, author: fullname }]);
  if (error) throw error;
};
