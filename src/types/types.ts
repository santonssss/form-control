export type Question = {
  id: string;
  type: "text" | "textarea" | "number" | "checkbox" | "radio";
  title: string;
  description: string;
  options: { value: string; checked: boolean }[];
};
