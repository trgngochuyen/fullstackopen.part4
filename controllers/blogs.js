const router = require('express').Router()
const Blog = require('../models/blog')

router.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs.map(blog => blog.toJSON()))
})
    
router.post('/', async (request, response, next) => {
    const body = request.body
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    })
    
    try {
        if (!body.title && !body.url) {
            response.status(400).end()
        } else {
            const savedBlog = await blog.save()
            response.status(201)
            response.json(savedBlog.toJSON())
        }
    } catch(exception) {
        next(exception)
    }
})

router.put('/:id', async (request, response, next) => {
    const body = request.body
    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    try {
        await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
        response.json(blog)
    } catch (exception) {
        next(exception)
    }
})

router.delete('/:id', async (request, response, next) => {
    try {
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } catch (exception) {
        next(exception)
    }
})

module.exports = router