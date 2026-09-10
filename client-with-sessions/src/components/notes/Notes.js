import React, { useEffect, useState } from "react";
import NoteForm from "./NoteForm";
import NoteEdit from "./NoteEdit";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    pages: 1,
  });

  useEffect(() => {
    setIsLoading(true);
    setError("");

    fetch(`/notes?page=${page}&per_page=10`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load notes.");
        }

        return response.json();
      })
      .then((data) => {
        setNotes(data.notes);
        setPagination(data.pagination);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  }, [page]);

  function handleNoteCreated(newNote) {
    setNotes((currentNotes) => [newNote, ...currentNotes]);
  }

  function handleNoteUpdated(updatedNote) {
    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === updatedNote.id ? updatedNote : note
      )
    );

    setEditingNoteId(null);
  }

  function handleNoteDeleted(noteId) {
    setNotes((currentNotes) =>
      currentNotes.filter((note) => note.id !== noteId)
    );
  }

  function handleDelete(noteId) {
    fetch(`/notes/${noteId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete note.");
        }

        handleNoteDeleted(noteId);
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  if (isLoading) {
    return <p>Loading notes...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section>
      <NoteForm onNoteCreated={handleNoteCreated} />

      <h2>My Notes</h2>

      {notes.length === 0 ? (
        <p>You don't have any notes yet.</p>
      ) : (
        notes.map((note) => (
          <article key={note.id}>
            {editingNoteId === note.id ? (
              <NoteEdit
                note={note}
                onNoteUpdated={handleNoteUpdated}
                onCancel={() => setEditingNoteId(null)}
              />
            ) : (
              <>
                <h3>{note.title}</h3>
                <p>{note.content}</p>

                <button onClick={() => setEditingNoteId(note.id)}>
                  Edit
                </button>

                <button onClick={() => handleDelete(note.id)}>
                  Delete
                </button>
              </>
            )}
          </article>
        ))
      )}

      <div>
        <button
          onClick={() => setPage((currentPage) => currentPage - 1)}
          disabled={pagination.page <= 1}
        >
          Previous
        </button>

        <span>
          {" "}
          Page {pagination.page} of {pagination.pages}{" "}
        </span>

        <button
          onClick={() => setPage((currentPage) => currentPage + 1)}
          disabled={pagination.page >= pagination.pages}
        >
          Next
        </button>
      </div>
    </section>
  );
}

export default Notes;
