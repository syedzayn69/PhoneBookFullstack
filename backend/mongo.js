// const mongoose = require('mongoose')
// const password = process.argv[2]

// const url = `mongodb+srv://syedZayn:${password}@cluster1.4bcqdzb.mongodb.net/?retryWrites=true&w=majority`

// let name = process.argv[3]
// let number = process.argv[4]
// mongoose.set('strictQuery',false)
// mongoose.connect(url)

// const personSchema = new mongoose.Schema({
//     name : String,
//     number : String
// })

// const Person = mongoose.model('Person',personSchema)

// if(process.argv.length === 3){
//     Person.find({}).then(results => {
//         console.log('Phonebook:')
//       results.forEach(person => {
//         console.log(person.name , person.number)
//       })
//       mongoose.connection.close()
//     })
// }
// else{
//     const person = new Person({
//         name : name,
//         number: number
//     })
    
//     person.save().then(results => {
//         console.log(`Added ${name}'s number ${number} to phonebook`)
//         mongoose.connection.close()
//     })
// }
