import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
query {
  allAuthors {
    name
    born
    bookCount
    id
  }
}
`

export const ALL_BOOKS = gql`
query {
  allBooks {
    title
    author {
      born
      name
    }
    published
    genres
  }
}
`

export const CREATE_BOOK = gql`
mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
  addBook(
    title: $title,
    author: $author,
    published: $published,
    genres: $genres
  ) {
    title
    author {
      name
    }
    id
    published
    genres
  }
}
`
export const UPDATE_AUTHOR = gql`
mutation editAuthor($name: String!, $setBornTo: Int) {
  editAuthor(
    name: $name,
    setBornTo: $setBornTo,
  ) {
    name
    born
    bookCount
    id
  }
}
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

export const ME = gql`
query {
  me {
    favoriteGenre
    username
  }
}
`

export const FILTERED_BOOKS = gql`
query BooksByGenre($genre: String!) {
  allBooks(genre: $genre) {
    title
    author {
      born
      name
    }
    published
    genres
  }
}
`
