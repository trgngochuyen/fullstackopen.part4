const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
    },
    {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
    }
]

const initialUsers = [
    {
        _id: "5d73b341337ede72bf0c9cac",
        blogs:["5d75340ce1f46d11e701778c"],
        username:"hiuhiuhiu",
        name:"Haha"
    },
    {
        _id:"5d75375bb5f6d6126478af50",
        blogs:["5d75384cb5f6d6126478af53","5d75385ab5f6d6126478af54","5d754c25033b8317b0346a52","5d754dacb5fdad1805ee3d1d","5d7552645067cd19c63a3dc1","5d7666a32a32fb2c026b8f1e","5d76bb36ce341c39cf9cd613"],
        username:"SeungYeonie",
        name:"Woodz"
    }
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async() => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    initialBlogs, initialUsers, blogsInDb, usersInDb
}