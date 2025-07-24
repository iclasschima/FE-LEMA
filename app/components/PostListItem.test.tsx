import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom"; // Import for extend-expect matchers

import PostListItem from "./PostListItem"; // Adjust path if necessary
import { Post } from "../types"; // Adjust path if necessary

describe("PostListItem", () => {
  const mockPost: Post = {
    id: 1,
    userId: 1,
    title: "Test Post Title",
    body: "This is the body of the test post. It contains some descriptive text.",
  };

  const mockOnDelete = jest.fn(); // Create a mock function for onDelete

  beforeEach(() => {
    // Clear any calls to the mock function before each test
    mockOnDelete.mockClear();
  });

  test("renders post title and body correctly", () => {
    render(<PostListItem post={mockPost} onDelete={mockOnDelete} />);

    // Assert that the title is in the document
    expect(
      screen.getByRole("heading", { level: 3, name: mockPost.title })
    ).toBeInTheDocument();

    // Assert that the body text is in the document
    expect(screen.getByText(mockPost.body)).toBeInTheDocument();
  });

  test("calls onDelete when the delete button is clicked", () => {
    render(<PostListItem post={mockPost} onDelete={mockOnDelete} />);

    // Find the delete button by its accessible name (aria-label)
    const deleteButton = screen.getByLabelText(`Delete post ${mockPost.title}`);

    // Simulate a click event on the button
    fireEvent.click(deleteButton);

    // Assert that the mock onDelete function was called
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    // Assert that it was called with the correct post ID
    expect(mockOnDelete).toHaveBeenCalledWith(mockPost.id);
  });

  test("delete button has correct accessibility attributes", () => {
    render(<PostListItem post={mockPost} onDelete={mockOnDelete} />);
    const deleteButton = screen.getByRole("button", {
      name: `Delete post ${mockPost.title}`,
    });
    expect(deleteButton).toBeInTheDocument();
  });
});
