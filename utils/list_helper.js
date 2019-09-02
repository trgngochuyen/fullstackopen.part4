const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item
    }
    const likesList = blogs.map(blog => blog.likes)
    return likesList.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null
    }
    let favBlog = blogs[0]
    blogs.forEach(blog => {
        if(blog.likes > favBlog.likes) {
            favBlog = blog
        }
    })
    return {
        title: favBlog.title,
        author: favBlog.author,
        likes: favBlog.likes
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}