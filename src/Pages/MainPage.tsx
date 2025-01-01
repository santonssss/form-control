import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Gallery from "../Components/Gallery";
import Header from "../Components/Header";
import SearchBar from "../Components/SearchBar";
import PopularTemplates from "../Components/PopularTemplates";
import TagsCloud from "../Components/TagsCloud";
import Footer from "../Components/Footer";
import { supabase } from "../supabaseClient";
import ModalToSearch from "../Components/ModalToSearch";

type Props = {};

const MainPage = (props: Props) => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [popularTemplates, setPopularTemplates] = useState<any[]>([]);
  const [lastTemplates, setLastTemplates] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResultVisible, setSearchResultVisible] =
    useState<boolean>(false);
  const [noResults, setNoResults] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
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
        .ilike("title", `%${query}%`)
        .eq("access_type", "public");

      if (error) {
        console.error("Ошибка при поиске шаблонов:", error);
      } else {
        setTemplates(data);
        setSearchResultVisible(true);
        if (data.length === 0) {
          setNoResults(true);
          setIsModalOpen(true);
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
      .eq("access_type", "public")
      .order("views", { ascending: false })
      .limit(5);

    if (error) {
      console.error("Ошибка при загрузке популярных шаблонов:", error);
    } else {
      setPopularTemplates(data);
    }
  };

  const fetchLastTemplates = async () => {
    const { data, error } = await supabase
      .from("templates")
      .select("*")
      .eq("access_type", "public")
      .order("created_at", { ascending: false })
      .limit(3);

    if (error) {
      console.error("Ошибка при загрузке последних шаблонов:", error);
    } else {
      setLastTemplates(data);
    }
  };

  useEffect(() => {
    fetchPopularTemplates();
    fetchLastTemplates();
  }, []);

  return (
    <div className="dark:bg-gray-700">
      <Header />
      <div className="max-w-screen-xl mr-auto ml-auto">
        <SearchBar onSearch={handleSearch} />
        {searchResultVisible &&
          (noResults ? (
            isModalOpen && (
              <ModalToSearch onClose={() => setIsModalOpen(false)} />
            )
          ) : (
            <div className="min-h-[300px]">
              <h2 className="text-2xl font-semibold mb-5 dark:text-white">
                {(t as any)("ResultSearch")}
              </h2>
              <Gallery templates={templates} />
            </div>
          ))}
        <h2 className="text-2xl font-semibold mb-5 dark:text-white">
          {(t as any)("LastTeamplates")}
        </h2>
        <Gallery templates={lastTemplates} />{" "}
        <PopularTemplates templates={popularTemplates} />
      </div>
      <Footer />
    </div>
  );
};

export default MainPage;
