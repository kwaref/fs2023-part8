import { useEffect, useState } from "react"

function getGenres(books) {
  const uniqueGenres = books.reduce((acc, book) => {
    const bookGenresSet = new Set(book.genres)

    bookGenresSet.forEach(genre => {
      acc.add(genre)
    })

    return acc
  }, new Set())

  return Array.from(uniqueGenres)
}

const Books = (props) => {

  const books = props.books

  const [genres, setGenres] = useState([])
  const [filteredBooks, setFilteredBooks] = useState(books)

  useEffect(() => {
    if (books) {
      setGenres(getGenres(books))
    }
  }, [books])

  if (!props.show) {
    return null
  }

  const filter = (evt) => {
    const filtered = books.filter(book => book.genres.includes(evt.target.name))
    setFilteredBooks(filtered)
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {
          genres.map(genre => <button key={genre} name={genre} onClick={filter}>{genre}</button>)
        }
        <button onClick={() => setFilteredBooks(books)}>all genres</button>
      </div>
    </div>
  )
}

export default Books
