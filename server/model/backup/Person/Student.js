const authorization = require('../authorization');
const { ObjectID } = require('mongodb');
const typeDefs = ` 

  type Student {
    id: ID!
    name: String!
    reputation: Int!                         
    cohort: Cohort!
  }
  
  extend type Query {
    allStudents: [Student]!
  }

  extend type Mutation {
    createStudent(name: String!, cohortId: String, email: String): Student
  }
`;

resolvers = {
  Mutation: { 
    createStudent: async(root, data, {mongo: {Students}}) => {
      await authorization({user, authLevel: global.teacherLevel}); 
      data.cohortId = new ObjectID(data.cohortId);
      const response = await Students.insert(data);
      return Object.assign({id: response.insertedIds[0]}, data);
    },
  },
  Query: {
    allStudents: async (root, data, {mongo: {Students}, user}) => {
      await authorization({user, authLevel: global.teacherLevel})
      return await Students.find({}).toArray();
    },
  },
   
  Student: {
    id: root => root._id || root.id,
    cohort: async ({cohortId}, data, {mongo: {Cohorts}}) => {
      await authorization({user, authLevel: global.studentLevel})
      return await Cohorts.findOne({_id: cohortId});
    },
  },
};


module.exports = {
  typeDefs,
  resolvers,
}
