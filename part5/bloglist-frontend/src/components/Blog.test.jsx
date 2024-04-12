import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title and author', () => {
	const blog = {
		title: 'Test title',
		author: 'tester',
		url: 'test.com',
		likes: '50',
		user: {
			name: 'test name',
		},
	}

	render(
		<Blog
			title={blog.title}
			author={blog.author}
			url={blog.url}
			likes={blog.likes}
			user={blog.user}
		/>
	)

	screen.debug()

	const element = screen.getByText('Test title tester')
	expect(element).toBeDefined()
})

test('clicking the view button displays url and likes', async () => {
	const blog = {
		title: 'Test title',
		author: 'tester',
		url: 'test.com',
		likes: '50',
		user: {
			name: 'test name',
		},
	}

	render(
		<Blog
			title={blog.title}
			author={blog.author}
			url={blog.url}
			likes={blog.likes}
			user={blog.user}
		/>
	)

	const user = userEvent.setup()
	const button = screen.getByText('view')
	await user.click(button)

	const url = screen.getByText('test.com')
	const likes = screen.getByText('50')
	expect(url).toBeDefined()
	expect(likes).toBeDefined()
})

test('clicking the like button will call the event handler', async () => {
	const blog = {
		title: 'Test title',
		author: 'tester',
		url: 'test.com',
		likes: '50',
		user: {
			name: 'test name',
		},
	}

	const mockHandler = vi.fn()

	render(
		<Blog
			title={blog.title}
			author={blog.author}
			url={blog.url}
			likes={blog.likes}
			user={blog.user}
			updateBlog={mockHandler}
		/>
	)

	const user = userEvent.setup()
	const view = screen.getByText('view')
	const like = screen.getByText('like')
	await user.click(view)
	await user.click(like)
	await user.click(like)

	expect(mockHandler.mock.calls).toHaveLength(2)
})
