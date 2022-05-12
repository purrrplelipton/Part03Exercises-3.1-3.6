const express = require("express")
const app = express()

app.use(express.json())

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

app.get("/", (req, res) => {
  return (
    res.send(
      `<h1>phonebook with express</h1>`
    )
  )
})

app.get("/api/persons", (req, res) => {
  return (
    res.json(persons)
  )
})

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  return (
    person ? res.json(person) : res.status(404).end()
  )
})

app.get("/info", (req, res) => {
  let prsnsLen = persons.length
  return res.send(`
    <p>Phonebook has info for ${prsnsLen} people</p>
    <p>${new Date()}</p>
  `)
})

const rngId = () => {
  let rngId = Math.floor(Math.random() * 100)
  if(persons.findIndex(person => person.id === rngId) === -1) {
    return rngId
  }
}

app.post("/api/persons", (req, res) => {
  const contact = req.body
  const content = { ...contact, id: rngId() }

  if(persons.findIndex((person) => (
      person.name.toLowerCase() === content.name.toLowerCase()
    )) === -1) {
    persons.concat(content)
    console.log(content)
    res.json(content)
  } else {
    console.log(`${req.body.name} already exists`)
    res.status(400).end()
  }
  
})

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id === id)
  return res.status(204).end()
})

const port = 3013
app.listen(port, () => (
  console.log(`server running on port ${port}`)
))
