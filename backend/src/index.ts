import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import dotenv from 'dotenv';
import { json } from 'body-parser';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({
  origin: [process.env.FRONTEND_URL || '*', 'https://khizarq313.github.io'],
  credentials: true
}));
app.use(json());

// Health check and root route
app.get('/', (req, res) => {
  res.send('Release Flow API is running. GraphQL endpoint is at /graphql');
});

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true, // Enable for debugging in production
  });

  await server.start();

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => {
        // Log query name if available for debugging
        if (req.body?.operationName) {
          console.log(`[GraphQL] ${req.body.operationName}`);
        }
        return {};
      },
    })
  );

  app.listen(port, () => {
    console.log(`Server ready at http://localhost:${port}/graphql`);
  });
}

startServer().catch(err => console.error(err));
