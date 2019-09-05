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

describe.only('test HTTP POST request', async => {
    test('a valid blog can be added', async () => {
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
        
        // if the new blog is successfully added, the number of documents in the collection increases by 1,
        // and its title and author will be included

        expect(numberOfBlogsAfter).toBe(helper.initialBlogs.length +1)
        expect(titles).toContain('Porkkanakakku')
        expect(authors).toContain('Yan')
    })
    
    test('missing likes will have default value of zero', async () => {
        const newBlog = {
            title: 'Porkkanakakku ja hillo',
            author: 'Jenni',
            url: 'http://localhost:3003/api/blogs/9',
        }
    
        const response = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
        
        // if likes property is missing from the request, default value will be 0

        expect(response.body.likes).toBe(0)
    })
})

afterAll(() => {
    mongoose.connection.close()
})