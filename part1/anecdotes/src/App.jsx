import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const Anecdote = (props) => {
  return (
    <div>
      <div>{props.text}</div>
      <div>has {props.votes}</div>
    </div>
  )
}

const Popular = (props) => {
  const votes = [...props.votes]
  const anecdotes = [...props.anecdotes]
  const mostVotes = Math.max(...votes)
  const index = votes.indexOf(mostVotes)
  console.log("index is", index)
  const popular = anecdotes[index]
  console.log("most popular is", popular)

  return(
    <div>
      <div>{popular}</div>
      <div>has {mostVotes} votes</div>
    </div>

  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(8).fill(0))

  const randomizeSelected = () => {
    let random = Math.floor(Math.random() * anecdotes.length)
    while (random == selected) {
      random = Math.floor(Math.random() * anecdotes.length)
    }
    setSelected(random)
  }
  const handleVotes = () => {
    const copy = [...votes]
    copy[selected] += 1
    setVotes(copy)
  }

  return (
    <div>
      <h2>Anecdote of the day</h2>
      <Anecdote text={anecdotes[selected]} votes={votes[selected]}/>
      <Button handleClick={handleVotes} text="vote"/>
      <Button handleClick={randomizeSelected} text="next anecdote"/>
      <h2>Anecdote with most votes</h2>
      <Popular votes={votes} anecdotes={anecdotes}/>
    </div>
  )
}

export default App
