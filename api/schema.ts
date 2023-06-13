// GraphQL schema definition
const typeDefs: string = `
    scalar Decimal
    scalar DateTime

    type User {
        id: ID!
        username: String!
        avatarID: ID!
        createdAt: DateTime!
        lastLoginAt: DateTime!
        modifiedAt: DateTime!
    }
    
    type Group {
        id: ID!
        name: String!
        users: [User!]!
        createdAt: DateTime!
        createdBy: User!
    }
    
    type Contract {
        id: ID!
        description: String!
        receiptID: ID
        createdAt: DateTime!
        createdBy: User!
    }

    type Query {
        getUserAffiliatedGroups(userID: ID!) : [Group]
        getUserAffiliatedContractsInGroup(userID: ID!, groupID: ID!) : [Contract]
    }
  
    type Mutation {
        createUser(username: String!, avatarID: ID!) : User!
        createGroup(name: String!, members:[ID!]!) : Group!
        updateUserOnLogin(userID: ID!) : User
        updateUserUsername(username: String!) : User
        updateUserAvatarID(avatarID: ID!): User
        addUserToGroup(userID: ID!, groupID:ID!): Group
    }
`;

// GraphQL resolvers
const resolvers = {
    Query: {
    },
};

export {typeDefs, resolvers}