import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Gallery from "../Components/Gallery";
import Header from "../Components/Header";
import SearchBar from "../Components/SearchBar";
import PopularTemplates from "../Components/PopularTemplates";
import TagsCloud from "../Components/TagsCloud";
import Footer from "../Components/Footer";
import { supabase } from "../supabaseClient";

type Props = {};

const MainPage = (props: Props) => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [popularTemplates, setPopularTemplates] = useState<any[]>([]);
  const [lastTemplates, setLastTemplates] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResultVisible, setSearchResultVisible] =
    useState<boolean>(false);
  const [noResults, setNoResults] = useState<boolean>(false);
  const { t } = useTranslation();

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query) {
      fetchPopularTemplates();
      setSearchResultVisible(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("templates")
        .select("*")
        .ilike("title", `%${query}%`);

      if (error) {
        console.error("Ошибка при поиске шаблонов:", error);
      } else {
        setTemplates(data); // Применяем результаты поиска в `templates`
        setSearchResultVisible(true);
        if (data.length === 0) {
          setNoResults(true);
          setTimeout(() => {
            setNoResults(false);
            setSearchResultVisible(false);
          }, 3000);
        } else {
          setNoResults(false);
        }
      }
    } catch (error) {
      console.error("Ошибка при загрузке шаблонов:", error);
    }
  };

  const fetchPopularTemplates = async () => {
    const { data, error } = await supabase
      .from("templates")
      .select("*")
      .order("views", { ascending: false })
      .limit(5);

    if (error) {
      console.error("Ошибка при загрузке популярных шаблонов:", error);
    } else {
      setPopularTemplates(data); // Используем отдельный стейт для популярных шаблонов
    }
  };

  const fetchLastTemplates = async () => {
    const { data, error } = await supabase
      .from("templates")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(3);

    if (error) {
      console.error("Ошибка при загрузке последних шаблонов:", error);
    } else {
      setLastTemplates(data); // Используем отдельный стейт для последних шаблонов
    }
  };

  useEffect(() => {
    fetchPopularTemplates();
    fetchLastTemplates();
  }, []);

  const tags = ["React", "TypeScript", "Tailwind", "Forms", "DarkMode"];

  return (
    <div className="dark:bg-gray-700">
      <Header />
      <div className="max-w-screen-xl mr-auto ml-auto">
        <SearchBar onSearch={handleSearch} />
        {searchResultVisible && (
          <div className="min-h-[300px]">
            {noResults ? (
              <p className="text-xl font-semibold dark:text-white">
                {(t as any)("NoResultsFound")}
              </p>
            ) : (
              <>
                <h2 className="text-2xl font-semibold mb-5 dark:text-white">
                  {(t as any)("ResultSearch")}
                </h2>
                <Gallery templates={templates} />
              </>
            )}
          </div>
        )}
        <h2 className="text-2xl font-semibold mb-5 dark:text-white">
          {(t as any)("LastTeamplates")}
        </h2>
        <Gallery templates={lastTemplates} />{" "}
        <PopularTemplates templates={popularTemplates} />
        <TagsCloud
          tags={tags}
          onTagClick={(tag) => console.log(`Клик по тегу: ${tag}`)}
        />
      </div>
      <Footer />
    </div>
  );
};

export default MainPage;
