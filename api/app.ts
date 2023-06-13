import {ApolloServer} from '@apollo/server';
import {expressMiddleware} from '@apollo/server/express4';
import {ApolloServerPluginDrainHttpServer} from '@apollo/server/plugin/drainHttpServer';
import {typeDefs, resolvers} from './schema';
import http, {Server} from 'http';
import express, {Express} from 'express';
import cors, {CorsRequest} from 'cors';
import {driver, auth, Driver} from 'neo4j-driver';
import {makeExecutableSchema} from '@graphql-tools/schema';
import dotenv from 'dotenv';
import {json} from 'body-parser';
import {GraphQLSchema} from "graphql/type";

dotenv.config()
const app: Express = express();
app.use(cors)
app.use(express.json())
const httpServer: Server = http.createServer(app)

// Neo4j Aura database configuration
const neo4jUri: string = process.env.NEO4J_URI!;
const neo4jUser: string = process.env.NEO4J_USER!;
const neo4jPassword: string = process.env.NEO4J_PASSWORD!;

// Create a Neo4j driver instance
const neo4j_driver: Driver = driver(neo4jUri, auth.basic(neo4jUser, neo4jPassword));

// Create an executable GraphQL schema
const schema: GraphQLSchema = makeExecutableSchema({typeDefs, resolvers });

// Starts GraphQL Server Instance
const startApolloServer = async(app: Express, httpServer: Server): Promise<void> => {
    const server: ApolloServer = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({httpServer})],
    });
    await server.start()
    app.use(
        '/graphql',
        cors<CorsRequest>(),
        json(),
        expressMiddleware(server, {})
    )
}

startApolloServer(app, httpServer);
export default httpServer;