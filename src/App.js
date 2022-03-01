import React, { useState ,useEffect} from 'react';
import './App.css';
import Preview from './Components/Preview';
import Message from './Components/Message';
import NotesContainer from './Components/Notes/NotesContainer';
import NotesList from './Components/Notes/NotesList';
import Note from './Components/Notes/Note';
import NoteForm from './Components/Notes/NoteForm';
import Alert from './Components/Alert';

function App() {

  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    if (localStorage.getItem('notes')) {
      setNotes(JSON.parse(localStorage.getItem('notes')));
    } else {
      localStorage.setItem('notes', JSON.stringify([]));
      setNotes([]);
    }
  }, []);
  //save to localStorage
  const saveToLocalStorage = (name, item) => {
    localStorage.setItem(name, JSON.stringify(item));
  };

  const validate =() =>{
    const validationErrors = [];
    let passed = true;
    if(!title) {
      validationErrors.push('الرجاء ادخال عنوان الملاحظة');
      passed = false;
    }
    if(!content) {
      validationErrors.push("الرجاء ادخال نص الملاحظة");
      passed=false;
    }
    setValidationErrors(validationErrors);
    return passed;
  }
// 3 second to hide the error message
useEffect(() => {
  if (validationErrors.length !== 0) {
    setTimeout(() => {
      setValidationErrors([]);
    }, 3000);
  }
}, [validationErrors]);


  //change the title
  const changeTitleHandler = (event) => {
    setTitle(event.target.value);
  }
  //change the subtitle
  const changeContentHandler = (event) => {
    setContent(event.target.value);
  }
  //save the note 
  const saveNoteHandeler = () => {

    if(! validate())return;

    const note = {
      id: new Date(),
      title: title,
      content: content
    }
    const updateNotes = [...notes, note];
    saveToLocalStorage('notes', updateNotes);
    setNotes(updateNotes);
    setCreating(false);
    setSelectedNote(note.id);
    setTitle('');
    setContent('');
  }
  //choose a note
  const selectNoteHandler = noteId => {
    setSelectedNote(noteId);
    setCreating(false);
    setEditing(false);

  }

  //edit a note situation
  const editNoteHandler = () => {
    const note = notes.find(note => note.id === selectedNote);
    setEditing(true);
    setTitle(note.title);
    setContent(note.content);
  }

  //edit note
  const updateNoteHandler = () => {
    if(! validate())return;
    const updatedNotes = [...notes];
    const noteIndex = notes.findIndex(note => note.id === selectedNote);
    updatedNotes[noteIndex] = {
      id: selectedNote,
      title: title,
      content: content
    };
    saveToLocalStorage('notes', updatedNotes);
    setNotes(updatedNotes);
    setEditing(false);
    setTitle('');
    setContent('');
  }
  // add note front 

  const addNoteHandler = () => {
    setCreating(true);
    setEditing(false);
    setTitle('');
    setContent('');
  }

  //delete a Note
  const deleteNoteHandler = () => {
    const updateNotes = [...notes];
    const noteIndex = updateNotes.findIndex(note => note.id === selectedNote);
    notes.splice(noteIndex, 1);
    saveToLocalStorage('notes', updateNotes);
    setNotes(notes);
    setSelectedNote(null);
  }

  const getAddNote = () => {
    return (
      <NoteForm
        formTitle="ملاحظة جديدة"
        title={title}
        content={content}
        titleChanged={changeTitleHandler}
        contentChanged={changeContentHandler}
        submitText="حفظ"
        submitClicked={saveNoteHandeler}
      />
    );
  };

  const getPreview = () => {
    if (notes.length === 0) {
      return <Message title="لا يوجد ملاحظة" />
    }
    if (!selectedNote) {
      return <Message title="الرجاء اختيار ملاحظ" />
    }

    const note = notes.find(note => {
      return note.id === selectedNote;
    });
    let noteDisplay = (

      <div>
        <h2>{note.title}</h2>
        <p>{note.content}</p>
      </div>
    )

    if (editing) {
      noteDisplay = (
        <NoteForm
          formTitle="تعديل ملاحظة "
          title={title}
          content={content}
          titleChanged={changeTitleHandler}
          contentChanged={changeContentHandler}
          submitText="تعديل"
          submitClicked={updateNoteHandler}
        />
      );
    }


    return (
      <div>
        {!editing &&
          <div className="note-operations">
            <a href="#" onClick={editNoteHandler}>
              <i className="fa fa-pencil-alt" />
            </a>
            <a href="#" onClick={deleteNoteHandler}>
              <i className="fa fa-trash" />
            </a>
          </div>
        }
        {noteDisplay}
      </div>
    );
  };

  return (
    <div className="App">
      <NotesContainer>
        <NotesList>
          {notes.map(note =>
            <Note
              key={notes.id} title={note.title}
              noteClicked={() => selectNoteHandler(note.id)}
              active={selectedNote === note.id}
            />
          )}
        </NotesList>
        <button className="add-btn" onClick={addNoteHandler}>+</button>
      </NotesContainer>
      <Preview >
        {creating ? getAddNote() : getPreview()}
      </Preview>
      {validationErrors.length !== 0 && <Alert validationMessage={validationErrors} />}
    </div>
  );
}

export default App;
