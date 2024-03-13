import { useState, useEffect } from 'react'
import phonebookService from './services/phonebook'

const Person = (props) => {
  return (
    <div>
      {props.name} {props.number} <button>delete</button>
    </div>
  )
}

const Persons = ({ persons, filter, deletePerson }) => {
  console.log('persons list:', persons)
  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
  return(
    <div>
        {filteredPersons.map(person => <Person 
          key={person.name} 
          name={person.name} 
          number={person.number}
          deletePerson={deletePerson}
        /> )}
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
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const personObject = {
      name: newName,
      number: newNumber
    }
  const handleSubmit = (event) => {
    event.preventDefault()
    props.addPerson(personObject)
    setNewName('')
    setNewNumber('')
  }

  console.log('person form props: ', props)
  return (
    <form onSubmit={handleSubmit}>
    <div>
      name: <input 
      value={newName}
      onChange={handleNameChange}
      />
    </div>
    <div>
      number: <input
      value={newNumber}
      onChange={handleNumberChange}
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
  const [filter, setFilter] = useState('')

  const hook = () => {
    console.log('effect')
    phonebookService.getAll()
    .then(initialPersons => {
      console.log('promise fulfilled')
      setPersons(initialPersons)
    })
  }

  useEffect(hook, [])

  const addPerson = (person) => {
    const names = persons.map(person=>person.name)
    const numbers = persons.map(person=>person.number)
    const containedName = names.indexOf(person.name)
    const containedNumber = numbers.indexOf(person.number)
    if(containedName != -1) {
      alert(`${person.name} is already added to phonebook`)
      return
    }
    if(containedNumber != -1) {
      alert(`${person.number} is already assigned to a person`)
      return
    }

    phonebookService.createPerson({...person, id:persons.length+1})
      .then(returnedNote => {
        setPersons(persons.concat(returnedNote))
      })
        
  }

  const deletePerson = (name) => {
    if(window.confirm(`Are you sure you want to delete ${name}`)) {
      const personObject = persons.find((person) => person.name === name)
      phonebookService
        .deletePerson(personObject.id, personObject)
        .then(console.log('deleted ', name))
    }
    
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
        <PersonForm addPerson={addPerson} />
      <h2>Numbers</h2>
        <Persons persons={persons} filter={filter} deletePerson={deletePerson}/>
    </div>
  )
}

export default App
