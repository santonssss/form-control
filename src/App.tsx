import React from "react";
import { Route, Routes } from "react-router-dom";
import MainPage from "./Pages/MainPage";
import CreateForm from "./Pages/CreateForm";
import AdminLayout from "./Pages/AdminLayout";
import UsersPage from "./Pages/UsersPage";
import TemplatesPage from "./Pages/TemplatesPage";
import FormsPage from "./Pages/FormsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/create-form" element={<CreateForm />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="users" element={<UsersPage />} />
        <Route path="templates" element={<TemplatesPage />} />
        <Route path="forms" element={<FormsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
