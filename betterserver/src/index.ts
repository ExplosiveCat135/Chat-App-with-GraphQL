import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema } from "type-graphql";
import cors from "cors";
import dotenv from "dotenv";
import { ChatResolver } from "./resolvers/chat";

dotenv.config();

const main = async () => {
  

  const app = express();

    app.use(cors({ origin: "http://localhost:3000", credentials: true }));
    const server = new ApolloServer({
      schema: await buildSchema({

        resolvers: [ChatResolver],
        validate: false,
      }),

    });
    await server.start()
    server.applyMiddleware({
      app,
      cors: true,
    });

    app.listen(8080, () => {
      console.log(
        `Server ready at http://localhost:8080${server.graphqlPath}`
      );
    });
  // async function startApolloServer() {
    
    
  // }
  // const apolloServer = new ApolloServer({
  //   schema: await buildSchema({
  //     resolvers: [ChatResolver],
  //     validate: false,
  //   }),
  // });
};

main().catch((err) => {
  console.log(err);
});