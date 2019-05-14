const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    _id: '5c9cb7eebdcafaaa90712177',
    title: 'Sallan reseptit',
    author: 'Salla',
    url: 'https://www.k-ruoka.fi/reseptit',
    likes: 5,
    __v: 0
  },
  {
    _id: '5c9cb84bbdcafaaa90712178',
    title: 'Vanelja',
    author: 'Virpi Mikkonen',
    url: 'http://vanelja.com/',
    likes: 25,
    __v: 0
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'will remove this soon' })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(b => b.toJSON())
}

const blogInDb = async (id) => {
  const blog = await Blog.findById(id)
  return blog
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, blogInDb, usersInDb
}