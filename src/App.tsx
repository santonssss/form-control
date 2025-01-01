import React, { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import MainPage from "./Pages/MainPage";
import CreateForm from "./Pages/CreateForm";
import AdminLayout from "./Pages/AdminLayout";
import UsersPage from "./Pages/UsersPage";
import TemplatesPage from "./Pages/TemplatesPage";
import FormsPage from "./Pages/FormsPage";
import FormFill from "./Pages/FormFillPage";
import LoginForm from "./Pages/LoginPage";
import SignUpForm from "./Pages/SingUp";
import ViewToTeamplate from "./Pages/ViewToTeamplate";
import ModalToCheckAnswers from "./Components/ModalToCheckAnswers";

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
      <Route path="/formFill" element={<FormFill />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/sign-up" element={<SignUpForm />} />
      <Route path="/teamplate/:id" element={<ViewToTeamplate />} />
      <Route
        path="/teamplate/check/answer/:id"
        element={<ModalToCheckAnswers />}
      />
    </Routes>
  );
}

export default App;
