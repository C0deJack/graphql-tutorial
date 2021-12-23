const graphql = require('graphql');
const _ = require('lodash');

const { 
	GraphQLObjectType, 
	GraphQLString, 
	GraphQLInt, 
	GraphQLID,
	GraphQLList,
	GraphQLSchema,
	GraphQLNonNull
} = graphql;

const Book = require('../models/book');
const Author = require('../models/author');


const BookType = new GraphQLObjectType({
	name: 'book',
	fields: () => ({
		id: { type: GraphQLString },
		name: { type: GraphQLString },
		genre: { type: GraphQLString },
		author: {
			type: AuthorType,
			resolve(parent, args) {
				// return _.find(authors, { id: parent.authorId }); // Test data.
				return Author.findById(parent.authorId)
			}
		}
	})
});

const AuthorType = new GraphQLObjectType({
	name: 'author',
	fields: () => ({
		id: { type: GraphQLString },
		name: { type: GraphQLString },
		age: { type: GraphQLInt },
		books: { 
			type: new GraphQLList(BookType),
			resolve(parent, args) {
				// return _.filter(books, {authorId: parent.id});
				return Book.find({authorId: parent.id})
			}

		}
	})
});


const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		book: { // Important: This name must match the query.
			type: BookType,
			args: { id: { type: GraphQLID }},  // GraphQL turns the id (int or a string) into a string.
			resolve(parent, args){
				// We have access now to args.id as defined above. 
				// Code to get data from db.

				// Use lodash to find the book from the test data.
				// return _.find(books, { id: args.id });

				return Book.findById(args.id);
			}
		},
		author: {
			type: AuthorType,
			args: { id: { type: GraphQLID }},
			resolve(parent, args){
				// return _.find(authors, { id: args.id });

				return Author.findById(args.id);
			}
		},
		books: {
			type: new GraphQLList(BookType),
			resolve(parent, args){
				// return books;

				return Book.find({}); // The empty object here means get all Books.
			}
		},
		authors: {
			type: new GraphQLList(AuthorType),
			resolve(parent, args){
				// return authors;

				return Author.find({});
			}
		}
	}
});

const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		addAuthor: {
			type: AuthorType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				age: { type: new GraphQLNonNull(GraphQLInt) }
			},
			resolve(parent, args){
				let author = new Author({   // This is the imported db model.
					name: args.name,
					age: args.age
				});
				return author.save(); // Mongoose save to db. The save method also returns the object just saved.
			}
		},
		addBook: {
			type: BookType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				genre: { type: new GraphQLNonNull(GraphQLString) },
				authorId: { type: new GraphQLNonNull(GraphQLID) }
			},
			resolve(parent, args){
				let book = new Book({
					name: args.name,
					genre: args.genre,
					authorId: args.authorId
				});
				return book.save();
			}
		}
	}
});


module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation
});
