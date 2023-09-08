const mongoose = require('mongoose')

mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose.connect(url)
    .then(res => {
        console.log('we are connected to mongo')
    })
    .catch(error => {
        console.log('connection failed due to',error.message)
    })

const personSchema = new mongoose.Schema({
    name : {
        type : String,
        minLength : 3,
        required : true
    },
    number : {
        type : String,
        validate: {
            validator: async function(v) {
              return /(\d{2,3})-(\d{7,8})/g.test(v);
            },
            message : 'Not a valid format for a phone number!' 
        }
    }
})
personSchema.set('toJSON',{
    transform:  (document,returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports =  mongoose.model('Person',personSchema)