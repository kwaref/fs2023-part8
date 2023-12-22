import { useEffect, useState } from "react"
import { useBooksByGenre } from "../hooks/useBooksByGenre"

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
  const [genre, setGenre] = useState('')
  const { loading, error, filteredBooks } = useBooksByGenre(genre)


  useEffect(() => {
    if (books) {
      setGenres(getGenres(books))
    }
  }, [books])

  if (!props.show) {
    return null
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
          {filteredBooks && filteredBooks.map((a) => (
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
          genres.map(genre => <button key={genre} name={genre} onClick={() => setGenre(genre)}>{genre}</button>)
        }
        <button onClick={() => setGenre('')}>all genres</button>
      </div>
    </div>
  )
}

export default Books
