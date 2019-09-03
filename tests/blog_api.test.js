const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('notes are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('there is one blog', async () => {
    const response = await api.get('/api/blogs')
    
    expect(response.body.length).toBe(1)
})

/*test.only('unique identifier property is named id', async () => {
    const response = await api.get('api/blogs')
    
    expect(response.id).toBeDefined()
})*/

afterAll(() => {
    mongoose.connection.close()
})