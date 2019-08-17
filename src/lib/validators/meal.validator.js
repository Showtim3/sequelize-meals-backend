const ValidationUtil = require('../../util/validation.util').ValidationUtil;
const ValidationResponse = require('./validation.response').ValidationResponse;

class MealValidator{
    static validateMeal({title,calorie,date,time}){
        if(!ValidationUtil.isValidString(title,{minLength:2,maxLength: 40})){
            return ValidationResponse.error('Meal title should be between 2 and 40 characters.')
        }
        if(!ValidationUtil.isValidDate(date)){
            return ValidationResponse.error('Date should be in YYYY-MM-DD format.')
        }
        if(!ValidationUtil.isValidTime(time)){
            return ValidationResponse.error('Time should be in HH:MM format.')
        }
        if(!ValidationUtil.isValidCalorie(calorie)){
            return ValidationResponse.error('Calorie should be between 0 and 10000.')
        }
        return ValidationResponse.success();
    }
}

module.exports = {
    MealValidator
};