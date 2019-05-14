const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req, res) => {
  const users = await User.find({})
    .populate('blogs', { title: 1, author: 1, url: 1, id: 1 })
  res.json(users.map(u => u.toJSON()))
})

usersRouter.get('/:id', async (req, res) => {
  const user = await User.find({ _id: req.params.id })
    .populate('blogs', { title: 1, author: 1, url: 1, id: 1 })
  res.json(user.toJSON())
})

usersRouter.post('/', async (req, res, next) => {
  try {
    const body = req.body
    if (!body.password) {
      return res.status(400).json({ error: 'user must have a password' })
    }
    if (body.password.length < 3) {
      return res.status(400).json({ error: 'password must be at least 3 characters long' })
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
      blogs: []
    })

    const savedUser = await user.save()
    res.status(201).json(savedUser)
  } catch (exception) {
    next(exception)
  }
})

module.exports = usersRouter