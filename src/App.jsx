import { useState, useEffect } from "react";
// import { v4 as uuidv4 } from "uuid";
import noteService from "./services/notes";

import Note from "./components/Note";
import Notification from "./components/Notification";
import Footer from "./components/Footer";

const App = () => {
  const [notes, setNotes] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes);
    });
  }, []);

  const toggleImportance = (id) => {
    const noteToToggle = notes.find((note) => note.id === id);
    const changedNote = {
      ...noteToToggle,
      important: !noteToToggle.important,
    };
    noteService
      .update(id, changedNote)
      .then((response) => {
        setNotes(notes.map((note) => (note.id === id ? response.data : note)));
      })
      .catch((error) => {
        setErrorMessage(
          `the note ${noteToToggle.content} was already deleted from the server`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);

        setNotes(notes.filter((note) => note.id !== id));
      });
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const addNote = (e) => {
    e.preventDefault();
    const newNote = {
      // id: uuidv4(),
      content: inputValue,
      important: true,
    };
    noteService.create(newNote).then((response) => {
      setNotes(notes.concat(response.data));
      setInputValue("");
    });
  };

  const handleShowAllClick = () => {
    setShowAll(!showAll);
  };

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  if (!notes) {
    return null;
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <ul>
        {notesToShow.map((note) => (
          <Note
            note={note}
            toggleImportance={() => toggleImportance(note.id)}
            key={note.id}
          />
        ))}
      </ul>

      <div>
        <label htmlFor="showAll">
          <strong>show all</strong>
        </label>
        <input
          type="checkbox"
          id="showAll"
          name="showAll"
          onChange={handleShowAllClick}
          checked={showAll}
        />
      </div>

      <br />
      <form onSubmit={addNote}>
        <input
          value={inputValue}
          onChange={handleInputChange}
          placeholder="type here for new note ..."
        />
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  );
};

export default App;
