const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
 type User {
   id: ID!
   name: String!
 }

 type Query {
   users: [User]
   user(id: ID!): User
 }
`;

let users = [
 { id: "1", name: "Ana" },
 { id: "2", name: "Luis" }
];

const resolvers = {
 Query: {
   users: () => users,
   user: (_, { id }) => users.find(u => u.id === id)
 }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: 4001 }).then(({ url }) => {
 console.log(`User Service listo en ${url}`);
});
