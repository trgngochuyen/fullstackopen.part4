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
        const savedBlog = await blog.save()
        response.json(savedBlog.toJSON())
    } catch (exception) {
        next(exception)
    }
    
    
})

module.exports = router