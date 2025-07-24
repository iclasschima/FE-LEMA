"use client";
import React, { useState, useMemo } from "react";
import UserTable from "./components/UserTable";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";
import { useUsers } from "./hooks";
import { User } from "./types";

const UsersPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<keyof User>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const { data, isLoading, isError, error } = useUsers(page, 4);

  const sortedUsers = useMemo(() => {
    if (!data?.data) return [];
    const users = [...data.data];
    return users.sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return 0;
    });
  }, [data, sortKey, sortOrder]);

  const handleSort = (key: keyof User) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError)
    return <ErrorMessage message={error?.message || "Failed to load users."} />;

  return (
    <div className="container mx-auto p-4 pt-14">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Users</h1>
      <UserTable
        users={sortedUsers}
        currentPage={data?.pagination.page || 1}
        totalPages={data?.pagination.totalPages || 1}
        onPageChange={setPage}
        onSort={handleSort}
        sortKey={sortKey}
        sortOrder={sortOrder}
      />
    </div>
  );
};

export default UsersPage;
