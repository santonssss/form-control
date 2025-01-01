import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
const SignUpForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<any>("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            data: {
              first_name: name,
            },
          },
        });

      if (signUpError) {
        throw new Error(signUpError.message);
      }

      if (signUpData.user && signUpData.user.email) {
        const { email: userEmail } = signUpData.user;

        const { error: insertError } = await supabase.from("users").insert([
          {
            email: userEmail,
            name: name,
            is_admin: false,
            status: "active",
          },
        ]);

        if (insertError) {
          throw new Error(
            `Ошибка при добавлении в таблицу users: ${insertError.message}`
          );
        }
      } else {
        throw new Error("Не удалось получить данные пользователя.");
      }

      setSuccess("Отлично, теперь осталось залогиниться с вашими данными!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setError(error);
      console.log("Ошибка:", error);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full mt-[10%] max-w-md mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-gray-800"
    >
      <h2 className="text-2xl font-semibold text-center mb-6 dark:text-white">
        Регистрация
      </h2>
      {error && (
        <div className="mb-4 p-3 text-red-700 bg-red-100 border border-red-400 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 text-green-700 bg-green-100 border border-green-400 rounded">
          {success}
        </div>
      )}
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Имя
        </label>
        <input
          type="text"
          id="name"
          className="mt-1 block w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
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
        Зарегистрироваться
      </button>
      <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
        Уже есть аккаунт?{" "}
        <a href="/login" className="text-indigo-600 hover:underline">
          Войдите
        </a>
      </p>
    </form>
  );
};

export default SignUpForm;
