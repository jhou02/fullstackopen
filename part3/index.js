require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(express.json())
app.use(morgan( (tokens, request, response) => {
	return [
		tokens.method(request, response),
		tokens.url(request, response),
		tokens.status(request, response),
		tokens.res(request, response, 'content-length'), '-',
		tokens['response-time'](request, response), 'ms',
		JSON.stringify(request.body)
	].join(' ')
} ))
app.use(cors())
app.use(express.static('dist'))

app.use((request, response, next) => {
	request.requestTime = new Date()
	next()
})

app.get('/info', (request, response, next) => {
	const requestTime = request.requestTime
	Person.find({})
		.then((people) => {
			response.send(`<p>Phonebook has info for ${people.length} people</p>
			<p>${requestTime}</p>`)
		})
		.catch((error) => next(error))
})

app.get('/api/persons', (request, response) => {
	Person.find({}).then(people	 => {
		response.json(people)
	})
})

app.get('/api/persons/:id', (request, response, next) => {
	Person.findById(request.params.id).then(person => {
		if (person) {
			response.json(person)
		} else {
			response.status(404).end()
		}
	})
		.catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
	Person.findByIdAndDelete(request.params.id)
		.then(() => {
			response.status(204).end(0)
		})
		.catch(error => next(error))
})

app.post('/api/persons/', (request, response, next) => {
	const body = request.body

	if(!request.body.name) {
		response.status(400).json({ error: 'name missing' })
		return
	}
	if(!request.body.number) {
		response.status(400).json({ error: 'number missing' })
		return
	}
	// if(persons.find(p => p.name === body.name)) {
	// 	response.status(400).json({error: 'name must be unique'})
	// 	return
	// }

	const person = new Person({
		name: body.name,
		number: body.number
	})

	person.save()
		.then(savedPerson => {
			response.json(savedPerson)
		})
		.catch(error => next(error))

})

app.put('/api/persons/:id', (request, response, next) => {
	const { name, number } = request.body

	Person.findByIdAndUpdate(request.params.id, { name, number }, { new: true, runValidators: true, context: 'query' })
		.then(updatedPerson => {
			response.json(updatedPerson)
		})
		.catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
	console.error(error.message)

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message })
	}

	next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})