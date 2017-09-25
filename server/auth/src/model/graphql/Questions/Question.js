const {ObjectID} = require('mongodb');

const typeDefs = ` 
  type Question {
    id: ID!
    description: String!
    student: Student
    answered: Boolean
    answers: [Question]!
  }
  
  type Query {
    allQuestions: [Question]!
  }

  type Mutation {
    createQuestion(description: String!,  studentName: String!): Question!
    createAnswer(questionId: String!, description: String!,  userName: String!): Question!
  }
`;
resolvers = {
    Mutation: { 
      createQuestion: async (root, data, {mongo: {Questions}}) => {
        data.answered = false;
        pubsub.publish('Question', {Question: {mutation: 'CREATED', node: data}});
        const response = await Questions.insert(data);
        return Object.assign({id: response.insertedIds[0]}, data);
      },
      createAnswer: async (root, data, {mongo: {Questions}}) => {
        let question = await Questions.findOne({_id: new ObjectID(data.questionId)});
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
