const {ObjectID} = require('mongodb');

global.resolvers = {
  Cohort: async ({cohortId}, data, {mongo: {Cohorts}}) => {
    return await Cohorts.findOne({_id: new ObjectID(cohortId)});
  },
}
