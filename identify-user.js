const Journal = require('@byaga/journal');
const identifyUser = () => {
  const {
    headers,
    requestContext
  } = Journal.get('event');
  const userData = userDataFromRequestContext(requestContext) || userDataFromAuthToken(headers?.Authorization);

  if (userData) {
    Journal.set('user', userData);
    Journal.annotate({ 'user.user_id': userData.sub });
    userData.groups.forEach(group => {
      Journal.annotate({ [`user.groups.${group}`]: true });
    });
  }

  return !userData ? { error: "No Auth Found" } : { data: userData };
};

function userDataFromRequestContext(requestContext) {
  if (requestContext?.authorizer?.claims) return userDataFromClaims(requestContext.authorizer?.claims);
  if (requestContext?.identity) return userDataFromIdentity(requestContext.identity);
  return undefined;
}

function userDataFromClaims(claims) {
  const groups = claims['cognito:groups'] || claims.groups || [];
  return {
    sub: claims.sub,
    groups: Array.isArray(groups) ? groups : [groups],
    email: claims.email
  };
}

function userDataFromIdentity(identity) {
  if (!identity.user) return undefined;
  return {
    sub: identity.user,
    groups: [],
    email: null
  };
}

function userDataFromAuthToken(authHeader) {
  if (!authHeader) return undefined;

  const token = authHeader.substr(8 /*"Bearer ".length*/);

  if (!token) return undefined;
  return userDataFromClaims(parseJwt(token));
}

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const buff = Buffer.from(base64, 'base64');
  const payload = buff.toString('ascii');
  return JSON.parse(payload);
}

module.exports = {
  identifyUser,
  parseJwt
};