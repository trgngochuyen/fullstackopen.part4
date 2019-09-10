const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
    _id: "5d7537dcb5f6d6126478af51",
    likes: "545",
    title: "Busan Vacance",
    author: "Haha",
    url: "http://localhost:3003/api/blogs/1",
    user: "5d73b341337ede72bf0c9cac",
    __v: 0    
},
    {
    _id: "5d75340ce1f46d11e701778c",
    likes: "76766",
    title: "Into a New World",
    author: "SNSD",
    url: "http://localhost:3003/api/blogs/2",
    user: "5d75372eb5f6d6126478af4f",
    __v: 0    
    },
    {
    _id: "5d75384cb5f6d6126478af53",
    likes: "253462",
    title: "Pool",
    author: "Woodz",
    url: "http://localhost:3003/api/blogs/3",
    user: "5d75375bb5f6d6126478af50",
    __v: 0    
    },
    {
    _id: "5d75385ab5f6d6126478af54",
    likes: "65754",
    title: "Different",
    author: "Woodz",
    url: "http://localhost:3003/api/blogs/4",
    user: "5d75375bb5f6d6126478af50",
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