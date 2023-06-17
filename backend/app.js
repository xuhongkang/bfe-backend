"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const fs_1 = require("fs");
const path_1 = require("path");
const resolvers_1 = require("./resolvers/resolvers");
const standalone_1 = require("@apollo/server/standalone");
const GRAPHQL_SCHEMA_PATH = (0, path_1.resolve)(__dirname, './models/schema.graphql');
const typeDefs = (0, fs_1.readFileSync)(GRAPHQL_SCHEMA_PATH, { encoding: 'utf-8' });
const server = new server_1.ApolloServer({
    typeDefs,
    resolvers: resolvers_1.resolvers
});
(0, standalone_1.startStandaloneServer)(server, {
    listen: { port: 4000 },
}).then((result) => {
    console.log(`Server ready at ${result.url}`);
});
