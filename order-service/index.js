const { ApolloServer, gql } = require('apollo-server');
const axios = require('axios');

let orders = [
  {id: "1", userId: "1", productId:"1", productName: "Pizza"},
  {id: "2", userId: "1", productId:"2", productName: "Tacos"},
  {id: "3", userId: "2", productId:"1", productName: "Pizza"},
];

const typeDefs = gql`
  type Order {
    id: ID!
    userId: ID!
    productId: ID!
    productName: String
  }

 type Query {
   orders: [Order]
 }

  type Mutation {
    createOrder(userId: ID!, productId: ID!): Order
  }
`;

let orders = [];

const resolvers = {
 Query: {
   orders: async () => {

     // Consultar usuarios desde otro microservicio
     const response = await axios.post('http://localhost:4001/', {
       query: `
         query {
           users {
             id
             name
           }
         }
       `
     });

     const users = response.data.data.users;

     //  Combinar datos
     return orders.map(order => {
       const user = users.find(u => u.id === order.userId);
       return {
         ...order,
         userName: user ? user.name : null
       };
     });
   }
 },

  Mutation: {
    createOrder: async (_, { userId, productId }) => {
      // Validar usuario (GraphQL)
      const userResponse = await axios.post('http://localhost:4001/', {
        query: `
          query {
            user(id: "${userId}") {
              id
              name
            }
          }
        `
      });

      const user = userResponse.data.data.user;

      if (!user) {
        throw new Error("Usuario no existe");
      }

      //  Obtener producto (API REST)
      const productResponse = await axios.get(
        `http://localhost:3001/products/${productId}`
      );

      const product = productResponse.data;

      //  Procesar pago (API REST)
      const paymentResponse = await axios.post(
        'http://localhost:3002/pay',
        { amount: product.price }
      );

      if (paymentResponse.data.status !== "success") {
        throw new Error("Error en el pago");
      }

      //  Crear orden
      const newOrder = {
        id: (orders.length + 1).toString(),
        userId,
        productId,
        productName: product.name
      };

      orders.push(newOrder);
      return newOrder;
    }
  }

};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: 4002 }).then(({ url }) => {
 console.log(`Order Service listo en ${url}`);
});
