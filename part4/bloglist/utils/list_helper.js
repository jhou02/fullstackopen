const dummy = (blogs) => {
	return 1
}

const totalLikes = (blogs) => {
	likes = blogs.map((blog) => {
		return blog.likes
	})

	return likes.reduce((sum, likes) => {
		return sum + likes
	}, 0)
}

const favorite = (blogs) => {
	if (blogs.length === 0) {
		return {}
	}

	likes = blogs.map((blog) => blog.likes)

	const favLikes = likes.reduce((max, current) => {
		return Math.max(max, current)
	}, likes[0])

	const fav = blogs.find((blog) => blog.likes === favLikes)

	return { title: fav.title, author: fav.author, likes: fav.likes }
}

const mostBlogs = (blogs) => {
	if (blogs.length === 0) {
		return {}
	}
	const authorBlogs = {}

	blogs.forEach((blog) => {
		authorBlogs[blog.author] = (authorBlogs[blog.author] || 0) + 1
	})

	const mostAuthor = Object.keys(authorBlogs).reduce((a, b) =>
		authorBlogs[a] > authorBlogs[b] ? a : b
	)

	return { author: mostAuthor, blogs: authorBlogs[mostAuthor] }
}

const mostLikes = (blogs) => {
	if (blogs.length === 0) {
		return {}
	}
	const authorLikes = {}

	blogs.forEach((blog) => {
		authorLikes[blog.author] = (authorLikes[blog.author] || 0) + blog.likes
	})

	const mostLiked = Object.keys(authorLikes).reduce((a, b) =>
		authorLikes[a] > authorLikes[b] ? a : b
	)

	return { author: mostLiked, likes: authorLikes[mostLiked] }
}

module.exports = {
	dummy,
	totalLikes,
	favorite,
	mostBlogs,
	mostLikes,
}
