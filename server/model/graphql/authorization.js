const authorization = async (params) => {
  const userAccessLevel = params.user.data.accessLevel;
  const requiredLevel = params.authLevel;
  if (userAccessLevel >= requiredLevel) return true;
  throw new Error('Not Authorized');
}

module.exports.authorization = authorization
