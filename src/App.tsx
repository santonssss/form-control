import React from "react";
import { Route, Routes } from "react-router-dom";
import MainPage from "./Pages/MainPage";
import CreateForm from "./Pages/CreateForm";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/create-form" element={<CreateForm />} />
    </Routes>
  );
}

export default App;
