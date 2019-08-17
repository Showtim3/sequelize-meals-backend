
class ServiceResponse {
    static error = (message, data=null, httpCode=400) => {
        return {success : false,message, data, httpCode};
    };

    static success = (message, data=null, httpCode=200) => {
        return {success: true,message, data, httpCode};
    };

   static notFoundError() {
        return {success: false, message: 'Resource not found', data:null, httpCode: 404};
    }

    static forbiddenAccess() {
        return {success: false, message: 'Resource not found', data:null, httpCode: 404};
    }
}
module.exports = {
    ServiceResponse
};
