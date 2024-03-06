import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const Statistics = (props) => {
  if(props.values[3] == 0) {
    return(
      <div>No feedback given</div>
    )
  }
  return (
    <table>
      <tbody>
      <StatisticLine text="good" value={props.values[0]}/>
      <StatisticLine text="neutral" value={props.values[1]}/>
      <StatisticLine text="bad" value={props.values[2]}/>
      <StatisticLine text="all" value={props.values[3]}/>
      <StatisticLine text="average" value={(props.values[0]-props.values[2])/props.values[3]}/>
      <StatisticLine text="positive" value={props.values[0]/props.values[3] * 100 + " %"}/>
      </tbody>
    </table>
  )
}

const StatisticLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  )
}


const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const total = good + neutral + bad

  const handleGoodClick = () => {
    setGood(good+1)
  }

  const handleNeutralClick = () => {
    setNeutral(neutral+1)
  }

  const handleBadClick = () => {
    setBad(bad+1)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <div></div>
      <Button handleClick={handleGoodClick} text="good"/>
      <Button handleClick={handleNeutralClick} text="neutral"/>
      <Button handleClick={handleBadClick} text="bad"/>
      <h1>statistics</h1>
      <Statistics values={[good, neutral, bad, total]}/>

    </div>
  )
}

export default App
