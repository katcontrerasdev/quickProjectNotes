const express = require('express');
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3001;
const app = express();



// routes to pages
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// routes to api
app.post("/api/notes", (req, res) => {
    fs.readFile(__dirname + "/db/db.json", 'utf8', (error, notes) => {
        if (error) {
            return console.log(error);
        }
        notes = JSON.parse(notes);

        var id = notes[notes.length - 1].id + 1;
        var newNote = { title: req.body.title, text: req.body.text, id: id };
        var activeNote = notes.concat(newNote);

        fs.writeFile(__dirname + "/db/db.json", JSON.stringify(activeNote), (error, data) => {
            if (error) {
                return error
            }
            console.log(activeNote);
            res.json(activeNote);
        });
    });
});

//get data from db.json

app.get("/api/notes", (req, res) => {
  fs.readFile(__dirname + "/db/db.json", 'utf8', (error, data) => {
    if (error) {
      return console.log(error)
    }
    console.log("This is Notes", data)
    res.json(JSON.parse(data))
  })
});

app.delete("/api/notes/:id", (req, res) => {
  const noteId = JSON.parse(req.params.id)
  console.log(noteId)
  fs.readFile(__dirname + "/db/db.json", 'utf8', (error, notes) => {
    if (error) {
      return console.log(error)
    }
    notes = JSON.parse(notes)

    notes = notes.filter(val => val.id !== noteId)

    fs.writeFile(__dirname + "/db/db.json", JSON.stringify(notes), (error, data) => {
      if (error) {
        return error
      }
      res.json(notes)
    })
  })
})

app.put("/api/notes/:id", (req, res) => {
  const noteId = JSON.parse(req.params.id)
  console.log(noteId)
  fs.readFile(__dirname + "db/db.json", "utf8", (error, notes) => {
    if (error ){
      return console.log(error)
    }
    notes.JSONparse(notes)

    notes = notes.filter(val => val.id !== noteId)

    fs.writeFile(__dirname +"db/db.json", JSON.stringify(notes), (error, data) => {
      if (error) {
        return error
      }
      res.json(notes)
    });
  });
});

//set application listening port

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});