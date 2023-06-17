import {ApolloServer} from '@apollo/server'
import {readFileSync} from 'fs'
import {resolve} from 'path'
import {resolvers} from './resolvers/resolvers'
import {startStandaloneServer} from "@apollo/server/standalone";
import dotenv from 'dotenv'

dotenv.config();
type ApolloContext = {};
const GRAPHQL_SCHEMA_PATH = resolve(__dirname, './models/schema.graphql');
const typeDefs = readFileSync(GRAPHQL_SCHEMA_PATH, {encoding: 'utf-8'});
const server = new ApolloServer<ApolloContext>({
    typeDefs,
    resolvers
});

startStandaloneServer(server, {
    listen: {port:4000},
}).then((result) => {
    console.log(`Server ready at ${result.url}`);
});