

class ValidationResponse {
    success;
    message;

    static error = (message) => {
        return {success:false, message}
    };

    static success = (message='') => {
        return {success:true, message}
    };
}

module.exports = {
    ValidationResponse
}