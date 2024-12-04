import React, { useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  onSearch: (query: string) => void;
};

const SearchBar: React.FC<Props> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onSearch(query);
  };
  const { t } = useTranslation();
  return (
    <div className="flex flex-col  md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-4 p-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={(t as any)("SearchForms")}
        className="w-full md:w-3/4 p-2 border border-gray-300 rounded-md  dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleSearch}
        className="w-full md:w-auto px-4 py-2 border border-gray-800 dark:border-gray-600  bg-blue-500 text-white rounded-md dark:bg-gray-700 dark:text-white hover:bg-blue-600 transition"
      >
        {(t as any)("Search")}
      </button>
    </div>
  );
};

export default SearchBar;
