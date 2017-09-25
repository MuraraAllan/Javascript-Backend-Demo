const {ObjectID} = require('mongodb');

const typeDefs = ` 

  type Cohort {
    id: ID!
    description: String!
    students: [Student!]                         
  }
  
  extend type Query {
    allCohorts: [Cohort]!
  }

  extend type Mutation {
    createCohort(description: String!, email: String): Cohort
  }
`;

resolvers = {
    Mutation: { 
      createCohort: async(root, data, {mongo: {Cohorts}}) => {
        const response = await Cohorts.insert(data);
        return Object.assign({id: response.insertedIds[0]}, data);
      },
    },
    Query: {
      allCohorts: async (root, data, {mongo: {Cohorts}}) => {
        return await Cohorts.find({}).toArray();
      },
    },
    Cohort: {
      id: root => root._id || root.id,
      students: async (root, data, {mongo: {Students}}) => {
        return await Students.find({cohortId: root._id}).toArray();
      },
    },
  };


module.exports = {
  typeDefs,
  resolvers,
}
