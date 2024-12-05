import React, { useMemo, useContext, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableItemContext = React.createContext<any>(null);

export const SortableItem = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = useMemo(
    () => ({
      transform: CSS.Translate.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    }),
    [transform, transition, isDragging]
  );

  return (
    <SortableItemContext.Provider value={{ attributes, listeners }}>
      <li
        style={style}
        className="sortable-item p-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
      >
        {children}{" "}
        <button
          className="DragHandle  w-full h-10 dark:bg-gray-600 bg-green-200"
          {...attributes}
          {...listeners}
          ref={setNodeRef}
        >
          {" "}
          Удерживаете эту област чтоб перетаскивать элементы!
        </button>
      </li>
    </SortableItemContext.Provider>
  );
};
