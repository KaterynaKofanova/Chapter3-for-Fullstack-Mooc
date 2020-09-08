const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.u1eth.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', contactSchema)

if (process.argv.length > 3){
    const contact = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })
      
    contact.save().then(result => {
        console.log(`Added ${result.name} number ${result.number} to the phonebook`)
        mongoose.connection.close()
    })
}


if (process.argv.length == 3){
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
          console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
}
