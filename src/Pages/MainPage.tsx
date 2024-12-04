import { useTranslation } from "react-i18next";
import Gallery from "../Components/Gallery";
import Header from "../Components/Header";
import SearchBar from "../Components/SearchBar";

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
      </div>
    </div>
  );
};

export default MainPage;
