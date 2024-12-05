import React, { useMemo, useContext } from "react";
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
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        style={style}
        className="sortable-item p-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
      >
        {children}
      </li>
    </SortableItemContext.Provider>
  );
};
