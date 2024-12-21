import { supabase } from "../supabaseClient"; // Ваш клиент Supabase

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
  gmail: any
) => {
  try {
    // 1. Вставляем шаблон в таблицу templates
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
      .select(); // Используем select(), чтобы вернуть созданный шаблон с id

    if (templateError) {
      throw new Error(
        `Ошибка при добавлении шаблона: ${templateError.message}`
      );
    }

    const templateId = template[0].id;

    // 2. Вставляем вопросы в таблицу questions
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
        .select(); // Получаем id созданного вопроса

      if (questionError) {
        throw new Error(
          `Ошибка при добавлении вопроса: ${questionError.message}`
        );
      }

      const questionId = questionData[0].id;

      // 3. Вставляем опции (если есть) в таблицу options
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

    console.log("Шаблон успешно сохранён!");

    return { success: true };
  } catch (error) {
    console.error("Ошибка при сохранении шаблона:", error);
    return { success: false, error: error };
  }
};
