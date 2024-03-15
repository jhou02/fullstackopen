import { useState, useEffect } from 'react'
import phonebookService from './services/phonebook'
import './index.css'

const Person = ({ person, deletePerson }) => {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${person.name}?`)) {
      deletePerson(person.id, person.name);
    }
  };
  return (
    <div>
      {person.name} {person.number} <button onClick={handleDelete}>delete</button>
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
          person={person}
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

const Notification = ({message, className}) => {
  if(message === null) {
    return null
  }
  
  return (<div className={className}>
    {message}
  </div>)
}


const App = () => {
  const [persons, setPersons] = useState([])
  const [filter, setFilter] = useState('')
  const [statusMessage, setStatusMessage] = useState(null)
  const [notifClass, setNotifClass] = useState("success")

  const hook = () => {
    console.log('effect')
    phonebookService.getPersons()
    .then(initialPersons => {
      console.log('promise fulfilled')
      setPersons(initialPersons)
    })
  }

  useEffect(hook, [])

  const addPerson = (person) => {
    const names = persons.map(person=>person.name)
    const containedName = names.indexOf(person.name)

    if(containedName != -1) {
      updatePerson(person)
      return
    }

    const newPerson = {...person}
    newPerson.id = `${persons.length+1}`
    console.log(newPerson)
    phonebookService.createPerson(newPerson)
      .then(returnedNote => {
        setStatusMessage(`Added ${newPerson.name}`)
        setTimeout(() => {
          setStatusMessage(null)
        }, 5000)
        setPersons(persons.concat(returnedNote))
      })
        
  }

  const deletePerson = (id, name) => {
    phonebookService
      .deletePerson(id)
      .then(() => 
        {
        setStatusMessage(`Deleted ${name}`)
        setTimeout(() => {
          setStatusMessage(null)
        }, 5000)
        setPersons(persons.filter(person => person.id !== id))
      })
  }

  const updatePerson = (person) => {
    if(window.confirm(`${person.name} is already added to the phonebook, replace the old number with a new one?`)) {
      const personObject = persons.find(n => n.name === person.name)
      const updatedPerson = {...personObject, number:`${person.number}`}
      phonebookService
        .updatePerson(personObject.id, updatedPerson)
        .then(returnedPerson => {
          setStatusMessage(`Updated ${returnedPerson.name}`)
          setTimeout(() => {
            setStatusMessage(null)
          }, 5000)
          setPersons((prevState) => {
            return prevState.map((person) =>
             person.id !== personObject.id ? person: returnedPerson)
          })
        })
        .catch(error => {
          setNotifClass("error")
          setStatusMessage(`Information of ${person.name} was already deleted from the server`)
          setTimeout(() => {
            setStatusMessage(null)
            setNotifClass("success")
          }, 5000)
          setPersons(persons.filter(p => p.id !== person.id))
        })
    }
  }

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)    
  }
  
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={statusMessage} className={notifClass}/>
        <div>
          <Filter filter={filter} handleFilter={handleFilterChange}/>
        <h2>add a new</h2>
          <PersonForm addPerson={addPerson} />
        <h2>Numbers</h2>
          <Persons persons={persons} filter={filter} deletePerson={deletePerson}/>
        </div>
    </div>
  )
}

export default App
