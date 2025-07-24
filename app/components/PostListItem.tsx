import React from "react";
import { Post } from "@/app/types"; // Adjusted path
import { FaTrashAlt } from "react-icons/fa";

interface PostListItemProps {
  post: Post;
  onDelete: (postId: number) => void;
}

const PostListItem: React.FC<PostListItemProps> = ({ post, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 pt-14 min-h-[350px] relative flex flex-col h-full border border-gray-200">
      <button
        onClick={() => onDelete(post.id)}
        className="absolute top-4 right-4 text-gray-400 cursor-pointer "
        aria-label={`Delete post ${post.title}`}
      >
        <FaTrashAlt className="w-4 h-4 text-red-300 hover:text-red-500 transition-colors duration-200" />
      </button>

      <h3 className="text-lg font-semibold text-gray-900 mb-2 pr-8">
        {post.title}
      </h3>

      <p className="text-sm text-gray-600 leading-relaxed flex-grow">
        {post.body}
      </p>
    </div>
  );
};

export default PostListItem;
