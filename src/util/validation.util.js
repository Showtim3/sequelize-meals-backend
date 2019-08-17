const validator = require('validator');

class ValidationUtil {
    static isValidString(str, {minLength = 2, maxLength = 200, trim = true }){
        if(!str){
            return false
        }
        else if(trim && (str.trim().length < minLength || str.trim().length > maxLength)){
            return false
        }
        else if(str.length < minLength || str.length > maxLength) {
            return false
        }
        return true;
    }
    static isValidEmail(str){
        return validator.isEmail(str);
    }

}

module.exports = {
    ValidationUtil
}