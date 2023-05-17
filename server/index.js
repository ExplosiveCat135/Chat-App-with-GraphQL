const { createServer } = require("http")
const { createYoga, createPubSub } = require("graphql-yoga")
const pubsub = createPubSub()
const typeDefs = `
  type Message {
    id: ID!
    user: String!
    text: String!
  }
  type Query {
    messages: [Message!]
  }
  type Mutation {
    postMessage(user: String!, text: String!): ID!
  }
  type Subscription {
    messages: [Message!]
  }
`;

const messages = [];
const subscribers = [];
const onMessagesUpdates = (fn) => subscribers.push(fn);

const resolvers = {
    Query: {
        messages: () => messages,
    },
    Mutation: {
        postMessage: (parent, {user, text}) => {
            const id = messages.length;
            messages.push({id, user, text});
            subscribers.forEach((fn) => fn());
            return id;
        },
    },
    Subscription: {
        messages: {
            subscribe: (parent, args, { pubsub }) => {
                const channel = Math.random().toString(36).slice(2, 15);
                onMessagesUpdates(() => pubsub.publish(channel, { messages }), 0)
                return pubsub.asyncIterator(channel)
            }
        }
    }
}

const server = createServer(createYoga({ typeDefs, resolvers, context: { pubsub }, graphqlEndpoint: "/", landingPage:false }));
server.listen(4000, "127.0.0.1");