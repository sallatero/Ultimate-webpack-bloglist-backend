const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
})

//when there is initially some blogs saved

describe('when there is initially some blogs saved', () => {

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('Id field is called id', async () => {
    const response = await api.get('/api/blogs')
    expect(200)
    expect(response.body[0].id).toBeDefined()
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body.length).toBe(helper.initialBlogs.length)
  })

  test('a specific blog is within the returned ones', async () => {
    const response = await api.get('/api/blogs')
    const titles = response.body.map(b => b.title)
    expect(titles).toContain('Sallan reseptit')
  })

})

//viewing a specific blog

//Modifying likes of a blog

describe('modifying likes of a blog', () => {

  test('a valid blog can be modified', async () => {
    const id = '5c9cb84bbdcafaaa90712178'
    const modified = {
      title: 'Vanelja',
      author: 'Virpi Mikkonen',
      url: 'http://vanelja.com/',
      likes: 250,
    }
    await api
      .put(`/api/blogs/${id}`)
      .send(modified)
      .expect(204)

    const blogAtEnd = await helper.blogInDb(id)
    expect(blogAtEnd.likes).toBe(modified.likes)
  })
  test('if likes is not given, nothing is modified', async () => {
    const id = '5c9cb84bbdcafaaa90712178'
    const modified = {
      title: 'Vanelja',
      author: 'Virpi Mikkonen',
      url: 'http://vanelja.com/'
    }
    await api
      .put(`/api/blogs/${id}`)
      .send(modified)
      .expect(400)

    const blogAtEnd = await helper.blogInDb(id)
    expect(blogAtEnd.likes).toBe(25)
  })
  test('if id doesnt exist, nothing is modified', async () => {
    const id = '5c9cb84bbdcafaaa90652178'
    const modified = {
      title: 'Vanelja',
      author: 'Virpi Mikkonen',
      url: 'http://vanelja.com/'
    }
    await api
      .put(`/api/blogs/${id}`)
      .send(modified)
      .expect(404)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
  })
})

//Addition of a new blog

describe('when there is initially some blogs saved', () => {

  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'Viimeistä murua myöten',
      author: 'Virpi Mikkonen',
      url: 'http://www.viimeistamuruamyoten.com/',
      likes: 15,
    }
    const res = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)
    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain('Viimeistä murua myöten')
    expect(res.body.user).toBeDefined()
  })

  test('if likes is not given, it is set to 0', async () => {
    const newBlog = {
      author: 'Virpi Mikkonen',
      title: 'Viimeistä murua myöten',
      url: 'http://www.viimeistamuruamyoten.com/'
    }
    const response = await api.post('/api/blogs').send(newBlog)

    expect(201)
    expect(response.body.likes).toBe(0)
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)
    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain('Viimeistä murua myöten')
    expect(response.body.user).toBeDefined()
  })

  test('blog without title and/or url is not added', async () => {
    const noTitle = {
      author: 'Virpi Mikkonen',
      url: 'http://www.viimeistamuruamyoten.com/',
      likes: 15
    }
    const noUrl= {
      author: 'Maija Miettinen',
      title: 'Jotain moskaa',
      likes: 15
    }
    const nothing= {
      author: 'Maija Miettinen',
      likes: 15
    }

    await api
      .post('/api/blogs')
      .send(noTitle)
      .expect(400)

    await api
      .post('/api/blogs')
      .send(noUrl)
      .expect(400)

    await api
      .post('/api/blogs')
      .send(nothing)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
  })

})

//Deletion of a blog

describe('deleting a blog', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(helper.initialBlogs[0])
    await blogObject.save()

    blogObject = new Blog(helper.initialBlogs[1])
    await blogObject.save()
  })

  test('blog in the database can be removed', async () => {
    const array = await helper.blogsInDb()
    const deletable = array[0]

    await api
      .delete(`/api/blogs/${deletable.id}`)

    expect(204)
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length - 1)
    const ids = blogsAtEnd.map(b => b.id)
    expect(ids).not.toContain(deletable.id)
  })

  test('blog NOT in the database leaves DB intact ', async () => {
    const deleteId = '3244432'

    await api
      .delete(`/api/blogs/${deleteId}`)

    expect(204)
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
    const ids = blogsAtEnd.map(b => b.id)
    expect(ids).not.toContain(deleteId)
  })
})

afterAll(() => {
  mongoose.connection.close()
})