const validator = require('validator');
const moment = require('moment');
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

    static isValidDate(str){
        return moment(str, 'YYYY-MM-DD', true).isValid();
    }

    static isValidTime(str){
        return moment(`2010-02-02 ${str}`, 'YYYY-MM-DD HH:mm', true).isValid();
    }

    static isValidCalorie(calorie){
        return parseInt(calorie,10) > 0 && parseInt(calorie,10) < 10000;
    }
}

module.exports = {
    ValidationUtil
}