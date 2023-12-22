import { useEffect, useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'

import { useApolloClient, useMutation, useQuery } from '@apollo/client'
import { ALL_AUTHORS, ALL_BOOKS, LOGIN, ME } from './queries'
import LoginForm from './components/LoginForm'
import Notify from './components/Notify'
import Recommend from './components/Recommend'

const App = () => {
  const [token, setToken] = useState(null)
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {

    const token = localStorage.getItem('library-user-token')
    token && setToken(token)

  }, [])

  const client = useApolloClient()

  const authorsResult = useQuery(ALL_AUTHORS)

  const booksResult = useQuery(ALL_BOOKS)

  const userResult = useQuery(ME)

  if (authorsResult.loading || booksResult.loading) {
    return <div>loading...</div>
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token && <button onClick={() => setPage('add')}>add book</button>}
        {token && <button onClick={() => setPage('recommend')}>recommend</button>}
        {!token && <button onClick={() => setPage('login')}>login</button>}
        {token && <button onClick={logout}>logout</button>}
      </div>

      <Authors show={page === 'authors'} authors={authorsResult.data.allAuthors} token={token} />

      <Books show={page === 'books'} books={booksResult.data.allBooks} />

      {token && <NewBook show={page === 'add'} setError={setErrorMessage} />}

      <Recommend show={page === 'recommend'} books={booksResult.data.allBooks.filter(book => book.genres.includes(userResult.data.me.favoriteGenre))} favorite={userResult.data.me.favoriteGenre} />

      <LoginForm show={page === 'login'} setError={setErrorMessage} setPage={setPage} setToken={setToken} />

    </div>
  )
}

export default App
