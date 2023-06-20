import {ApolloServer} from "@apollo/server";
import {startStandaloneServer} from "@apollo/server/standalone";
import {Neo4jGraphQL} from "@neo4j/graphql";
import neo4j from "neo4j-driver";
import {config} from 'dotenv';
import {readFileSync} from 'fs';
import {fileURLToPath} from "url";
import {dirname, join} from 'path';
import {resolvers} from "./resolvers.js";

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


const server = new ApolloServer({
    schema: await neoSchema.getSchema(),
    resolvers: resolvers
});

const { url } = await startStandaloneServer(server, {
    context: async (request: any) => ({request}),
    listen: { port: 4000 },
});

console.log(`🚀 Server ready at ${url}`);