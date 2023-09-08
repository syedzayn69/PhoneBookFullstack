import axios from 'axios'
const url = '/api/persons'

const fetch = () => {
    const returnedValue = axios
    .get(url)
    .then(response => response.data)
    return returnedValue
}

const addData = (newObj) => {
    const returnedValue = axios
    .post(url,newObj)
    .then(response => response.data)
    return returnedValue
} 

const deleteData = (id)  => {
    axios
    .delete(`${url}/${id}`)
    .catch(error => {
        alert('This contact is already deleted!')
    })
}

const updateContact = (id, name, number) => {
    const newObj = {
        name : name,
        number : number
    }
    return(
        axios
        .put(`${url}/${id}`,newObj)
    )
}

export default { fetch, addData, deleteData, updateContact }