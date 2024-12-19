import React, { useState } from "react";
import { useTranslation } from "react-i18next";

type Form = {
  id: string;
  title: string;
  category: string;
  createdDate: string;
  responsesCount: number;
  author: string;
};

const FormsPage: React.FC = () => {
  const { t } = useTranslation();
  const [forms, setForms] = useState<Form[]>([
    {
      id: "1",
      title: "Customer Satisfaction Survey",
      category: "Survey",
      createdDate: "2024-12-01",
      responsesCount: 120,
      author: "Admin",
    },
    {
      id: "2",
      title: "Employee Feedback Form",
      category: "Feedback",
      createdDate: "2024-11-15",
      responsesCount: 45,
      author: "User123",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("");

  const handleDelete = (id: string) => {
    setLoading(true);
    setTimeout(() => {
      setForms(forms.filter((form) => form.id !== id));
      setLoading(false);
    }, 1000);
  };

  const handleEdit = (id: string) => {
    alert((t as any)("Edit form ID:") + " " + id);
  };

  const handleViewResponses = (id: string) => {
    alert((t as any)("Viewing responses for form ID:") + " " + id);
  };

  const filteredForms = forms.filter((form) =>
    filterCategory ? form.category === filterCategory : true
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        {(t as any)("FormsManagement")}
      </h1>

      <div className="mb-4">
        <label htmlFor="categoryFilter" className="mr-2">
          {(t as any)("Filter by category")}:
        </label>
        <select
          id="categoryFilter"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="">{(t as any)("All Categories")}</option>
          <option value="Survey">{(t as any)("Survey")}</option>
          <option value="Feedback">{(t as any)("Feedback")}</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center">{(t as any)("Loading...")}</div>
      ) : (
        <div className="space-y-4">
          {filteredForms.map((form) => (
            <div
              key={form.id}
              className="border p-4 rounded-lg bg-gray-100 dark:bg-gray-800"
            >
              <h3 className="text-lg font-semibold">{form.title}</h3>
              <p>
                {(t as any)("Category")}: {form.category}
              </p>
              <p>
                {(t as any)("Created on")}: {form.createdDate}
              </p>
              <p>
                {(t as any)("Responses")}: {form.responsesCount}
              </p>
              <p>
                {(t as any)("Author")}: {form.author}
              </p>
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => handleEdit(form.id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {(t as any)("Edit")}
                </button>
                <button
                  onClick={() => handleDelete(form.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  {(t as any)("Delete")}
                </button>
                <button
                  onClick={() => handleViewResponses(form.id)}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  {(t as any)("View Responses")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormsPage;
