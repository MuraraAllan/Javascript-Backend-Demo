const authorization = async (params) => {
  let userAccessLevel = params.user.data.accessLevel;
  let requiredLevel = params.authLevel;
  if (userAccessLevel >= requiredLevel) return true;
  throw new Error('Not Authorized');
}

module.exports = authorization
