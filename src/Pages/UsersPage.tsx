import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const UsersPage: React.FC = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      isAdmin: true,
      isBlocked: false,
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      isAdmin: false,
      isBlocked: false,
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob.johnson@example.com",
      isAdmin: false,
      isBlocked: true,
    },
  ]);

  const [search, setSearch] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleAdmin = (id: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, isAdmin: !user.isAdmin } : user
      )
    );
  };

  const toggleBlock = (id: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, isBlocked: !user.isBlocked } : user
      )
    );
  };

  const deleteUser = (id: string) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
  };
  if (true) {
    return (
      <div className="h-[100vh] w-full flex items-center justify-center text-red-400 font-bold font-mono">
        {(t as any)("This page is only available to admins")}
      </div>
    );
  }
  return (
    <div className="text-gray-800 dark:text-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-4">
        {(t as any)("UsersManagement")}
      </h2>
      <input
        type="text"
        placeholder={(t as any)("SearchUsers")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
      />

      <div className="hidden md:block">
        <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th className="p-2 border border-gray-300 dark:border-gray-600">
                {(t as any)("Name")}
              </th>
              <th className="p-2 border border-gray-300 dark:border-gray-600">
                {(t as any)("Email")}
              </th>
              <th className="p-2 border border-gray-300 dark:border-gray-600">
                {(t as any)("Role")}
              </th>
              <th className="p-2 border border-gray-300 dark:border-gray-600">
                {(t as any)("Actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <td className="p-2 border border-gray-300 dark:border-gray-600">
                  {user.name}
                </td>
                <td className="p-2 border border-gray-300 dark:border-gray-600">
                  {user.email}
                </td>
                <td className="p-2 border border-gray-300 dark:border-gray-600">
                  {user.isAdmin ? (t as any)("Admin") : (t as any)("User")}
                </td>
                <td className="p-2 border border-gray-300 dark:border-gray-600">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleAdmin(user.id)}
                      className={`px-2 py-1 rounded text-white ${
                        user.isAdmin ? "bg-red-500" : "bg-green-500"
                      }`}
                    >
                      {user.isAdmin
                        ? (t as any)("RemoveAdmin")
                        : (t as any)("MakeAdmin")}
                    </button>
                    <button
                      onClick={() => toggleBlock(user.id)}
                      className={`px-2 py-1 rounded text-white ${
                        user.isBlocked ? "bg-yellow-500" : "bg-blue-500"
                      }`}
                    >
                      {user.isBlocked
                        ? (t as any)("Unblock")
                        : (t as any)("Block")}
                    </button>
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="px-2 py-1 rounded bg-red-500 text-white"
                    >
                      {(t as any)("Delete")}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="border p-4 mb-4 rounded shadow-lg dark:bg-gray-800 dark:text-gray-100"
          >
            <h3 className="text-xl font-bold">{user.name}</h3>
            <p>{user.email}</p>
            <p>{user.isAdmin ? (t as any)("Admin") : (t as any)("User")}</p>
            <div className="flex flex-wrap space-x-2 mt-2">
              <button
                onClick={() => toggleAdmin(user.id)}
                className={`px-4 py-2 rounded text-white ${
                  user.isAdmin ? "bg-red-500" : "bg-green-500"
                }`}
              >
                {user.isAdmin
                  ? (t as any)("RemoveAdmin")
                  : (t as any)("MakeAdmin")}
              </button>
              <button
                onClick={() => toggleBlock(user.id)}
                className={`px-4 py-2 rounded text-white ${
                  user.isBlocked ? "bg-yellow-500" : "bg-blue-500"
                }`}
              >
                {user.isBlocked ? (t as any)("Unblock") : (t as any)("Block")}
              </button>
              <button
                onClick={() => deleteUser(user.id)}
                className="px-4 py-2 rounded bg-red-500 text-white"
              >
                {(t as any)("Delete")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersPage;
