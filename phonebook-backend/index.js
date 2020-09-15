require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.static('build'))
const morgan = require('morgan')
const cors = require('cors')
/*Use morgan for logging*/
/*app.use(morgan('tiny'))*/
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())

const Person=require('./models/contact')

/*let persons = [
    {
      "name": "Arto Hellas",
      "number": "04-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    }
]*/

/*app.get('/api/persons', (request, response) => {
    response.json(persons)
})*/
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons=>{
        response.json(persons)
    })
})

app.get('/info', (request, response) => {
    const dat = new Date()
    Person.find({}). then(persons=>
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${dat}</p>`))
        .catch(error=>next(error))
})

/*app.get('/api/persons/:id', (request, response)=> {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id===id)
    if (person) {
        response.json(person)
    }else {
        response.status(204).end()
    }
})*/
app.get('/api/persons/:id', (request, response, next)=> {
    Person.findById(request.params.id).then(person => {
        response.json(person)
      })
      .catch(error=>next(error))
})

/*app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})*/
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(error => next(error))
  })

/*const generatedID = () => {
    const min = Math.ceil(0);
    const max = Math.floor(100000);
    return Math.floor(Math.random() * (max - min) + min);
}*/

app.use(express.json())

/*app.post('/api/persons', (request, response) => {
    const body= request.body
    if (!body.name){
        return response.status(400).json({
            error: 'name is missing'
        })
    } else if (!body.number){
        return response.status(400).json({
            error: 'number is missing'
        })
    } else if (persons.some(p=> p.name === body.name)){
        return response.status(400).json({
            error: 'name must be unique' 
        })
    }
    const person = {
        name: body.name,
        number: body.number,
        id: generatedID()
    }
    persons= persons.concat(person)
    response.json(person)
})*/
app.post('/api/persons', (request, response) => {
    const body= request.body
    if (!body.name){
        return response.status(400).json({
            error: 'name is missing'
        })
    } else if (!body.number){
        return response.status(400).json({
            error: 'number is missing'
        })
    } /*else if (Person.find({name:body.name})!==null) {
        return response.status(400).json({
            error: 'name must be unique' 
        })
    }*/
    const person = new Person({
        name: body.name,
        number: body.number,
    })
    person.save().then(savedPerson => {
        response.json(savedPerson)
      })
      .catch(error => {
        response.status(400).send({error:error.message})
      })
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const person = {
      name: body.name,
      number: body.number,
    }
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
  })

const PORT = process.env.PORT 
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})