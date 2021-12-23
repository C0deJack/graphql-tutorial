const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb+srv://C0deJack:tutorial_gql98675322567@cluster0.2qm8y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');

mongoose.connection.once('open', () => {
	console.log('connected to DB');


})

app.use('/graphql', graphqlHTTP({
	schema, // GraphQL Schema. Not to be confused with the db schemas found in models folder.
	graphiql: true
}));

const port = 4000;

app.listen(port, () => {
	console.log(`now listening for requests on port ${port}`);
});