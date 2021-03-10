const identifyUser = ({headers = {}}) => {
    const authHeader = headers.Authorization;
    if (!authHeader) return {error:"No Auth Found"}

    const token = authHeader.substr(8 /*"Bearer ".length*/)

    if (!token) return {error: "No Auth Found"}

    return {data: parseJwt(token).sub}
};

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
}