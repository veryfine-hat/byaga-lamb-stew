/***
 * tryParseJson
 * Method to safely parse JSON
 * @param stringData {String|Object}
 * @returns {MethodResponse}
 */
const tryParseJson = (stringData) => {
    let data = stringData;
    try {
        data = typeof stringData === "string" ? JSON.parse(stringData) : stringData;
    } catch(error){
        return {error}
    }

    return {
        error: stringData ? null :  "No Data Provided",
        data
    };
};

module.exports = tryParseJson;