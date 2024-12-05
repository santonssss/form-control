import { useTranslation } from "react-i18next";
import Gallery from "../Components/Gallery";
import Header from "../Components/Header";
import SearchBar from "../Components/SearchBar";
import PopularTemplates from "../Components/PopularTemplates";
import TagsCloud from "../Components/TagsCloud";
import Footer from "../Components/Footer";

type Props = {};

const MainPage = (props: Props) => {
  const handleSearch = (query: string) => {
    console.log("Ищем:", query);
  };
  const fakeTemplates = [
    {
      id: "1",
      title: "Шаблон 1",
      description: "Описание шаблона 1",
      author: "Автор 1",
    },
    {
      id: "2",
      title: "Шаблон 2",
      description: "Описание шаблона 2",
      author: "Автор 2",
    },
    {
      id: "3",
      title: "Шаблон 3",
      description: "Описание шаблона 3",
      author: "Автор 3",
    },
  ];
  const popularTemplates = [
    {
      id: "1",
      title: "Популярный шаблон 1",
      description: "Описание 1",
      author: "Автор 1",
    },
    {
      id: "2",
      title: "Популярный шаблон 2",
      description: "Описание 2",
      author: "Автор 2",
    },
    {
      id: "3",
      title: "Популярный шаблон 3",
      description: "Описание 3",
      author: "Автор 3",
    },
    {
      id: "4",
      title: "Популярный шаблон 4",
      description: "Описание 4",
      author: "Автор 4",
    },
    {
      id: "5",
      title: "Популярный шаблон 5",
      description: "Описание 5",
      author: "Автор 5",
    },
  ];
  const tags = ["React", "TypeScript", "Tailwind", "Forms", "DarkMode"];

  const { t } = useTranslation();
  return (
    <div className="dark:bg-gray-700 ">
      <Header />
      <div className="max-w-screen-xl mr-auto ml-auto">
        <SearchBar onSearch={handleSearch} />{" "}
        <h2 className="text-2xl font-semibold mb-5 dark:text-white">
          {(t as any)("LastTeamplates")}
        </h2>
        <Gallery templates={fakeTemplates} />
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
