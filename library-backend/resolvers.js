const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const jwt = require('jsonwebtoken')

const { GraphQLError } = require('graphql')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const resolvers = {
    Query: {
        authorCount: async () => Author.collection.countDocuments(),
        bookCount: async () => Book.collection.countDocuments(),
        allBooks: async (root, args) => {
            if (args.genre) {
                const result = await Book.find({ genres: args.genre }).populate('author')
                console.log(result)
                return result
            }
            return Book.find({}).populate('author')
        },
        allAuthors: async () => {
            let authors = Author.find({}).populate('writtenBooks')

            authors.bookCount = authors.writtenBooks.length

            return authors
        },
        me: async (root, args, context) => context.currentUser
    },
    Mutation: {
        addBook: async (root, args, { currentUser }) => {
            const { author, ...rest } = args

            if (!currentUser) {
                throw new GraphQLError('not authenticated', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    }
                })
            }

            const authorObj = await Author.findOne({ name: author }) || await new Author({ name: author }).save()

            const book = new Book({ ...args, author: authorObj })
            try {
                await book.save()
            } catch (error) {
                throw new GraphQLError('Saving book failed', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args.title,
                        error
                    }
                })
            }

            pubsub.publish('BOOK_ADDED', { bookAdded: book })

            return book
        },
        editAuthor: async (root, args, { currentUser }) => {

            if (!currentUser) {
                throw new GraphQLError('not authenticated', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    }
                })
            }

            const authorToEdit = await Author.findOne({ name: args.name })
            const authorBooks = (await Book.find({ author: authorToEdit })).length

            if (authorToEdit) {
                authorToEdit.born = args.setBornTo
                authorToEdit.save()
                authorToEdit.bookCount = authorBooks
                return authorToEdit
            }
            return null

        },
        createUser: async (root, args) => {
            const user = new User({ ...args })

            try {
                user.save()
            } catch (error) {
                throw new GraphQLError('Creating user failed', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args.username,
                        error
                    }
                })
            }
            return user
        },
        login: async (root, args) => {
            const user = await User.findOne({ username: args.username })

            if (!user || args.password !== 'secret') {
                throw new GraphQLError('wrong credentials', {
                    extensions: {
                        code: 'BAD_USER_INPUT'
                    }
                })
            }

            const userForToken = {
                username: user.username,
                id: user._id,
            }

            return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
        }
    },
    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
        },
    },
}

module.exports = resolvers