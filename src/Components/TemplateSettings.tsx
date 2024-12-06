import React, { useState } from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useTranslation } from "react-i18next";
import { Question } from "../types/types";
import QuestionComponent from "./Question";

type Props = {
  onSave: (data: {
    title: string;
    description: string;
    accessType: string;
    questions: Question[];
  }) => void;
  initialData?: {
    title: string;
    description: string;
    accessType: string;
    questions: Question[];
  };
};

const TemplateSettings: React.FC<Props> = ({ onSave, initialData }) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [accessType, setAccessType] = useState(
    initialData?.accessType || "private"
  );
  const [questions, setQuestions] = useState<Question[]>(
    initialData?.questions || []
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) {
      const activeIndex = questions.findIndex((q) => q.id === active.id);
      const overIndex = questions.findIndex((q) => q.id === over.id);

      setQuestions((questions) => arrayMove(questions, activeIndex, overIndex));
    }
  };

  const handleAddQuestion = (type: Question["type"]) => {
    if (questions.filter((q) => q.type === type).length >= 4) {
      alert((t as any)("MaximumQuestionsReached"));
      return;
    }

    const newQuestion: Question = {
      id: Date.now().toString(),
      type,
      title: (t as any)(""),
      description: "",
      options: [],
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleQuestionUpdate = (updatedQuestion: Question) => {
    setQuestions(
      questions.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q))
    );
  };

  const handleSave = () => {
    onSave({ title, description, accessType, questions });
  };
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold dark:text-white">
        {(t as any)("TemplateSettings")}
      </h2>
      <input
        type="text"
        placeholder={(t as any)("Title")}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="block w-full mt-2 p-2 border rounded dark:bg-gray-800 dark:text-white"
      />
      <textarea
        placeholder={(t as any)("Description")}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="block w-full mt-2 p-2 border rounded dark:bg-gray-800 dark:text-white"
      ></textarea>
      <select
        value={accessType}
        onChange={(e) => setAccessType(e.target.value)}
        className="block w-full mt-2 p-2 border rounded dark:bg-gray-800 dark:text-white"
      >
        <option value="private">{(t as any)("Private")}</option>
        <option value="public">{(t as any)("Public")}</option>
      </select>

      {/* DnD для управления вопросами */}
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext items={questions.map((q) => q.id)}>
          <div>
            <h3 className="text-lg font-bold dark:text-white">
              {(t as any)("Questions")}
            </h3>
            <div className="flex space-x-2 overflow-hidden overflow-x-scroll ">
              {["text", "textarea", "number", "checkbox", "radio"].map(
                (type) => (
                  <button
                    key={type}
                    onClick={() => handleAddQuestion(type as Question["type"])}
                    className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    {(t as any)(type)}
                  </button>
                )
              )}
            </div>

            <div className="space-y-2 mt-4">
              {questions.map((question) => (
                <QuestionComponent
                  key={question.id}
                  question={question}
                  onUpdate={handleQuestionUpdate}
                  t={t}
                />
              ))}
            </div>
          </div>
        </SortableContext>
      </DndContext>

      <button
        onClick={handleSave}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        {(t as any)("SaveChanges")}
      </button>
    </div>
  );
};

export default TemplateSettings;
