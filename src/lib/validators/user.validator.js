const ValidationUtil = require('../../util/validation.util').ValidationUtil;
const ValidationResponse = require('./validation.response').ValidationResponse;
class UserValidator{
     static validateRegister({name,email,password,calorieGoal}){
         if(!ValidationUtil.isValidString(name,{minLength:2,maxLength: 30})){
             return ValidationResponse.error('Name should be between 2 and 30 characters')
         }
         if(!ValidationUtil.isValidEmail(email)){
             return ValidationResponse.error('Invalid Email')
         }
         if(!ValidationUtil.isValidString(password,{minLength:2,maxLength: 20, trim:false})){
             return ValidationResponse.error('Password should be between 2 and 20 chars')
         }
         if(!calorieGoal){
             return ValidationResponse.error('Calorie Goal Required');
         }
     }
}

module.exports = {
    UserValidator
};