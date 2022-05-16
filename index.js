const express = require("express");

const app = express()

app.use(express.json());

const morgan = require("morgan");

const port = process.env.PORT || 3013

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const errorHandler = (err, req, res, next) => {
  if(err) {
    res.json({ err: err });
  }
};

app.get("/", (req, res, next) => {
  res.send(`<h1>phonebook application with express</h1>`)
})

app.get("/api/persons", (req, res) => {
  res.json(persons)
})

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  person ? res.json(person) : res.status(404).end()
})

app.get("/info", (req, res) => {
  res.send(
    `<h1>Phonebook has info for ${persons.length} people</h1>
    <h3>${new Date()}</h3>`
  )
})

const rngId = () => {
  let rngId = Math.floor(Math.random() * 100)
  if(persons.findIndex(person => person.id === rngId) === -1) {
    return rngId
  }
}

morgan.token(`body`, (req) => JSON.stringify(req.body))

app.post("/api/persons", morgan(`:method :url :status :res[content-length] - :response-time ms :body`), (req, res) => {
  const regExp = new RegExp(req.body.name, "i")
  const contact = req.body
  const content = { ...contact, id: rngId() }

  if( !req.body.hasOwnProperty("name") || !req.body.hasOwnProperty("number") || !Boolean(req.body.name.trim()) || req.body.number.replace(/\s/g, "").length > 13 || req.body.number.replace(/\s/g, "").length < 6 ) {
    console.log(`invalid name or number`)
    res.send(`<h1>invalid name or number</h1>`)
    res.status(400).end()
  } else if(persons.findIndex(person => person.name.match(regExp)) !== -1
    ) {
    console.log(`${req.body.name} already exists`)
    res.status(400).end()
  } else {
    persons = persons.concat(content)
    console.log(content)
    res.json(content)
  }
  
})

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id === id)
  res.status(204).end()
})

app.use(errorHandler);

app.listen(port, () => (
  console.log(`server running on port ${port}`)
));