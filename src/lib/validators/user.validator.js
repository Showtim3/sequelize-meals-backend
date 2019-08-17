const ValidationUtil = require('../../util/validation.util').ValidationUtil;
const ValidationResponse = require('./validation.response').ValidationResponse;
const EnumRole = require('../../db/enum/Erole').EnumRole;
class UserValidator{
     static validateRegister({name,email,password,role,calorieGoal,update=false}){
         if(!ValidationUtil.isValidString(name,{minLength:2,maxLength: 30})){
             return ValidationResponse.error('Name should be between 2 and 30 characters')
         }
         if(!email || !ValidationUtil.isValidEmail(email)){
             return ValidationResponse.error('Invalid Email')
         }
         if(!update && !ValidationUtil.isValidString(password,{minLength:8,maxLength: 20, trim:false})){
             return ValidationResponse.error('Password should be between 8 and 20 chars')
         }
         if(!role || !(Object.values(EnumRole).indexOf(role.toLowerCase()) > -1)){
             return ValidationResponse.error('Role Required and should be regular,manager or admin');
         }
         if(!calorieGoal){
             return ValidationResponse.error('Calorie Goal Required');
         }
         return ValidationResponse.success();
     }
}

module.exports = {
    UserValidator
};