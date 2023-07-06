const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const dbFilePath = path.join(__dirname, 'db', 'db.json');
const publicDirectoryPath = path.join(__dirname, '../../');
const notesFilePath = path.join(__dirname, '../../notes.html');


app.use(express.json());
app.use(express.static(publicDirectoryPath));
console.log(publicDirectoryPath)
app.get('/notes', (req, res) => {
  fs.readFile(notesFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to read notes file.' });
    } else {
      res.send(data);
    }
  });
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
