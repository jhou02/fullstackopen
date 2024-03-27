const mongoose = require('mongoose')
const config = require('../utils/config')

mongoose.connect(config.MONGODB_URI)

const blogSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	author: String,
	url: {
		type: String,
		required: true,
	},
	likes: Number,
})

blogSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	},
})

module.exports = mongoose.model('Blog', blogSchema)
