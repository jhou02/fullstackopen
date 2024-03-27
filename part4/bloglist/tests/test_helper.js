const Blog = require('../models/blog')

const initialBlogs = [
	{
		title: 'Dragon Ball',
		author: 'Akira Toriyama',
		url: 'shonenjump.com',
		likes: '9001',
	},
	{
		title: 'One Piece',
		author: 'Eiichiro Oda',
		url: 'mangaplus.shueisha.co.jp',
		likes: '1',
	},
]

const nonExistingID = async () => {
	const blog = new Blog({ title: 'willremovethissoon' })
	await blog.save()
	await blog.deleteOne()

	return note._id.toString()
}

const blogsInDb = async () => {
	const blogs = await Blog.find({})
	return blogs.map((blog) => blog.toJSON())
}

module.exports = {
	initialBlogs,
	nonExistingID,
	blogsInDb,
}
