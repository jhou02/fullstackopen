import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, createAnectdote, updateAnecdote } from './requests'
import { useReducer } from 'react'

const messageReducer = (message, action) => {
	switch (action.type) {
		case 'ADD': {
			return `anecdote '${action.anecdote.content}' added`
		}
		case 'VOTE': {
			return `anecdote '${action.anecdote.content} voted`
		}
		case 'RESET': {
			return ''
		}
		case 'ERROR': {
			return 'too short anecdote, must have length 5 or more'
		}
		default:
			return message
	}
}

const App = () => {
	const [message, dispatch] = useReducer(messageReducer, '')

	const queryClient = useQueryClient()
	const result = useQuery({
		queryKey: ['anecdotes'],
		queryFn: getAnecdotes,
		retry: 1,
	})
	console.log(JSON.parse(JSON.stringify(result)))

	const newAnecdoteMutation = useMutation({
		mutationFn: createAnectdote,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['anecdotes'],
			})
		},
		onError: () => {
			dispatch({
				type: 'ERROR',
			})
			setTimeout(() => {
				dispatch({
					type: 'RESET',
				})
			}, 5000)
		},
	})

	const updateAnecdoteMutation = useMutation({
		mutationFn: updateAnecdote,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
		},
	})

	const handleVote = (anecdote) => {
		const updatedAnecdote = {
			...anecdote,
			votes: anecdote.votes + 1,
		}
		updateAnecdoteMutation.mutate(updatedAnecdote)
		dispatch({
			type: 'VOTE',
			anecdote: updatedAnecdote,
		})
		setTimeout(() => {
			dispatch({
				type: 'RESET',
			})
		}, 5000)
	}

	const addAnecdote = (content) => {
		const newAnecdote = { content, votes: 0 }
		newAnecdoteMutation.mutate(newAnecdote)
		dispatch({
			type: 'ADD',
			anecdote: newAnecdote,
		})
		setTimeout(() => {
			dispatch({
				type: 'RESET',
			})
		}, 5000)
	}

	if (result.isLoading) {
		return <div>loading data...</div>
	}

	if (result.isError) {
		return (
			<div>anecdote service not available due to problems in server</div>
		)
	}

	const anecdotes = result.data

	return (
		<div>
			<h3>Anecdote app</h3>

			<Notification message={message} />
			<AnecdoteForm addAnecdote={addAnecdote} />

			{anecdotes.map((anecdote) => (
				<div key={anecdote.id}>
					<div>{anecdote.content}</div>
					<div>
						has {anecdote.votes}
						<button onClick={() => handleVote(anecdote)}>
							vote
						</button>
					</div>
				</div>
			))}
		</div>
	)
}

export default App
