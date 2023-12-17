import { useState } from 'react'
import Select from 'react-select'
import { UPDATE_AUTHOR } from '../queries'
import { useMutation } from '@apollo/client'

const Authors = (props) => {
  const [born, setBorn] = useState('')
  const [name, setName] = useState('')

  const [editAuthor] = useMutation(UPDATE_AUTHOR)

  const handleSubmit = (e) => {
    e.preventDefault()

    console.log(name, born)

    editAuthor({ variables: { name, setBornTo: born } })
  }

  if (!props.show) {
    return null
  }
  const authors = props.authors || []

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Set birth year</h3>
      <form onSubmit={handleSubmit}>
        <Select onChange={(e) => setName(e.value)} options={authors.map(author => ({ value: author.name, label: author.name }))} />
        <div>
          born: <input type='number' onChange={(e) => setBorn(Number(e.target.value))} />
        </div>
        <div>
          <input type='submit' value={'update author'} />
        </div>
      </form>
    </div>
  )
}

export default Authors
