import {ApolloServer} from "@apollo/server";
import {Neo4jGraphQL} from "@neo4j/graphql";
import cors from "cors";
import express from "express";
import neo4j from "neo4j-driver";
import {config} from 'dotenv';
import {readFileSync} from 'fs';
import {fileURLToPath} from "url";
import {dirname, join} from 'path';
import {resolvers} from "./resolvers.js";
import {expressMiddleware} from "@apollo/server/express4";
import http from "http";
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import pkg from 'body-parser';

const { json } = pkg;
config();

// Read Schema for Type Definitions
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const typeDefs: string = readFileSync(join(__dirname, '../src/schema.graphql'), 'utf8');

// Create Neo4j Connection Driver with Credentials
const driver = neo4j.driver(
    process.env.NEO4J_URI as string,
    neo4j.auth.basic(process.env.NEO4J_USER as string,
        process.env.NEO4J_PASSWORD as string)
);
const neoSchema = new Neo4jGraphQL({typeDefs, driver});

const main = async () => {
    const app = express();
    const httpServer = http.createServer(app);
    const server = new ApolloServer({
        schema: await neoSchema.getSchema(),
        resolvers: resolvers,
        introspection: true,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
    });
    await server.start();
    app.use('/graphql',
        cors<cors.CorsRequest>(),
        json(),
        expressMiddleware(server)
        );
    app.listen(8080, () => {
        console.log('Server running at http://localhost:8080/graphql');
    });
};

await main();