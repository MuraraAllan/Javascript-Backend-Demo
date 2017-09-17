const {makeExecutableSchema} = require('graphql-tools');
const merge = require('lodash').merge;
const Person = require('./Person');
const Cohort = require('./Cohort');
const Poll = require('./Polling');
const Question = require('./Questions/');
const pollResolvers = Poll.resolvers;
const teacherResolvers = Person.resolvers.studentResolvers;
const studentResolvers = Person.resolvers.teacherResolvers;
const cohortResolvers = Cohort.resolvers;
const questionResolvers = Question.resolvers;
const resolvers = merge(studentResolvers, teacherResolvers, cohortResolvers, pollResolvers, questionResolvers);
  

module.exports = makeExecutableSchema({typeDefs: [Question.typeDefs, Person.typeDefs, Cohort.typeDefs, Poll.typeDefs], resolvers});

