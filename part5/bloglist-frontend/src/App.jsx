import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

const App = () => {
	const [blogs, setBlogs] = useState([])
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [user, setUser] = useState(null)
	const [message, setMessage] = useState(null)
	const [messageType, setMessageType] = useState('success')

	const blogFormRef = useRef()

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
		blogs.sort((a, b) => b.likes - a.likes)
		setBlogs(blogs)
		console.log(blogs)
	}

	const addBlog = async (newBlog) => {
		blogFormRef.current.toggleVisibility()
		const addedBlog = await blogService.create(newBlog)
		setMessage(`a new blog ${addedBlog.title} by ${addedBlog.author} added`)
		setBlogs(blogs.concat(addedBlog))

		setTimeout(() => {
			setMessage(null)
		}, 5000)
	}

	const updateBlog = async (update) => {
		try {
			const updatedBlog = await blogService.update(update)
			setMessage(`updated ${updatedBlog.title}`)
			setTimeout(() => {
				setMessage(null)
			}, 5000)
			getBlogs()
		} catch (exception) {
			setMessageType('error')
			setMessage(`Failed to update ${update.title}`)
			setTimeout(() => {
				setMessage(null)
				setMessageType('success')
			}, 5000)
		}
	}

	const deleteBlog = async (blogToDelete) => {
		try {
			if (window.confirm(`Remove ${blogToDelete.title}?`)) {
				await blogService.remove(blogToDelete.id)
				setMessage(`${blogToDelete.title} was successfully removed`)
				setTimeout(() => {
					setMessage(null)
				}, 5000)
				getBlogs()
			}
		} catch (exception) {
			setMessage(`Failed to remove ${blogToDelete.title}`)
			setTimeout(() => {
				setMessage(null)
			}, 5000)
		}
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
			<Togglable buttonLabel="new blog" ref={blogFormRef}>
				<BlogForm addBlog={addBlog} />
			</Togglable>
			<p></p>
			{blogs.map((blog) => (
				<Blog
					key={blog.id}
					title={blog.title}
					author={blog.author}
					url={blog.url}
					likes={blog.likes}
					user={blog.user}
					id={blog.id}
					updateBlog={updateBlog}
					deleteBlog={deleteBlog}
				/>
			))}
		</div>
	)
}

export default App
