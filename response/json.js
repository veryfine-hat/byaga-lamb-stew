/**
 * Updates the response to include the json data with appropriate headers
 * @param {*} data - some JSON data
 * @param {Response} rsp
 * @returns {Response}
 */
const json = (data, rsp = {}) => {
    const stringData = JSON.stringify(data);
    return {
        ...rsp,
        headers: {
            ...rsp.headers,
            'Content-Type': 'application/json',
            'Content-Length': stringData.length
        },
        data,
        body: stringData
    }
};

module.exports = json;