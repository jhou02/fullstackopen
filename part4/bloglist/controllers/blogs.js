const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({}).populate('user', {
		username: 1,
		name: 1,
		id: 1,
	})
	response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
	const body = request.body

	const user = request.user

	if (!body.likes) {
		body.likes = '0'
	}

	const blog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes,
		user: user._id,
	})

	const savedBlog = await blog.save()
	user.blogs = user.blogs.concat(savedBlog._id)
	await user.save()

	response.status(201).json(savedBlog.toJSON())
})

blogsRouter.delete('/:id', async (request, response) => {
	const user = request.user

	const blog = await Blog.findById(request.params.id)
	if (blog.user.toString() !== user._id.toString()) {
		return response.status(401).json({ error: 'user does not match' })
	}

	await Blog.findByIdAndDelete(request.params.id)
	response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
	const body = request.body
	const user = request.user
	if (body.user.toString() !== user._id.toString()) {
		return response.status(401).json({ error: 'user does not match' })
	}

	const blog = {
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes,
		user: user._id.toString(),
	}

	const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
		new: true,
	})
	response.json(updatedBlog.toJSON())
})

module.exports = blogsRouter
