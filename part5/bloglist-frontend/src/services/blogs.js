import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null
let config

const setToken = (newToken) => {
	token = `Bearer ${newToken}`
	config = {
		headers: { Authorization: token },
	}
}

const getAll = async () => {
	const response = await axios.get(baseUrl, config)
	return response.data
}

const create = async (newObject) => {
	const response = await axios.post(baseUrl, newObject, config)
	return response.data
}

const update = async (updatedObject) => {
	const response = await axios.put(
		`${baseUrl}/${updatedObject.id}`,
		updatedObject,
		config
	)
	return response.data
}

const remove = async (objectID) => {
	const response = await axios.delete(`${baseUrl}/${objectID}`, config)

	return response.data
}

export default { getAll, setToken, create, update, remove }
