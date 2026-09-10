import React, { useState } from "react";
import { Button, Error, Input, FormField, Label, Textarea } from "../../styles";

function NoteForm({ onNoteCreated }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    setErrors([]);
    setIsLoading(true);

    fetch("/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(
              data.errors?.join(", ") || "Failed to create note."
            );
          });
        }

        return response.json();
      })
      .then((newNote) => {
        onNoteCreated(newNote);
        setTitle("");
        setContent("");
        setIsLoading(false);
      })
      .catch((error) => {
        setErrors([error.message]);
        setIsLoading(false);
      });
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create a Note</h2>

      <FormField>
        <Label htmlFor="note-title">Title</Label>
        <Input
          type="text"
          id="note-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a title"
        />
      </FormField>

      <FormField>
        <Label htmlFor="note-content">Content</Label>
        <Textarea
          id="note-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note..."
          rows="5"
        />
      </FormField>

      <FormField>
        <Button type="submit" variant="fill" color="primary">
          {isLoading ? "Creating..." : "Create Note"}
        </Button>
      </FormField>

      <FormField>
        {errors.map((error) => (
          <Error key={error}>{error}</Error>
        ))}
      </FormField>
    </form>
  );
}

export default NoteForm;
