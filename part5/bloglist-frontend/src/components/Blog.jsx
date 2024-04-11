import { useState } from 'react'
const Blog = ({
	title,
	author,
	url,
	likes,
	user,
	updateBlog,
	id,
	deleteBlog,
}) => {
	const blogStyle = {
		paddingTop: 10,
		paddingLeft: 2,
		border: 'solid',
		borderWidth: 1,
		marginBottom: 5,
	}

	const [visible, setVisible] = useState(false)
	const showWhenVisible = { display: visible ? '' : 'none' }
	const buttonLabel = visible ? 'hide' : 'view'

	const toggleVisible = () => {
		setVisible(!visible)
	}

	const increaseLikes = () => {
		const updatedBlog = {
			user: user.id,
			likes: likes + 1,
			author: author,
			title: title,
			url: url,
			id: id,
		}
		updateBlog(updatedBlog)
	}

	const removeBlog = () => {
		const blogToDelete = {
			user: user.id,
			likes: likes,
			author: author,
			title: title,
			url: url,
			id: id,
		}
		deleteBlog(blogToDelete)
	}

	return (
		<div style={blogStyle}>
			<div>
				{title} {author}{' '}
				<button type="button" onClick={toggleVisible}>
					{buttonLabel}
				</button>
			</div>
			<div style={showWhenVisible}>
				<div>{url}</div>
				<div>
					{likes} <button onClick={increaseLikes}>like</button>
				</div>
				<div>{user.name}</div>
				<button onClick={removeBlog}>remove</button>
			</div>
		</div>
	)
}

export default Blog
