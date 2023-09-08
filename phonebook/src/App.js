import { useState,useEffect } from 'react'
import servicesVar from './services/services.js'

// COMPONENTS
const Filter = ({filterFn}) => {
  return(
    <>
      filter shown with: <input onChange={filterFn}/>
    </>
  )
}
const PersonForm = ({onSubmitFn,newName,changeNameFn,newNum,changeNumberFn}) => {
  return(
  <form onSubmit={onSubmitFn}>
    <div>
      name: <input value = {newName} onChange={changeNameFn} required/><br />
      number: <input value = {newNum} onChange={changeNumberFn} required/><br />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form >)
}
const Person = ({IsEmpty,displayListFn,filterListFn}) => {
  return IsEmpty ? displayListFn() : filterListFn() 
}
const Notification = ({message}) => {
  const taskCompletedStyles = {
    color : 'green',
    backgroundColor : 'silver',
    padding : '10px',
    fontSize : '30px',
    border : '3px solid green',
    margin : '10px 0',
    borderRadius: '10px'
  }
  const taskFailedStyles = {
    color : 'red',
    backgroundColor : 'silver',
    padding : '10px',
    fontSize : '30px',
    border : '3px solid red',
    margin : '10px 0',
    borderRadius: '10px'
  }
  const delRegex = new RegExp('deleted','gi')
  const validationRegex = new RegExp('validation','gi')

  if(message === '') return null
  else if (delRegex.test(message) || validationRegex.test(message)){
    return(
      <div style={taskFailedStyles} className='submission'>{message}</div>
    )
  }
  else{
    return(
      <div style={taskCompletedStyles} className='submission'>{message}</div>
    )
  }
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNum, setNewNum] = useState('')
  const [IsEmpty, setIsEmpty] = useState(true)
  const [filteredWords, setfilterWords] = useState('')
  const [notification,setNotification] = useState('')

  let isFound = false

  const fetchData = () => {
    servicesVar
    .fetch()
    .then(returnedValue =>{
      setPersons(returnedValue)
    })
  }
  useEffect(fetchData,[])

  const onSubmitFn = (e) => {
    e.preventDefault()
    isFound = false

    const newObj = {
      name : newName,
      number : newNum
    }

    // REPLACE OLD CONTACTS WITH NEW
    {
      persons.map(elem => {
        if(elem.name === newObj.name){
          if(window.confirm('Are you sure you wanna rewrite this number')){
            servicesVar
              .updateContact(elem.id, newName, newNum)
              .catch(error => {
                setNotification(error.response.data.error)
                setTimeout(() => setNotification('') ,5000)
                return
              })

            //NOTIFY THE SUBMISSION
            setNotification(`${newName} contact updated.`)
            setTimeout(() => setNotification('') ,3000)
            setTimeout(() => fetchData(),500) // to refresh results on screen after contact
          }
        }
      })
    }
    setPersons(persons)
    setNewName('')
    setNewNum('')

    // PREVENT USER FORM ENTERING THE SAME NAME TWICE
    {
      persons.map(elem => {
        if(newObj.name === elem.name){
          isFound = true
        }
      })
      if(isFound === true) return
    }
    
    // ADD DATA TO DATABASE & RENDERING PAGE
    {
    servicesVar
      .addData(newObj)
      .then(returnedValue => {
        setPersons(persons.concat(returnedValue))
        //NOTIFY THE SUBMISSION
        {
          setNotification(`${newName} is added to phonebook`)
          setTimeout(() => setNotification('') ,3000)
        }
        setNewName('')
        setNewNum('')
      })
      .catch(error => {
        console.log(error)
        setNotification(error.response.data.error)
        setTimeout(() => setNotification('') ,3000)
        return
      })
    }
  }

  const deleteFn = (id) => {
    if(window.confirm('Are you sure you want to delete this?')){
      servicesVar
      .deleteData(id)
      
      setPersons(persons.filter(elem => elem.id !== id))
      fetchData() // solution for data not rendering correctly sometimes, after deletion
    }
  }

  const changeNameFn = (e) => {
    setNewName(e.target.value)
  }

  const changeNumberFn = (e) => {
    setNewNum(e.target.value)
  }

  const filterFn = (e) => {
    let field = e.target.value
    setfilterWords(field)

    if(field !== '') setIsEmpty(false)
    else setIsEmpty(true)
  }

  const filterListFn = () => {
    let regex = new RegExp(`\\${filteredWords}`,'gi')
    
    return persons.map((elem,i) => {
      if(elem.name.match(regex) !== null){
        return(
          <div key={i}>{elem.name} {elem.number} <button key={i} onClick={() => deleteFn(persons[i].id)}>Delete</button> </div>
        )
      }
    })
  }

  const displayListFn = () => {
    return (
      persons.map((elem,i) => {
        return (
          <div key={i}>{elem.name} {elem.number} <button key={i}  onClick={() => deleteFn(persons[i].id)}>Delete</button> </div>
        )
      })
    )
  }

return (
  <div>
      <h2>Phonebook</h2>
      <Notification message={notification} />
      <Filter  filterFn={filterFn}/>
      <h3>add a new</h3>
      <PersonForm  onSubmitFn={onSubmitFn} newName={newName} changeNameFn={changeNameFn} newNum={newNum} changeNumberFn={changeNumberFn}/>
      <h3>Numbers</h3>
      <Person IsEmpty={IsEmpty} displayListFn={displayListFn} filterListFn={filterListFn}/>
    </div>
  )
}

export default App