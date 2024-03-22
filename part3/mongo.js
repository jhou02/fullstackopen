const mongoose = require('mongoose')

if (process.argv.length<3) {
	console.log('give password as argument')
	process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstackopen:${password}@cluster0.fzuem0t.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
	name: String,
	number: Number,
})

const Person = mongoose.model('Person', personSchema)



if(process.argv.length < 5) {
	Person.find({}).then(result => {
		result.forEach(person => {
			console.log(person)
		})
		mongoose.connection.close()
	})
}
else {
	if(!(process.argv[3] instanceof String) || !(process.argv[4] instanceof Number)) {
		console.log('arguments: <password> <name> <number>')
		process.exit(1)
	}

	const person = new Person({
		name: process.argv[3],
		number: process.argv[4],
	})

	person.save().then(() => {
		console.log('person saved!')
		mongoose.connection.close()
	})
}


