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

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return null
    }
    const map = blogs.map(blog => blog.author)
    const count = _.countBy(map, _.value)
    const max =_.maxBy(count, _.keys)
/*  let mostBlogs = count[0]
    count.forEach(author => {
        if(author > mostBlogs) {
            mostBlogs = author
        }
    })

    return {
        author: mostBlogs.key,
        blogs: mostBlogs.value
    }
*/
    return max
}
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
}