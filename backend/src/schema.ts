export const typeDefs = `#graphql
  type Release {
    id: ID!
    name: String!
    date: String!
    status: String!
    additionalInfo: String
    steps: [Boolean!]!
    createdAt: String!
  }

  type Query {
    releases: [Release!]!
    release(id: ID!): Release
  }

  type Mutation {
    createRelease(name: String!, date: String!, additionalInfo: String): Release!
    updateSteps(id: ID!, steps: [Boolean!]!): Release!
    updateAdditionalInfo(id: ID!, additionalInfo: String!): Release!
    deleteRelease(id: ID!): Boolean!
  }
`;
