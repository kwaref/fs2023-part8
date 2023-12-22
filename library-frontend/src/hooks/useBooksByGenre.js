import { useQuery } from "@apollo/client";
import { FILTERED_BOOKS } from "../queries";

export function useBooksByGenre(genre) {

    const { loading, error, data } = useQuery(FILTERED_BOOKS, {
        variables: { genre },
        fetchPolicy: 'no-cache'
    })

    if (loading || error) {
        return { loading, error, books: null }
    }

    return { loading, error, filteredBooks: data.allBooks }
}