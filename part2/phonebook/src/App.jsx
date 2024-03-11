import { useState, useEffect } from 'react'
import axios from 'axios'

const Person = (props) => {
  return (
    <div>
      {props.name} {props.number}
    </div>
  )
}

const Persons = ({ persons, filter }) => {
  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
  return(
    <div>
        {filteredPersons.map(person => <Person 
          key={person.name} 
          name={person.name} 
          number={person.number}/>)}
      </div>
  )
}

const Filter = (props) => {
  return (
    <>
      <form>
      <div>filter shown with{' '}
        <input
          value={props.filter}
          onChange={props.handleFilter}
        /></div>
      </form>
    </>
  )
}

const PersonForm = (props) => {
  console.log('person form props: ', props)
  return (
    <form onSubmit={props.addPerson}>
    <div>
      name: <input 
      value={props.newName}
      onChange={props.handleNameChange}
      />
    </div>
    <div>
      number: <input
      value={props.newNumber}
      onChange={props.handleNumberChange}
      />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const hook = () => {
    console.log('effect')
    axios.get('http://localhost:3001/persons')
    .then(response => {
      console.log('promise fulfilled')
      setPersons(response.data)
    })
  }

  useEffect(hook, [])

  const addPerson = (event) => {
    event.preventDefault()
    const names = persons.map(person=>person.name)
    const numbers = persons.map(person=>person.number)
    const containedName = names.indexOf(newName)
    const containedNumber = numbers.indexOf(newNumber)
    if(containedName != -1) {
      alert(`${newName} is already added to phonebook`)
      return
    }
    if(containedNumber != -1) {
      alert(`${newNumber} is already assigned to a person`)
      return
    }
    const personObject = {
      name: newName,
      number: newNumber
    }

    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)    
  }
  
  return (
    <div>
      <h2>Phonebook</h2>
        <Filter filter={filter} handleFilter={handleFilterChange}/>
      <h2>add a new</h2>
        <PersonForm addPerson={addPerson} 
                    newName={newName} 
                    newNumber={newNumber} 
                    handleNameChange={handleNameChange} 
                    handleNumberChange={handleNumberChange}
        />

      <h2>Numbers</h2>
        <Persons persons={persons} filter={filter}/>
    </div>
  )
}

export default App
