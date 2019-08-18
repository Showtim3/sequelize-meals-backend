const MealEntity = require('../app/model.service').MealEntity;
const UserEntity = require('../app/model.service').UserEntity;
const ServiceResponse = require('../lib/service.response').ServiceResponse;
const MealValidator = require('../lib/validators/meal.validator').MealValidator;

const bcryptjs = require('bcryptjs');
const AuthenticationUtil = require('../util/authentication.util').AuthenticationUtil;
const CanUtil = require('../util/can.util').CanUtil;
const CanEnum = require('../util/can.util').CanEnum;
const EnumRole = require('../db/enum/Erole').EnumRole;
const ERROR_STRING = 'Unexpected Error Occurred';


class MealService {
    static async createMeal(jwt,{title,calorie,date,time}){
        const currentUser = await AuthenticationUtil.getUserFromJWTToken(jwt);
        if(currentUser && CanUtil.canUserToMeal(currentUser,null,CanEnum.CAN_EDIT_MEAL)){
            console.log("USer found and authorized");
            const validationResponse = await MealValidator.validateMeal({time,title,date,calorie});
            if(!validationResponse.success){
                return ServiceResponse.error(validationResponse.message)
            }
            try {
                const meal = await MealEntity.create({title, calorie, date, time, userId: currentUser.id});
                return ServiceResponse.success('Meal Created Successfully', {meal});
            } catch (e) {
                console.log(e);
                return ServiceResponse.error(ERROR_STRING);
            }
        } else {
            return ServiceResponse.forbiddenAccess();
        }
    }
    static async getMeal(jwt, mealId){
        const currentUser = await AuthenticationUtil.getUserFromJWTToken(jwt);
        if(!currentUser) {
            return ServiceResponse.forbiddenAccess();
        }
        try {
            const meal = await MealEntity.findByPk(mealId);
            if (meal) {
                if (CanUtil.canUserToMeal(currentUser, meal, CanEnum.CAN_VIEW_MEAL)) {
                    return ServiceResponse.success('', meal);
                } else return ServiceResponse.forbiddenAccess();
            } else return ServiceResponse.notFoundError();
        } catch (e) {
            console.log(e);
            return ServiceResponse.error(ERROR_STRING);
        }
    }
}

module.exports = {
    MealService
};
