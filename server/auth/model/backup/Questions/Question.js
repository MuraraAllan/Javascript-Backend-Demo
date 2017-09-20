const {ObjectID} = require('mongodb');

const typeDefs = ` 
  
  type Question {
    id: ID!
    description: String!
    student: Student
    answered: Boolean
    topic: Topic
    project: Project
    lecture: Lecture
    solution: Solution 
    answers: [Question]
  }
  
  extend type Query {
    allQuestions: [Question]!
  }

  extend type Mutation {
    createQuestion(description: String!,  topicId: String, lectureId: String, solutionId: String, studentName: String!): Question!
    createAnswer(questionId: String!, description: String!,  topicId: String, lectureId: String, solutionId: String, studentName: String!): Question!
  }
`;
resolvers = {
    Mutation: { 
      createQuestion: async (root, data, {mongo: {Questions}}) => {
        const types = ['solutionId','projectId','topicId','lectureId'];
        Object.keys((key) => {
          if (types.contains(data[key])) {
            if (data[key].length === 0) {
              delete data[key];
            }
          }     
        });
        data.answered = false;
        pubsub.publish('Question', {Question: {mutation: 'CREATED', node: data}});
        const response = await Questions.insert(data);
        return Object.assign({id: response.insertedIds[0]}, data);
      },
      createAnswer: async (root, data, {mongo: {Questions}}) => {
        let question = await Questions.findOne({_id: new ObjectID(data.questionId)});
        console.log('hello', data);
        console.log('question', question);
        question.answered = true;
        Questions.update({_id: new ObjectID(data.questionId)}, question);
        pubsub.publish('Question', {Question: {mutation: 'ANSWERED', node: data}});
        const response = await Questions.insert(data);
        return Object.assign({id: response.insertedIds[0]}, data);
      },
    },
    Query: {
      allQuestions: async (root, data, {mongo: {Polls}}) => {
        return await Polls.find({}).toArray();
      },
    },
    Question: {
      id: root => root._id || root.id,
      topic: async ({topicId}, data, {mongo: {Topics}}) => {
        return await Topics.findOne({_id: topicId});
      },
      project: async ({projectId}, data, {mongo: {Projects}}) => {
        return await Projects.findOne({_id: projectId});
      },
      lecture: async ({lectureId}, data, {mongo: {Lectures}}) => {
        return await Lectures.findOne({_id: lectureId});
      },
      solution: async ({solutionId}, data, {mongo: {Solutions}}) => {
        return await Solutions.findOne({_id: solutionId});
      },
      student: async ({studentName}, data, {mongo: {Students}}) => {
        let student = await Students.findOne({name: studentName});
        student.id = student._id;
        delete student._id;
        return student;
      },answers: async (id, data, {mongo: {Questions}}) => {
        return await Questions.find({questionId: id._id.toString()}).toArray();
      },
    },
  };


module.exports = {
  typeDefs,
  resolvers,
}
