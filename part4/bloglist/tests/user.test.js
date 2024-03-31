const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const supertest = require('supertest')
const mongoose = require('mongoose')

const User = require('../models/user')

const app = require('../app')

const api = supertest(app)

describe('when there is literally one user in db', () => {
	beforeEach(async () => {
		await User.deleteMany({})

		const passwordHash = await bcrypt.hash('sekret', 10)
		const user = new User({ username: 'root', name: 'name', passwordHash })

		await user.save()
	})

	test.only('creation succeeds with a fresh username', async () => {
		const usersAtStart = await helper.usersInDb()

		const newUser = {
			username: 'testuser',
			name: 'Testificate',
			password: 'qwerty',
		}

		await api
			.post('/api/users')
			.send(newUser)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		const usersAtEnd = await helper.usersInDb()
		assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

		const usernames = usersAtEnd.map((u) => u.username)
		assert(usernames.includes(newUser.username))
	})

	test.only('creation fails with an duplicate username', async () => {
		const usersAtStart = await helper.usersInDb()

		const dupeUser = {
			username: 'root',
			name: 'wrong',
			password: 'invalid',
		}
		try {
			await api
				.post('/api/users')
				.send(dupeUser)
				.expect(400)
				.expect('Content-Type', /application\/json/)
		} catch (exception) {
			console.log('duplicate error', exception)
		}

		const usersAtEnd = await helper.usersInDb()
		assert.strictEqual(usersAtEnd.length, usersAtStart.length)
	})

	test.only('creation fails with a username shorter than 3 characters', async () => {
		const usersAtStart = await helper.usersInDb()

		const shortUser = {
			username: '12',
			name: 'xdd',
			password: 'fadsfas',
		}

		await api
			.post('/api/users')
			.send(shortUser)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		const usersAtEnd = await helper.usersInDb()
		assert.strictEqual(usersAtEnd.length, usersAtStart.length)
	})
})

after(async () => {
	await mongoose.connection.close()
})
