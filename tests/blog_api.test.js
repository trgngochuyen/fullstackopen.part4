const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const _= require('lodash')

const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
    // Reset blogs test collection, commented out when not testing
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
    
    // Reset users test collection, commented out when not testing
    /*await User.deleteMany({})

    const userObjects = helper.initialUsers
        .map(user => new User(user))
    const promiseArray = userObjects.map(user => user.save())
    await Promise.all(promiseArray)*/
})

/*test('blogs are returned as json', async () => {
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

describe('test HTTP POST request', async => {
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

    test('blog missing title or url will be rejected', async () => {
        const newBlog = {
            author: 'Jenni'
        }
    
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
        
        const blogsAfter = await helper.blogsInDb()
        expect(blogsAfter.length).toBe(helper.initialBlogs.length)
    })
})

describe('deleting a blog', () => {
    test('delete a blog with a valid id', async () => {
        const blogsBefore = await helper.blogsInDb()
        const blogToDelete = blogsBefore[1]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)

        const blogsAfter = await helper.blogsInDb()

        expect(blogsAfter.length).toBe(helper.initialBlogs.length - 1)
        
        const titles = blogsAfter.map(b => b.title)

        expect(titles).not.toContain(blogToDelete.title)
    })
})

describe('when there is initially one user at db', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        const user = new User({ username: 'hanna', password: 'lalala' })
        await user.save()
    })
    
    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'huyentruong',
            name: 'Truong Ngoc Huyen',
            password: 'locoloco',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })
    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'hanna',
            name: 'Em La Ai',
            password: 'lololo',
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
    test('creation fails with proper status code and message if username is shorter than 3 characters', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'ty',
            name: 'tada',
            password: 'theuthao',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('User validation failed: username: Path `username` (`ty`) is shorter than the minimum allowed length (3).')
        
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd.length).toBe(usersAtStart.length)
    })
    test('creation fails with proper status code and message if password is shorter than 3 characters', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'tuy',
            name: 'tada',
            password: 'to',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('Password and Username must contain at least 3 characters')
        
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd.length).toBe(usersAtStart.length)
    })
})

describe('author blogs the most', () => {

    const mostBlogs = (blogs) => {
        if (blogs.length === 0) {
            return null
        }
        const authors = blogs.map(blog => blog.author)
        const count =_.countBy(authors, _.value)
        const maxBlogs = _.maxBy(_.toArray(count), _.value)
        const maxAuthor = _.maxBy(_.keys(count), o => count[o])
    
        return {
            author: maxAuthor,
            blogs: maxBlogs
        }  
    }

    test('of an empty list return null', async () => {
      expect(mostBlogs([])).toBe(null)
    })
    test('of a list of blogs returns author with most blogs', async () => {
      const blogs = await Blog.find({})
      const result = mostBlogs(users)
      expect(result).toEqual({
          author: "Woodz",
          blogs: 2
      })
    })
})*/

describe('author has the most likes', () => {
    const mostLikes = (blogs) => {
        if (blogs.length === 0) {
            return null
        }
        const authors = blogs.map(blog => {
            return { 'author': blog.author, 'likes': blog.likes }
        })
        const sumLikes = _(authors)
            .groupBy('author')
            .map((objs, key) => {
                return {
                    'author': key,
                    'likes': _.sumBy(objs, 'likes')
                }
            })
            .value()
        const maxLikes = _.maxBy(sumLikes, s => s.likes)
        
        return maxLikes
    }

    test('of an empty list return null', async () => {
        expect(mostLikes([])).toBe(null)
    })
    test('of a list of blogs returns author with most likes', async () => {
        const blogs = await helper.blogsInDb()
        const result = mostLikes(blogs)
        expect(result).toEqual({
            author: "Woodz",
            likes: 319216
        })
    })
})

afterAll(() => {
    mongoose.connection.close()
})