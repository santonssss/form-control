import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        password: password,
        email: email,
      });

      if (data && data.user && data.user.email) {
        localStorage.setItem("email", data.user?.user_metadata.email);
      }
      if (data.session?.access_token) {
        localStorage.setItem("accessToken", data.session.access_token);
        navigate("/");
      }
      if (error) {
        setError(error.message);
      }
    } catch (error) {}
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full mt-[25%] max-w-md mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-gray-800"
    >
      <h2 className="text-2xl font-semibold text-center mb-6 dark:text-white">
        Вход
      </h2>
      {error && (
        <div className="mb-4 p-3 text-red-700 bg-red-100 border border-red-400 rounded">
          {error}
        </div>
      )}
      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          className="mt-1 block w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Пароль
        </label>
        <input
          type="password"
          id="password"
          className="mt-1 block w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 px-4 bg-indigo-600 text-white font-medium text-sm rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Войти
      </button>
      <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
        Нет аккаунта?{" "}
        <a href="/register" className="text-indigo-600 hover:underline">
          Зарегистрируйтесь
        </a>
      </p>
    </form>
  );
};

export default LoginForm;
