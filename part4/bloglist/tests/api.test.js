const { test, after, beforeEach } = require('node:test')
const Blog = require('../models/blog')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

beforeEach(async () => {
	await Blog.deleteMany({})
	let blogObject = new Blog(helper.initialBlogs[0])
	await blogObject.save()
	blogObject = new Blog(helper.initialBlogs[1])
	await blogObject.save()
})

test.only('blogs are returned as json', async () => {
	await api
		.get('/api/blogs')
		.expect(200)
		.expect('Content-Type', /application\/json/)
})

test.only('there are correct # of blogs', async () => {
	const response = await api.get('/api/blogs/')

	assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test.only('a valid blog can be added ', async () => {
	const newBlog = {
		title: 'Jujutsu Kaisen',
		author: 'gege',
		url: 'xdd.com',
		likes: '2',
	}

	await api
		.post('/api/blogs')
		.send(newBlog)
		.expect(201)
		.expect('Content-Type', /application\/json/)

	const blogsAtEnd = await helper.blogsInDb()

	const titles = blogsAtEnd.map((r) => r.title)

	assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
	assert(titles.includes('Jujutsu Kaisen'))
})

test.only('unique identifier is named /"id/" ', async () => {
	const blogs = await helper.blogsInDb()
	assert.strictEqual(typeof blogs[0]._id, 'undefined')
})

test.only('if likes property is missing from request, default to 0', async () => {
	const newBlog = {
		title: 'Jujutsu Kaisen',
		author: 'gege',
		url: 'xdd.com',
	}

	await api
		.post('/api/blogs')
		.send(newBlog)
		.expect(201)
		.expect('Content-Type', /application\/json/)

	const blogsAtEnd = await helper.blogsInDb()
	const addedBlog = blogsAtEnd.find((blog) => blog.title === 'Jujutsu Kaisen')
	assert.strictEqual(addedBlog.likes, 0)
})

test.only('if title and url property are missing from request, response code is 400', async () => {
	const newBlog = {
		author: 'me',
		likes: '0',
	}

	await api
		.post('/api/blogs')
		.send(newBlog)
		.expect(400)
		.expect('Content-Type', /application\/json/)

	const blogsAtEnd = await helper.blogsInDb()

	assert(blogsAtEnd.length === helper.initialBlogs.length)
})

test.only('deleting a valid blog', async () => {
	const blogs = await helper.blogsInDb()
	const blogToDelete = blogs[0]
	await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

	const blogsAtEnd = await helper.blogsInDb()
	assert(blogsAtEnd.length === blogs.length - 1)
})

test.only('updating a valid blog', async () => {
	const blogs = await helper.blogsInDb()
	const blogToUpdate = blogs[0]

	console.log(blogToUpdate)

	const update = {
		...blogToUpdate,
		likes: blogToUpdate.likes + 1,
	}

	console.log(update)
	await api
		.put(`/api/blogs/${blogToUpdate.id}`)
		.send(update)
		.expect(200)
		.expect('Content-Type', /application\/json/)

	const blogsAtEnd = await helper.blogsInDb()
	const blogUpdated = blogsAtEnd[0]

	assert(blogUpdated.likes === update.likes)
})

after(async () => {
	await mongoose.connection.close()
})
