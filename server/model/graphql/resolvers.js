const {ObjectID} = require('mongodb');
const pubsub = require('../pubsub');
const authorization = require('./authorization');
module.exports = {
  Query: {
    allSprints: async (root, data, {mongo: {Sprints}, user}) => { 
      await authorization({user, authLevel: global.teacherLevel}) 
      return await Sprints.find({}).toArray();
    },
    allTopics: async (root, data, {mongo: {Topics}}) => {
      await authorization({user, authLevel: global.teacherLevel}) 
      return await Topics.find({}).toArray();
    },
    allLectures: async (root, data, {mongo: {Lectures}}) => {
      await authorization({user, authLevel: global.teacherLevel}) 
      return await Lectures.find({}).toArray();
    },
    allSolutions: async (root, data, {mongo: {Solutions}}) => {
      await authorization({user, authLevel: global.teacherLevel}) 
      return await Solutions.find({}).toArray();
    },
    allVideos: async (root, data, {mongo: {Videos}}) => {
      await authorization({user, authLevel: global.teacherLevel}) 
      return await Videos.find({}).toArray();
    },
    allQuestions: async (root, data, {mongo: {Questions}}) => {
      await authorization({user, authLevel: global.teacherLevel}) 
      return await Questions.find({}).toArray();
    },
  },
  Mutation: {
    signinStudent: async (root, data, {mongo: {Students}}) => {
        const user = await Student.findOne({email: data.email.email});
        if (data.email.password === user.password) {
          return {token: `token-${user.email}`, user};
        }
    },
    createSprint: async (root, data, {mongo: {Sprints}}) => {
      const response = await Sprints.insert(data); 
      pubsub.publish('Sprint', {Sprint: {mutation: 'CREATED', node: data}});
      return Object.assign({id: response.insertedIds[0]}, data); 
    },
    createTopic: async (root, data, {mongo: {Topics}}) => {
      data.sprintId = new ObjectID(data.sprintId);
      data.cohortId = new ObjectID(data.cohortId);
      const response = await Topics.insert(data);
      return Object.assign({id: response.insertedIds[0]}, data);
    },
    createProject: async (root, data, {mongo: {Projects}}) => {
      data.topicId = new ObjectID(data.topicId);
      const response = await Projects.insert(data);
      return Object.assign({id: response.insertedIds[0]}, data);
    },
    createLecture: async (root, data, {mongo: {Lectures}}) => {
      data.topicId = new ObjectID(data.topicId);
      const response = await Lectures.insert(data);
      return Object.assign({id: response.insertedIds[0]}, data);
    },
    createSolution: async (root, data, {mongo: {Solutions}}) => {
      data.projectId = new ObjectID(data.projectId);
      const response = await Solutions.insert(data);
      return Object.assign({id: response.insertedIds[0]}, data);
    },
    createVideo: async (root, data, {mongo: {Videos}}) => {
      if(data.projectId) { 
        data.projectId = new ObjectID(data.projectId);
      } else {
        delete data.projectId;
      }
      if (data.solutionId) {
        data.solutionId = new ObjectID(data.solutionId);
      } else {
        delete data.solutionId;
      }
      if (data.topicId) {
        data.topicId = new ObjectID(data.topicId);
      } else {
        delete data.topicId;
      }  
      if (data.lectureId) {
        data.lectureId = new ObjectID(data.lectureId);
      } else {
        delete data.lectureId;
      }
pubsub.publish('Video', {Video: {mutation: 'CREATED', node: data}});
      const response = await Videos.insert(data);
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
    createQuestion: async (root, data, {mongo: {Questions}}) => {
      if(data.projectId) { 
        data.projectId = new ObjectID(data.projectId);
      } else {
        delete data.projectId;
      }
      if (data.solutionId) {
        data.solutionId = new ObjectID(data.solutionId);
      } else {
        delete data.solutionId;
      }
      if (data.topicId) {
        data.topicId = new ObjectID(data.topicId);
      } else {
        delete data.topicId;
      }  
      if (data.lectureId) {
        data.lectureId = new ObjectID(data.lectureId);
      } else {
        delete data.lectureId;
      }
      data.answered = false;
pubsub.publish('Question', {Question: {mutation: 'CREATED', node: data}});
      const response = await Questions.insert(data);
      return Object.assign({id: response.insertedIds[0]}, data);
    },
  },
  Sprint: {
    id: root => root._id || root.id, 
  },
  Topic: {
    id: root => root._id || root.id,
    sprint: async ({sprintId}, data, {mongo: {Sprints}}) => {
      return await Sprints.findOne({_id: sprintId});
    },
  },
  Project: {
    id: root => root._id || root.id,
    topic: async ({topicId}, data, {mongo: {Topics}}) => {
      return await Topics.findOne({_id: topicId});
    },
    solution: async (id, data, {mongo: {Solutions}}) => {
      let project_id = new ObjectID(id._id);
      return await Solutions.find({projectId: project_id}).toArray();
    },
  },
  Lecture: {
    id: root => root._id || root.id,
    topic: async ({topicId}, data, {mongo: {Topics}}) => {
      return await Topics.findOne({_id: topicId});
    },
  },
  Solution: {
    id: root => root._id || root.id,
    project: async ({projectId}, data, {mongo: {Projects}}) => {
      return await Projects.findOne({_id: projectId});
    },
  },
  Video: {
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
      return await Solutions.findOne({_id: new ObjectID(solutionId)});
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
    },
    answers: async (id, data, {mongo: {Questions}}) => {
      return await Questions.find({questionId: id._id.toString()}).toArray();
    },
  },
  Subscription: {
    Sprint: {
      subscribe: () => pubsub.asyncIterator('Sprint'),
    },
    Question: {
      subscribe: () => pubsub.asyncIterator('Question'),
    },
    Student: {
      subscribe: () => pubsub.asyncIterator('Student'),
    }
  },
};
