const {ObjectID} = require('mongodb');

const typeDefs = ` 

  type Poll {
    id: ID!
    description: String!
    pollQuestion: String!
    creatorId: String!
    avgRate: Int
    teacherId: String
    topicId: String
    projectId: String
    participants: Int
    cohort: Cohort
    answers: [PollAnswer!]!
  }
  
  type PollAnswer {
    userId: String!
    pollId: String!
    rate: Int!
    comment: String!
  }
  
  extend type Query {
    allPolls: [Poll]!
  }

  extend type Mutation {
    createPoll(description: String!, projectId: String, teacherId: String, topicId: String, cohortId: String, creatorId: String!, pollQuestion: String): Poll!
    createPollAnswer(userId: String!, pollId: String!, rate: Int!, comment: String!) : PollAnswer!
  }
`;

resolvers = {
    Mutation: { 
      createPoll: async(root, data, {mongo: {Polls}}) => {
        data.creatorId = new ObjectID(data.creatorId);
        if (data.teacherId) data.teacherId = new ObjectID(data.teacherId);
        if (data.topicId) data.topicId = new ObjectID(data.topicId);
        if (data.cohortId) data.cohortId = new ObjectID(data.cohortId);
        const response = await Polls.insert(data);
        return Object.assign({id: response.insertedIds[0]}, data);
      },
      createPollAnswer: async(root, data, {mongo: {Polls}}) => {
        data.pollId = new ObjectID(data.pollId);
        data.userId = new ObjectID(data.userId);
        const poll = await Polls.findOne({_id: data.pollId});
        console.log(poll);
        if (!poll) throw new Error('Poll Not Found');
        const update = await Polls.update(poll, { $push: { answers: data }});
        return Object.assign(poll,data); 
      },
    },
    Query: {
      allPolls: async (root, data, {mongo: {Polls}}) => {
        return await Polls.find({}).toArray();
      },
    },
    Poll: {
      id: root => root._id || root.id,
    },
  };


module.exports = {
  typeDefs,
  resolvers,
}
