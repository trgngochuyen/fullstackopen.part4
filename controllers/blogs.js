const router = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

/*const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}*/

router.get('/', async (request, response) => {
    const blogs = await Blog
        .find({}).populate('user', { username: 1, name: 1 })

    response.json(blogs.map(blog => blog.toJSON()))
})
    
router.post('/', async (request, response, next) => {
    const body = request.body

    const token = request.token
    console.log(token)

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET)
        console.log(decodedToken)
        if (!token || !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }
    
        const user = await User.findById(decodedToken.id)

        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes,
            user: user._id
        })
    
        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        response.status(201)
        response.json(savedBlog.toJSON())
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
    const token = request.token
    const blog = await Blog.findById(request.params.id)

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET)
        if (token && decodedToken.id === blog.user.toString()) {
            // delete the blog in blogs collection
            await Blog.findByIdAndRemove(request.params.id)
            // find the user by the id returned from decodedtoken, then update the blogs array in the user document
            const theUser = await User.findById(decodedToken.id)
            theUser.blogs = theUser.blogs.filter(b => b.toString() !== request.params.id) 
            response.status(204).end()
        } else if (!token && !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }
        
    } catch (exception) {
        next(exception)
    }
})

module.exports = router