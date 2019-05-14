const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({ text: String })
//const Comment = mongoose.model('Comment', commentSchema)

//lisää kenttä comments
const blogSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Blog must have a title'] },
  author: String,
  url: { type: String, required: [true, 'Blog must have a url'] },
  likes: { type: Number, default: 0 },
  comments: [commentSchema],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

blogSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id
    delete returnedObj._id
    delete returnedObj.__v
    if (returnedObj.comments) {
      returnedObj.comments.map(c => {
        c.id = c._id
        delete c._id
      })
    }
  }
})
const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog