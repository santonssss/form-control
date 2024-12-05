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
import { SortableItem } from "./SortableItem";
import { Question as QuestionType } from "../types/types";
import { TFunction } from "i18next";

type Props = {
  question: QuestionType;
  onUpdate: (updatedQuestion: QuestionType) => void;
  t: TFunction<"translation", undefined>;
};

const Question: React.FC<Props> = ({ question, onUpdate, t }) => {
  const [options, setOptions] = useState(
    question.options.map((opt) => ({
      ...opt,
      id: opt.id || Date.now().toString(),
    }))
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) {
      const activeIndex = options.findIndex((o) => o.id === active.id);
      const overIndex = options.findIndex((o) => o.id === over.id);
      const newOptions = arrayMove(options, activeIndex, overIndex);
      setOptions(newOptions);
      onUpdate({ ...question, options: newOptions });
    }
  };

  const handleAddOption = () => {
    const newOption = { id: Date.now().toString(), value: "", checked: false };
    const updatedOptions = [...options, newOption];
    setOptions(updatedOptions);
    onUpdate({ ...question, options: updatedOptions });
  };

  const handleOptionChange = (id: string, value: string) => {
    const updatedOptions = options.map((option) =>
      option.id === id ? { ...option, value } : option
    );
    setOptions(updatedOptions);
    onUpdate({ ...question, options: updatedOptions });
  };

  const handleDeleteOption = (id: string, e: React.MouseEvent) => {
    console.log("Button clicked", e);
    const updatedOptions = options.filter((option) => option.id !== id);
    setOptions(updatedOptions);
    onUpdate({ ...question, options: updatedOptions });
    console.log("d");
  };

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded space-y-4">
      <input
        type="text"
        value={question.title}
        onChange={(e) => onUpdate({ ...question, title: e.target.value })}
        placeholder={(t as any)("QuestionTitle")}
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
      />
      <textarea
        value={question.description}
        onChange={(e) => onUpdate({ ...question, description: e.target.value })}
        placeholder={(t as any)("QuestionDescription")}
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
      ></textarea>

      {(question.type === "checkbox" || question.type === "radio") && (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <SortableContext items={options.map((option) => option.id)}>
            <ul className="space-y-2">
              {options.map((option) => (
                <SortableItem key={option.id} id={option.id}>
                  <div className="flex items-center space-x-2 z-40">
                    <input
                      type="text"
                      value={option.value}
                      onChange={(e) =>
                        handleOptionChange(option.id, e.target.value)
                      }
                      placeholder={(t as any)("OptionPlaceholder")}
                      className="flex-1 p-2 border rounded dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      onClick={(e: React.MouseEvent) =>
                        handleDeleteOption(option.id, e)
                      }
                      className="text-red-500 z-50"
                    >
                      {(t as any)("Delete")}
                    </button>
                  </div>
                </SortableItem>
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}

      {(question.type === "checkbox" || question.type === "radio") && (
        <button
          onClick={handleAddOption}
          className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {(t as any)("AddOption")}
        </button>
      )}
    </div>
  );
};

export default Question;
