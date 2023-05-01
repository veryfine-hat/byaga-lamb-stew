const Journal = require('@byaga/journal');
const identifyUser = () => {
  const {
    headers,
    requestContext
  } = Journal.get('event');
  const userData = userDataFromRequestContext(requestContext) || userDataFromAuthToken(headers?.Authorization);

  if (userData) {
    Journal.set('user', userData, true);
    Journal.annotate('user.user_id', userData.sub);
    userData.groups.forEach(group => {
      Journal.annotate(`user.groups.${group}`, true );
    });
  }

  return !userData ? { error: "No Auth Found" } : { data: userData };
};

function userDataFromRequestContext(requestContext) {
  if (requestContext?.authorizer?.claims)
    return userDataFromClaims(requestContext.authorizer.claims, {
      requestContext: {authorizer: { claims: requestContext.authorizer.claims}}
    });
  if (requestContext?.identity)
    return userDataFromIdentity(requestContext.identity, {
      requestContext: { identity: requestContext.identity}
    });
  return undefined;
}

function userDataFromClaims(claims, eventData) {
  const groups = claims['cognito:groups'] || claims.groups || [];
  Journal.set('event-user-data', eventData)

  return {
    sub: claims.sub,
    groups: Array.isArray(groups) ? groups : [groups],
    email: claims.email
  };
}

function userDataFromIdentity(identity, eventData) {
  if (!identity.user) return undefined;

  Journal.set('event-user-data', eventData)
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
  const claims = parseJwt(token)
  return userDataFromClaims(parseJwt(token), {
    requestContext: { authorizer: { claims } },
    headers: {Authorization: authHeader}
  });
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