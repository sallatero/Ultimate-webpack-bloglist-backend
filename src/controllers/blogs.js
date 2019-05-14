const blogsRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog
      .find({}).populate('user', { username: 1, name: 1, id: 1 })
    response.json(blogs.map(blog => blog.toJSON()))
  } catch(exception) {
    next(exception)
  }
})

blogsRouter.post('/', async (request, response, next) => {
  //Luodaan uusu Schema-olio pyynnön perusteella
  let body = request.body
  body.comments = []
  const blog = new Blog(body)
  console.log('blogsRouter.postissa blog: ', blog)

  try {
    //Tarkistetaan että url ja title on annettu
    if(blog.title === '' || blog.title === null) {
      return response.status(400).json({ error: 'title missing' })
    }
    if(blog.url === '' || blog.url === null) {
      return response.status(400).json({ error: 'url missing' })
    }
    if (!request.token) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    //Haetaan käyttäjä kannasta
    const user = await User.findById(decodedToken.id)
    console.log('etsitään user: ', user) //username, name, id

    // Lisätään blogiin user-id
    blog.user = user.id
    console.log('blog with user-id: ', blog)
    //Talletetaan blogi kantaan
    const savedBlog = await blog.save()
    console.log('savedBlog: ', savedBlog)

    //Lisätään blog-id käyttäjän taulukkoon blogs
    user.blogs = user.blogs.concat(savedBlog._id)
    //Talletetaan user kantaan
    const savedUser = await user.save()
    console.log('savedUser: ', savedUser)

    //Tallennetaan user-olio (vain kentät username, name ja id) blogin kenttään user ja palautetaan se JSONina
    const u = savedUser.toJSON()
    const b = savedBlog.toJSON()
    b.user = { username: u.username, name: u.name, id: u.id }
    console.log('B: ', b)
    response.status(201).json(b)
  } catch(exception) {
    next(exception)
  }
})

//request.body -> { text: "kommenttiteksti" }
//request.params.id kertoo mikä blogi
blogsRouter.post('/:id/comments', async (request, response, next) => {
  try {
    console.log('request.body: ', request.body)
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    //hae kannasta oikea blogi
    const blog = await Blog.findById(request.params.id)
    console.log('blogi: ', blog)
    if (!blog) {
      return response.status(404).json({ error: 'blog does not exist' })
    }
    //lisää blogin commentteihin saamasi kommentti
    const c = blog.comments
    const newC = c.concat(request.body)
    blog.comments = newC
    console.log('blogi lisäyksen jälkeen: ', blog)
    const newVersion = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    console.log('newVersion: ', newVersion)
    const newBlog = newVersion.toJSON()
    console.log('newBlog: ', newBlog)

    if(blog.user !== undefined) {
      //Haetaan käyttäjä kannasta
      const user = await User.findById(blog.user)
      console.log('user: ', user)
      const userObj = user.toJSON()
      newBlog.user = { username: userObj.username, name: userObj.name, id: userObj.id }
    }
    if (newBlog) {
      response.status(200).json(newBlog)
    } else {
      response.status(404).end()
    }

  }catch(exception) {
    next(exception)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {

  try {
    //decodedToken: {username: <username>, id: <userid>}
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    console.log('requestToken: ', request.token)
    console.log('decodedToken: ', decodedToken)
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const blog = await Blog.findById(request.params.id)
    console.log('blog: ', blog)
    if (blog.user) {
      if (blog.user.toString() !== decodedToken.id.toString()) {
        response.status(401).json({ error: 'unauthorized user' })
      }
    }
    const deletable = await Blog.findByIdAndRemove(request.params.id)

    if (deletable) {
      console.log('poistettava blogi löytyi', request.params.id)
      response.status(204).end()
    } else {
      response.status(204).end()
    }
  } catch(exception) {
    next(exception)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {

  try {
    if (!request.token) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    console.log('request.params.id: ', request.params.id)
    const oldVersion = await Blog.findById(request.params.id)
    console.log('old version: ', oldVersion)
    if (!oldVersion) {
      return response.status(404).json({ error: 'blog does not exist' })
    }
    const body = request.body

    const putThis = {
      title: oldVersion.title,
      author: oldVersion.author,
      url: oldVersion.url,
      likes: body.likes,
      comments: oldVersion.comments
    }
    //const putThis = {...oldVersion, likes: body.likes}

    const newVersion = await Blog.findByIdAndUpdate(request.params.id, putThis, { new: true })
    const newBlog = newVersion.toJSON()
    //Haetaan blogin lisännyt käyttäjä kannasta JOS SE ON OLEMASSA
    if (oldVersion.user) {
      const user = await User.findById(oldVersion.user)
      const userObj = user.toJSON()
      newBlog.user = { username: userObj.username, name: userObj.name, id: userObj.id }
    }
    if (newBlog) {
      response.status(200).json(newBlog)
    } else {
      response.status(404).end()
    }
  } catch(exception) {
    next(exception)
  }
})

module.exports = blogsRouter