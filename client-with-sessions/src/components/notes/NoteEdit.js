import React, { useState } from "react";
import { Button, Error, Input, FormField, Label, Textarea } from "../../styles";

function NoteEdit({ note, onNoteUpdated, onCancel }) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    setErrors([]);
    setIsLoading(true);

    fetch(`/notes/${note.id}`, {
      method: "PATCH",
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
              data.errors?.join(", ") || "Failed to update note."
            );
          });
        }

        return response.json();
      })
      .then((updatedNote) => {
        onNoteUpdated(updatedNote);
        setIsLoading(false);
      })
      .catch((error) => {
        setErrors([error.message]);
        setIsLoading(false);
      });
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormField>
        <Label htmlFor={`edit-title-${note.id}`}>Title</Label>
        <Input
          type="text"
          id={`edit-title-${note.id}`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </FormField>

      <FormField>
        <Label htmlFor={`edit-content-${note.id}`}>Content</Label>
        <Textarea
          id={`edit-content-${note.id}`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="5"
        />
      </FormField>

      <FormField>
        <Button type="submit" variant="fill" color="primary">
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>

        <Button type="button" onClick={onCancel}>
          Cancel
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

export default NoteEdit;
