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
import { SortableItem } from "./SortableItem";
import { Question } from "../types/types";

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
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) {
      const activeIndex = questions.findIndex((q) => q.id === active.id);
      const overIndex = questions.findIndex((q) => q.id === over.id);
      setQuestions((prev) => arrayMove(prev, activeIndex, overIndex));
    }
  };

  const handleAddQuestion = (type: Question["type"]) => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type,
      title: (t as any)("NewQuestion"),
      description: "",
      options:
        type === "checkbox" || type === "radio"
          ? [{ value: "", checked: false }]
          : [],
    };
    setQuestions((prev) => [...prev, newQuestion]);
  };

  const handleSave = () => {
    onSave({ title, description, accessType, questions });
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <h2 className="text-xl font-bold dark:text-white">
        {(t as any)("TemplateSettings")}
      </h2>

      <div className="mt-4 space-y-4">
        <input
          type="text"
          placeholder={(t as any)("Title")}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="block w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        />
        <textarea
          placeholder={(t as any)("Description")}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="block w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        ></textarea>
      </div>

      <select
        value={accessType}
        onChange={(e) => setAccessType(e.target.value)}
        className="mt-4 p-2 border rounded w-full dark:bg-gray-700 dark:text-white"
      >
        <option value="private">{(t as any)("Private")}</option>
        <option value="public">{(t as any)("Public")}</option>
      </select>

      <div className="mt-6">
        <h3 className="text-lg font-bold dark:text-white">
          {(t as any)("Questions")}
        </h3>

        <div className="flex space-x-2 my-4">
          {["text", "textarea", "number", "checkbox", "radio"].map((type) => (
            <button
              key={type}
              onClick={() => handleAddQuestion(type as Question["type"])}
              className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {(t as any)(type)}
            </button>
          ))}
        </div>

        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <SortableContext items={questions.map((q) => q.id)}>
            <ul className="space-y-2">
              {questions.map((question) => (
                <SortableItem key={question.id} id={question.id}>
                  <div className="p-4 border rounded bg-white dark:bg-gray-700 dark:text-white">
                    <strong>{question.title}</strong>
                    <p>{question.description || (t as any)("NoDescription")}</p>
                  </div>
                </SortableItem>
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      </div>
      <button
        onClick={handleSave}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        {(t as any)("SaveChanges")}
      </button>
    </div>
  );
};

export default TemplateSettings;
