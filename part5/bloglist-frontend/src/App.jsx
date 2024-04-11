import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

const LoginForm = ({
	handleLogin,
	handleUsernameChange,
	handlePasswordChange,
	username,
	password,
}) => {
	return (
		<>
			<h2>Log in to application</h2>
			<form onSubmit={handleLogin}>
				<div>
					username
					<input
						type="text"
						value={username}
						name="Username"
						onChange={handleUsernameChange}
					/>
				</div>
				<div>
					password
					<input
						type="password"
						value={password}
						name="Password"
						onChange={handlePasswordChange}
					/>
				</div>
				<button type="submit">login</button>
			</form>
		</>
	)
}

const BlogForm = ({ addBlog }) => {
	const [newTitle, setNewTitle] = useState('')
	const [newAuthor, setNewAuthor] = useState('')
	const [newUrl, setNewUrl] = useState('')

	const handleTitleChange = (event) => {
		setNewTitle(event.target.value)
	}
	const handleAuthorChange = (event) => {
		setNewAuthor(event.target.value)
	}
	const handleUrlChange = (event) => {
		setNewUrl(event.target.value)
	}

	const createBlog = (event) => {
		event.preventDefault()
		addBlog({
			title: newTitle,
			author: newAuthor,
			url: newUrl,
		})
		setNewTitle('')
		setNewAuthor('')
		setNewUrl('')
	}

	return (
		<form onSubmit={createBlog}>
			<div>
				title: <input value={newTitle} onChange={handleTitleChange} />
			</div>
			<div>
				author:{' '}
				<input value={newAuthor} onChange={handleAuthorChange} />
			</div>
			<div>
				url: <input value={newUrl} onChange={handleUrlChange} />
			</div>
			<div>
				<button type="submit">create</button>
			</div>
		</form>
	)
}

const App = () => {
	const [blogs, setBlogs] = useState([])
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [user, setUser] = useState(null)
	const [message, setMessage] = useState(null)
	const [messageType, setMessageType] = useState('success')

	useEffect(() => {
		if (user !== null) {
			console.log(user)
			getBlogs()
		}
	}, [user])

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON)
			setUser(user)
			blogService.setToken(user.token)
		}
	}, [])

	const handleUsernameChange = (event) => {
		setUsername(event.target.value)
	}

	const handlePasswordChange = (event) => {
		setPassword(event.target.value)
	}

	const getBlogs = async () => {
		const blogs = await blogService.getAll()
		setBlogs(blogs)
		console.log(blogs)
	}

	const addBlog = async (newBlog) => {
		const addedBlog = await blogService.create(newBlog)
		setMessage(`a new blog ${addedBlog.title} by ${addedBlog.author} added`)
		setBlogs(blogs.concat(addedBlog))

		setTimeout(() => {
			setMessage(null)
		}, 5000)
	}

	const handleLogin = async (event) => {
		event.preventDefault()
		try {
			const user = await loginService.login({
				username,
				password,
			})

			window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
			setUser(user)
			blogService.setToken(user.token)
			setUsername('')
			setPassword('')
		} catch (exception) {
			setMessage('wrong username or password')
			setMessageType('error')
			setTimeout(() => {
				setMessage(null)
				setMessageType('success')
			}, 5000)
		}
	}

	const handleLogout = async (event) => {
		event.preventDefault()
		window.localStorage.removeItem('loggedBlogUser')
		setMessage(`logged out ${user.username}`)
		setTimeout(() => {
			setMessage(null)
		}, 5000)
		setUser(null)
		setBlogs([])
	}

	if (user === null && blogs.length === 0) {
		return (
			<div>
				<Notification message={message} messageType={messageType} />
				<LoginForm
					handleLogin={handleLogin}
					username={username}
					password={password}
					handleUsernameChange={handleUsernameChange}
					handlePasswordChange={handlePasswordChange}
				/>
			</div>
		)
	}

	return (
		<div>
			<Notification message={message} messageType={messageType} />
			<h2>blogs</h2>
			{user.name} logged in{' '}
			<button onClick={handleLogout} type="submit">
				logout
			</button>
			<h2>create new</h2>
			<BlogForm addBlog={addBlog} />
			<p></p>
			{blogs.map((blog) => (
				<Blog key={blog.id} title={blog.title} author={blog.author} />
			))}
		</div>
	)
}

export default App
