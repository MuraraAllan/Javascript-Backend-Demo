const Teacher = require('./Teacher');
const Student = require('./Student');
const authorization = require('../authorization');
const typeDefs = Student.typeDefs.concat(Teacher.typeDefs);
const resolvers = { teacherResolvers: Teacher.resolvers,
                    studentResolvers: Student.resolvers, };
module.exports = {
  typeDefs,
  resolvers,
};
