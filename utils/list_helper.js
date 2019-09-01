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

module.exports = {
    dummy,
    totalLikes
}