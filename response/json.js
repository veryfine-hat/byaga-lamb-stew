const deepMerge = require('../lib/deep-merge')
/**
 * Updates the response to include the json data with appropriate headers
 * @param {*} data - some JSON data
 * @param {Response} rsp
 * @returns {Response}
 */
const json = (data, rsp = {}) => {
    const stringData = JSON.stringify(data);
    rsp = deepMerge(rsp, {
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': stringData?.length
        },
        body: stringData
    })
    return rsp
};

module.exports = json;