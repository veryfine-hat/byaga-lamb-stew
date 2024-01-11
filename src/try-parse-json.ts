import {MethodResponse} from "./types/MethodResponse";


/***
 * Method to safely parse JSON
 */
export const tryParseJson = (stringData?: string | unknown): MethodResponse => {
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

export default tryParseJson