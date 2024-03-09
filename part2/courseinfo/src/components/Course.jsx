const Header = ({ course }) => <h1>{course}</h1>

const Total = ({ sum }) => <strong>total of {sum} exercises</strong>

const Part = (props) => 
  <p>
    {props.name} {props.exercises}
  </p>

const Content = ({ parts }) => {
  return (
    <>
      {parts.map((part, i) =>
        <Part key={i} name={part.name} exercises={part.exercises} />
        )}
    </>
  )
}

const Course = (props) => {
  console.log("props are", props)
  const exerciseArr = props.parts.map(part => part.exercises)
  const sum = exerciseArr.reduce((s, p) => s + p)
  console.log("sum is", sum)
  return (
    <div>
      <Header course={props.name}/>
      <Content parts={props.parts}/>
      <Total sum={sum}/>
    </div>
  )
}

export default Course