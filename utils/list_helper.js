const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }
    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    let mostLiked = blogs[0]
    blogs.forEach(blog => {
        if(blog.likes > mostLiked.likes) {
            mostLiked = blog
        }
    })
    return {
        title: mostLiked.title,
        author: mostLiked.author,
        likes: mostLiked.likes
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}