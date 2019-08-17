
class ServiceResponse {
    static error = (message, data=null, httpCode=400) => {
        return {success : false,message, data, httpCode};
    };

    static success = (message, data=null, httpCode=200) => {
        return {success: true,message, data, httpCode};
    };
}
module.exports = {
    ServiceResponse
};
