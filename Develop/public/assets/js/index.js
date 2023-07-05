const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const dbFilePath = path.join(__dirname, 'db', 'db.json');
const notesFilePath = '/Users/boulter97/Documents/Note-Taker/Develop/public/notes.html';


app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/notes', (req, res) => {
  res.sendFile(notesFilePath);
});

app.get('/api/notes', (req, res) => {
  fs.readFile(dbFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to read notes data.' });
    } else {
      const notes = JSON.parse(data);
      res.json(notes);
    }
  });
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  fs.readFile(dbFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to read notes data.' });
    } else {
      const notes = JSON.parse(data);
      newNote.id = notes.length > 0 ? Math.max(...notes.map(note => note.id)) + 1 : 1;
      notes.push(newNote);
      fs.writeFile(dbFilePath, JSON.stringify(notes), 'utf8', err => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Failed to save the note.' });
        } else {
          res.json(newNote);
        }
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});