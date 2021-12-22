const graphql = require('graphql');
const _ = require('lodash');

const { GraphQLObjectType, GraphQLString, GraphQLSchema } = graphql;

// Test data
var books = [
	{ name: 'Name of the Wind', genre: 'Fantasy', id: "1"},
	{ name: 'The Final Empire', genre: 'Fantasy', id: "2"},
	{ name: 'The Long Earth', genre: 'Sci-Fi', id: "3"},
];


const BookType = new GraphQLObjectType({
	name: 'book',
	fields: () => ({
		id: { type: GraphQLString },
		name: { type: GraphQLString },
		genre: { type: GraphQLString }
	})
});


const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		book: { // Important: This name must match the query.
			type: BookType,
			args: { id: { type: GraphQLString }},
			resolve(parent, args){
				// We have access now to args.id as defined above. 
				// Code to get data from db.

				// Use lodash to find the book from the test data.
				return _.find(books, { id: args.id });
			}
		}
	}
});


module.exports = new GraphQLSchema({
	query: RootQuery
});
