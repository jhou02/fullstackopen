import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
	const createBlog = vi.fn()
	const user = userEvent.setup()

	render(<BlogForm addBlog={createBlog} />)

	const inputs = screen.getAllByRole('textbox')
	const sendButton = screen.getByText('create')

	await user.type(inputs[0], 'testing title')
	await user.type(inputs[1], 'testing author')
	await user.type(inputs[2], 'testing url')

	await user.click(sendButton)

	expect(createBlog.mock.calls).toHaveLength(1)
	console.log('mock calls', createBlog.mock.calls[0][0])
	expect(createBlog.mock.calls[0][0].title).toBe('testing title')
	expect(createBlog.mock.calls[0][0].author).toBe('testing author')
	expect(createBlog.mock.calls[0][0].url).toBe('testing url')
})
