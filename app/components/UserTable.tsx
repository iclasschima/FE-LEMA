// frontend/components/UserTable.tsx
import React from "react";
import { User } from "../types";
import { formatAddress } from "../lib/formatters"; // Make sure this path is correct for your Next.js setup
import Link from "next/link"; // Use Next.js Link for navigation

// Import icons for pagination arrows (assuming react-icons is installed)
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import LoadingSpinner from "./LoadingSpinner";

interface UserTableProps {
  users: User[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSort: (key: keyof User) => void;
  sortKey: keyof User;
  sortOrder: "asc" | "desc";
  isLoading?: boolean;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  currentPage,
  totalPages,
  onPageChange,
  onSort,
  sortKey,
  sortOrder,
  isLoading,
}) => {
  const getPaginationPages = () => {
    const pages = [];
    const maxPagesToShow = 5; // e.g., 1 ... 4 5 [6] 7 8 ... 10

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1); // Always show first page

      if (currentPage > maxPagesToShow - 2) {
        // Show ellipsis if current page is far from beginning
        pages.push("...");
      }

      // Calculate start and end for middle block of pages
      let startPage = Math.max(
        2,
        currentPage - Math.floor(maxPagesToShow / 2) + 1
      );
      let endPage = Math.min(
        totalPages - 1,
        currentPage + Math.floor(maxPagesToShow / 2) - 1
      );

      // Adjust if startPage is too close to 1
      if (currentPage <= Math.floor(maxPagesToShow / 2) + 1) {
        startPage = 2;
        endPage = maxPagesToShow - 1;
      }
      // Adjust if endPage is too close to totalPages
      if (currentPage >= totalPages - Math.floor(maxPagesToShow / 2)) {
        startPage = totalPages - maxPagesToShow + 2;
        endPage = totalPages - 1;
      }

      for (let i = startPage; i <= endPage; i++) {
        if (i > 1 && i < totalPages) {
          // Avoid duplicating 1 or totalPages if already added
          pages.push(i);
        }
      }

      if (currentPage < totalPages - (maxPagesToShow - 2)) {
        // Show ellipsis if current page is far from end
        pages.push("...");
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    return pages.filter((value, index, self) => self.indexOf(value) === index);
  };

  return (
    <div className="bg-white overflow-hidden ">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                onClick={() => onSort("name")}
              >
                Full Name{" "}
                {sortKey === "name" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email Address
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ width: "500px", minWidth: "280px" }}
              >
                Address
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td className="px-6 py-4 text-center" colSpan={3}>
                  <LoadingSpinner />
                </td>
              </tr>
            ) : users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <Link
                      href={{
                        pathname: `/users/${user.id}/posts`,
                        query: { name: user.name, email: user.email },
                      }}
                    >
                      {user.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <Link
                      href={{
                        pathname: `/users/${user.id}/posts`,
                        query: { name: user.name, email: user.email },
                      }}
                    >
                      {user.email}
                    </Link>
                  </td>
                  <td
                    className="px-6 py-4 text-sm text-gray-600 truncate"
                    style={{ maxWidth: "392px" }}
                  >
                    <Link
                      href={{
                        pathname: `/users/${user.id}/posts`,
                        query: { name: user.name, email: user.email },
                      }}
                    >
                      {formatAddress(user.address)}
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex lg:justify-end">
          <div className="flex items-center justify-center space-x-2 py-4 px-6 border-t border-gray-200">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <IoIosArrowBack className="mr-1" /> Previous
            </button>

            <div className="flex space-x-1">
              {getPaginationPages().map((pageNumber, index) =>
                typeof pageNumber === "string" ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-3 py-1 text-gray-500"
                  >
                    {pageNumber}
                  </span>
                ) : (
                  <button
                    key={pageNumber}
                    onClick={() => onPageChange(pageNumber as number)}
                    className={`
                                        px-3 py-1 rounded-md text-sm font-medium cursor-pointer
                                        ${
                                          currentPage === pageNumber
                                            ? "bg-[#F9F5FF] text-[#7F56D9]"
                                            : "bg-white text-gray-700 hover:bg-gray-100  "
                                        }
                                        transition-colors duration-200
                                    `}
                  >
                    {pageNumber}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              Next <IoIosArrowForward className="ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
