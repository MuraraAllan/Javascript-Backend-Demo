const typeDefs = ` 
  type Teacher {
    id: ID!
    name: String!
    email: String
  }
 
  input TeacherSingUp {
    email: TEACHER_AUTH_PROVIDER
  }

  input TEACHER_AUTH_PROVIDER {
    email: String!
    password: String!
  }

  type TeacherSignature {
    token: String
    user: Teacher
  } 

  extend type Query {
    allTeachers : [Teacher!]!
  }

  extend type Mutation {
    createTeacher(name: String!, email: String, password: String!): Teacher!
    signInTeacher(email: String!, password: String!): TeacherSignature! 
  }
`;

const resolvers = {
  Mutation: {
    createTeacher: async (root, data, {mongo: {Teachers}}) => {
      await authorization({user, authLevel: global.teacherLevel}); 
      const response = await Teachers.insert(data);
      return Object.assign({id: response.insertedIds[0]}, data);
    },
    signInTeacher: async (root, data, {mongo: {Teachers}}) => {
      await authorization({user, authLevel: global.teacherLevel}); 
      const teacher = await Teachers.findOne({email: data.email});
      if (data.password === teacher.password) {
        return {token: `token-${teacher.email}`, teacher};
      }
      throw new Error('Invalid Password');
    },
  },
  Query: {
    allTeachers: async (root, data, {mongo: {Teachers}}) => {
      await authorization({user, authLevel: global.teacherLevel}); 
      return await Teachers.find({}).toArray();
    },
  },
  Teacher: {
    id: root => root._id || root.id,
  }
};

module.exports = {
   typeDefs,
   resolvers,
};

