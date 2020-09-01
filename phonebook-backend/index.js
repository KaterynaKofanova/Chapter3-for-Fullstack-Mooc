const express = require('express')
const app = express()
const morgan = require('morgan')
/*Use morgan for logging*/
/*app.use(morgan('tiny'))*/
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
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
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const size = persons.length
    const dat = new Date()
    response.send(`<p>Phonebook has info for ${size} people</p><p>${dat}</p>`)
})

app.get('/api/persons/:id', (request, response)=> {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id===id)
    if (person) {
        response.json(person)
    }else {
        response.status(204).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

const generatedID = () => {
    const min = Math.ceil(0);
    const max = Math.floor(100000);
    return Math.floor(Math.random() * (max - min) + min);
}

app.use(express.json())

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

})

const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})