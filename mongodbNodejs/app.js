const express = require("express");
const { ObjectId } = require("mongodb");
const { connectToDb, getDB } = require("./db");

// init app and middleware

const app = express();

app.use(express.json()) //to use it in post request

// db connection
let db;

connectToDb((err) => {
  if (!err) {
    app.listen(3000, () => {
      console.log("app listening to port 3000");
    });
    db = getDB();
  }
});

//  routes

app.get("/books", (req, res) => {
  let books = [];

  db.collection("books")
    .find() //cursor toArray or forEach
    .sort({ author: 1 })
    .forEach((book) => books.push(book))
    .then(() => {
        res.status(200).json(books)
    })
    .catch(() =>{
        res.status(500).json({error: 'could not fetch the dociments'})
    })
//   res.json({ mssg: "welcome to api" });
});


app.get('/books/:id', (req, res) =>{
    
    db.collection('books')
    .findOne({_id: ObjectId(req.params.id)})
    .then(doc =>{
        res.status(200).json(doc)
    })
    .catch(err =>{
        res.status(500).json({error: 'not found'})
    })
})


app.post('/books', (req, res) =>{
  const book = req.body

  db.collection('books')
  .insertOne(book)
  .then(result =>{
    res.status(201).json(result)
  })
  .catch(err =>{
    res.status(500).json({err:'coudnt do it sad'})
  })
})


app.delete('/books/:id', (req, res) =>{
  if(ObjectId.isValid(req.params.id)){
    db.collection('books')
    .deleteOne({_id: ObjectId(req.params.id)})
    .then(result =>{
      res.status(200).json(result)
    })
    .catch(err =>{
      res.status(500).json({err: "not deleted"})
    })
  }else{
    res.status(500).json({error: "not valid doc"})
  }
})


app.patch('/books/:id', (req, res) =>{
  const updates = req.body
 if (ObjectId.isValid(req.params.id)) {
   db.collection("books")
     .updateOne({ _id: ObjectId(req.params.id) }, {$set: updates})
     .then((result) => {
       res.status(200).json(result);
     })
     .catch((err) => {
       res.status(500).json({ err: "not deleted" });
     });
 } else {
   res.status(500).json({ error: "not valid doc" });
 }


})