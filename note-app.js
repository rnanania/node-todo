// In build modules
const fs = require('fs');
const _ = require('lodash');
const yargs = require('yargs');

// Custom Module
const notes = require('./notes/notes');

const titleOptions = {
  describe: 'Title of note',
  demand: true,
  alias: 't'
};
const bodyOptions = {
  describe: 'Body of note',
  demand: true,
  alias: 'b'
};
const argv = yargs
  .command('add', 'Add a new note', {
    title: titleOptions,
    body: bodyOptions
  })
  .command('list', 'List all notes')
  .command('read', 'Read a note', {
    title: titleOptions,
  })
  .command('remove', 'Remove a note', {
    title: titleOptions
  })
  .help()
  .argv;
let cmd = argv._[0];

switch(cmd){
  case 'list':
    console.log(notes.getAll());
  break;
  case 'read':
    console.info(notes.getNote(argv.title));
  break;
  case 'add':
    if(notes.addNote(argv.title, argv.body)){
      console.log("New note added");
    } else {
      console.log("Note already exist.");
    }
  break;
  case 'remove':
    notes.removeNote(argv.title);
    console.info('Note removed');
  break;
  default:
    console.log('Not Sure!!');
  break;
}
