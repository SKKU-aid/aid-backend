/**
 * Creates a standardized response object.
 * @param {boolean} success - Indicates whether the operation was successful.
 * @param {string} message - A message describing the result.
 * @param {object} data - An object containing the response data, defaulting to an empty 
 * @returns {{success: boolean, message: string, data: Array}} A response object with the specified structure.
 */
function createResponse(success, message, data) {
    return {
        success,
        message,
        data
    };
}

module.exports = createResponse;