"use client";

import React, { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useUserPosts, useDeletePost } from "@/app/hooks";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import ErrorMessage from "@/app/components/ErrorMessage";
import PostListItem from "@/app/components/PostListItem";

import { IoIosArrowBack } from "react-icons/io";
import { FaPlus } from "react-icons/fa";

const UserPostsPage: React.FC = () => {
  const params = useParams();
  const userId = params.userId as string;
  const router = useRouter();
  const searchParams = useSearchParams();

  const userName = searchParams.get("name") || "";
  const userEmail = searchParams.get("email") || "";

  const [page] = useState(1);
  const postsLimit = 20;

  const {
    data: postsData,
    isLoading: isLoadingPosts,
    isError: isErrorPosts,
    error: postsError,
  } = useUserPosts(userId, page, postsLimit);

  const deletePostMutation = useDeletePost();

  const handleDeletePost = async (postId: number) => {
    if (
      window.confirm(
        "Are you sure you want to delete this post? This action cannot be undone."
      )
    ) {
      try {
        await deletePostMutation.mutateAsync(postId);
        console.log(`Post ${postId} deleted successfully.`);
      } catch (error) {
        console.error(`Failed to delete post ${postId}:`, error);
      }
    }
  };

  if (isLoadingPosts) return <LoadingSpinner isLoadingFullScreen />;
  if (isErrorPosts)
    return (
      <ErrorMessage message={postsError?.message || "Failed to load posts."} />
    );

  return (
    <div className="container mx-auto p-4 sm:p-8 min-h-screen ">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="mb-6 px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors duration-200 flex items-center text-sm font-medium"
        >
          <IoIosArrowBack className="mr-1 text-base" /> Back to Users
        </button>

        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
          {userName ? `${userName}` : `User ${userId}`}
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          {userEmail} &bull; {postsData?.pagination.total || 0} Posts
        </p>
      </div>

      {postsData?.data && postsData.data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border-dashed h-full  p-6 flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors duration-200 cursor-pointer border border-gray-200">
            <FaPlus className="w-8 h-8 mb-3" />
            <span className="text-lg font-medium">New Post</span>
          </div>

          {postsData.data.map((post) => (
            <PostListItem
              key={post.id}
              post={post}
              onDelete={handleDeletePost}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors duration-200 cursor-pointer border border-gray-200 h-[220px]">
            <FaPlus className="w-8 h-8 mb-3" />
            <span className="text-lg font-medium">New Post</span>
          </div>
          <p className="col-span-full text-gray-600 text-lg text-center mt-10 p-6 bg-white rounded-lg shadow border border-gray-200">
            No posts found for this user.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserPostsPage;
