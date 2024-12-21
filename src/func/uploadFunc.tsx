import toast from "react-hot-toast";
import { supabase } from "../supabaseClient";
import { useTranslation } from "react-i18next";

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
    toast((t as any)("Data saved successfully"));
    return { success: true };
  } catch (error) {
    toast((t as any)("Failed to save data"));
    return { success: false, error: error };
  }
};
