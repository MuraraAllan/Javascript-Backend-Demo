//global resolver functions
require('./functions');
const {makeExecutableSchema} = require('graphql-tools');
const merge = require('lodash').merge;
const Person = require('./Person');
const Cohort = require('./Cohort');
const Poll = require('./Polling');
const Question = require('./Questions/');
const pollResolvers = Poll.resolvers;
const rootResolvers = require('./resolvers');
const teacherResolvers = Person.resolvers.studentResolvers;
const studentResolvers = Person.resolvers.teacherResolvers;
const cohortResolvers = Cohort.resolvers;
const questionResolvers = Question.resolvers;
const resolvers = merge(rootResolvers,studentResolvers, teacherResolvers, cohortResolvers, pollResolvers, questionResolvers);
const typeDefs = `
  
  
  type Sprint {
    id: ID!
    description: String!
  }
  
  type Topic {
    id: ID!
    description: String!
    sprint: Sprint
    cohort: Cohort
    teacher: Teacher!
    type: String
  }
  
  type Project {
    id: ID!
    description: String!
    githuburl: String!
    topic: Topic!
    solution: [Solution]
    type: String!
  }
   
  type Lecture {
    id: ID!
    description: String!
    topic: Topic!
  }
  
  type Solution {
    id: ID!
    description: String!
    githuburl: String!
    project: Project
  }
 
  type Video {
    id: ID!
    url: String!
    description: String!
    project : Project 
    lecture: Lecture
    solution: Solution
    topic: Topic
  }
  
  
  input AuthProviderSignupData {
      email: AUTH_PROVIDER_EMAIL!
  }
  
  input AUTH_PROVIDER_EMAIL {
      email: String!
      password: String!
  }
 
  type SigninPayload {
    token: String
    student: Student
  }
  
  type Mutation {
    createSprint(description: String!): Sprint!
    createProject(description: String!, type:String,  topicId: String!, githubUrl: String!): Project!
    createTopic(description: String!, cohortId:String!, type: String, teacherId:String!, sprintId: String): Topic!
    createLecture(description: String! topicId: String!): Lecture!
    createSolution(description: String!,githubUrl: String!, projectId: String!) : Solution!
    createVideo(url: String!, description: String!, projectId: String, lectureId: String, solutionId: String, topicId: String): Video!
    signinStudent(email: AUTH_PROVIDER_EMAIL): SigninPayload! 
  }
  
  type Query {
    allSprints: [Sprint!]!
    allProjects: [Project!]!
    allTopics: [Topic!]!
    allLectures: [Lecture!]!
    allSolutions: [Solution!]!
    allVideos: [Video!]!
    allAnswers: [Question!]!
  }

  type Subscription {
    Sprint(filter: SubscriptionFilter): LinkSubscriptionPayload
    Question(filter: SubscriptionFilter): QuerySubscriptionPayload 
    Student(filter: SubscriptionFilter): StudentSubscriptionPayload
  }

  input SubscriptionFilter {
    mutation_in: [_ModelMutationType!]
  }

  type StudentSubscriptionPayload {
    mutation: _ModelMutationType!
    node: Student
  }

  type LinkSubscriptionPayload {
    mutation: _ModelMutationType!
    node: Sprint
  }

  type QuerySubscriptionPayload {
    mutation: _ModelMutationType!
   node: Question
  }

  enum _ModelMutationType {
    CREATED
    UPDATED
    ANSWERED
  }
`;

module.exports = makeExecutableSchema({typeDefs: [typeDefs,Question.typeDefs, Person.typeDefs, Cohort.typeDefs, Poll.typeDefs],resolvers});

