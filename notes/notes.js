const fs = require('fs');
const FILE_NAME = 'logs.json';

let fetchNotes = () => {
  try {
    let notes = JSON.parse(fs.readFileSync(FILE_NAME));
    return notes;
  }  catch(e) {
    return [];
  }
};

let writeNote = (notes) => {
  fs.writeFileSync(FILE_NAME, JSON.stringify(notes));
  return true;
};

let addNote = (title, body) => {
  let notes = fetchNotes();
  if(notes.some(note => note.title === title)){
    return false;
  } else {
    notes.push({ title, body });
    return writeNote(notes);
  }
};

let removeNote = (title) => {
  let notes = fetchNotes();
  let remainingNotes = notes.filter(note => note.title !== title);
  writeNote(remainingNotes);
};

let getNote = (title) => {
  let notes = fetchNotes();
  let note = notes.filter(note => note.title === title);
  if(note.length === 1) {
    return note[0];
  } else {
    return 'Note not found';
  }
};

let getAll = () => {
  return fetchNotes();
};

module.exports = {
  addNote,
  removeNote,
  getNote,
  getAll
};
