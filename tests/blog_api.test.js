const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    
    expect(response.body.length).toBe(helper.initialBlogs.length)
})

test('unique identifier property is named id', async () => {
    const response = await api.get('/api/blogs')
    const identifier = response.body.map(r => r.id)
    expect(identifier).toBeDefined()
})

test.only('a valid blog can be added', async () => {
    const newBlog = {
        title: 'Porkkanakakku',
        author: 'Yan',
        url: 'http://localhost:3003/api/blogs/9',
        likes: 829
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    const afterAdding = await helper.blogsInDb()
    const titles = afterAdding.map(r => r.title)
    const authors = afterAdding.map(r => r.author)
    const numberOfBlogsAfter = afterAdding.length

    expect(numberOfBlogsAfter).toBe(helper.initialBlogs.length +1)
    expect(titles).toContain('Porkkanakakku')
    expect(authors).toContain('Yan')
})

test('missing likes will have default value of zero', async () => {
    const newBlog = {
        title: 'Porkkanakakku ja hillo',
        author: 'Jenni',
        url: 'http://localhost:3003/api/blogs/9',
        likes: undefined
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)

    const afterAdding = await helper.blogsInDb()
    const likes = afterAdding.filter(blog => blog.likes===0)
    expect(afterAdding.length).toBe(helper.initialBlogs.length+1)
    expect(likes).toBeDefined()
})

afterAll(() => {
    mongoose.connection.close()
})