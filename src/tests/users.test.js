const User = require('../models/user')
const helper = require('../tests/test_helper.js')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)


describe('When there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const user = new User({ username: 'root', password: 'sekret' })
    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'sallatero',
      name: 'salla Tero',
      password: 'salainen'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username and password are too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const usernameShort = {
      username: 'r',
      name: 'Short Username',
      password: 'ssdfjsksd'
    }
    const passwordShort = {
      username: 'riikkunen',
      name: 'Short Password',
      password: 'ss'
    }

    const result1 = await api
      .post('/api/users')
      .send(usernameShort)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result1.body.error).toContain('username must be at least')
    let usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)

    const result2 = await api
      .post('/api/users')
      .send(passwordShort)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result2.body.error).toContain('password must be at least')
    usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username and/or password is not defined', async () => {
    const usersAtStart = await helper.usersInDb()

    const usernameMissing= {
      name: 'Missing Username',
      password: 'ssdfjsksd'
    }
    const passwordMissing = {
      username: 'riikkunen',
      name: 'Short Password'
    }

    const result1 = await api
      .post('/api/users')
      .send(usernameMissing)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result1.body.error).toContain('user must have a username')
    let usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)

    const result2 = await api
      .post('/api/users')
      .send(passwordMissing)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result2.body.error).toContain('user must have a password')
    usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})