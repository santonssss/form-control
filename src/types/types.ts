export type Option = {
  id: string;
  value: string;
  checked: boolean;
};

export type Question = {
  id: string;
  type: "text" | "textarea" | "number" | "checkbox" | "radio";
  title: string;
  description: string;
  options: Option[];
};
