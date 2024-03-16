const express = require('express');
const bodyParser = require('body-parser');
const  {graphqlHTTP}  = require('express-graphql'); // Fix import statement
const mongoose = require('mongoose');

const grapphQlSchema = require('./graphql/schema/index');
const graphqlResolvers = require('./graphql/resolvers/index');

const isAuth = require('./middleware/is-auth');

const app = express();

app.use(bodyParser.json());

app.use(isAuth);

app.use(
    '/graphql', 
    graphqlHTTP({
        schema: grapphQlSchema,
    rootValue: graphqlResolvers,
    graphiql: true
})
);

//confirm DB connection and start server
mongoose.connect(
    'mongodb+srv://'
    + process.env.MONGO_USER +':' + process.env.MONGO_PASSWORD +
    '@cluster0.kb5x2bs.mongodb.net/'+ process.env.MONGO_DB +
    '?retryWrites=true&w=majority&appName=Cluster0')
    .then(()=>{        
        app.listen(3000);
        console.log("Connection to DB and server is done");
    }).catch(err => {
        console.log(err);
    });


