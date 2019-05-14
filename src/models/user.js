const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'user must have a username'],
    minlength: [3, 'username must be at least 3 characters long'],
    unique: [true, 'username must ne unique']
  },
  name: String,
  passwordHash: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ]
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj.__v
    //Suodatetaan passwordHash eli salasanan tiiviste pois näkyviltä
    delete returnedObj.passwordHash
  }
})
const User = mongoose.model('User', userSchema)

module.exports = User