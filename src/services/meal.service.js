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
    static async createMeal(jwt, {title, calorie, date, time}) {
        const currentUser = await AuthenticationUtil.getUserFromJWTToken(jwt);
        if (currentUser && CanUtil.canUserToMeal(currentUser, null, CanEnum.CAN_EDIT_MEAL)) {
            const validationResponse = await MealValidator.validateMeal({time, title, date, calorie});
            if (!validationResponse.success) {
                return ServiceResponse.error(validationResponse.message)
            }
            try {
                const meal = await MealEntity.create({title, calorie, date, time, userId: currentUser.id});
                return ServiceResponse.success('Meal Created Successfully', {meal});
            } catch (e) {
                return ServiceResponse.error(ERROR_STRING);
            }
        } else {
            return ServiceResponse.forbiddenAccess();
        }
    }

    static async getMeal(jwt, mealId) {
        const currentUser = await AuthenticationUtil.getUserFromJWTToken(jwt);
        if (!currentUser) {
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

    static async updateMeal(jwt, mealId, {title, calorie, time, date}) {
        const currentUser = await AuthenticationUtil.getUserFromJWTToken(jwt);
        if (!currentUser) {
            return ServiceResponse.forbiddenAccess();
        }
        const meal = await MealEntity.findByPk(mealId);
        if (meal) {
            if (CanUtil.canUserToMeal(currentUser, meal, CanEnum.CAN_EDIT_MEAL)) {
                try {
                    const Title = title || meal.dataValues.title;
                    const Calorie = calorie || meal.dataValues.calorie;
                    const Time = time || meal.dataValues.time;
                    const Date = date || meal.dataValues.date;
                    const validationResponse = MealValidator.validateMeal({
                        title: Title,
                        calorie: Calorie,
                        time: Time,
                        date: Date
                    });
                    if (!validationResponse.success) {
                        return ServiceResponse.error(validationResponse.message);
                    }
                    await MealEntity.update({
                        title: Title,
                        calorie: Calorie,
                        time: Time,
                        date: Date
                    }, {where: {id:mealId}});
                    const updatedMeal = await MealEntity.findByPk(mealId);
                    return ServiceResponse.success('Meal Updated Successfully.', {updatedMeal});
                } catch (e) {
                    console.log(e);
                    return ServiceResponse.error(ERROR_STRING);
                }
            } else return ServiceResponse.forbiddenAccess();
        } else return ServiceResponse.notFoundError();
    }

    static async deleteMeal(jwt,mealId) {
        const currentUser = await AuthenticationUtil.getUserFromJWTToken(jwt);
        if(!currentUser){
            return ServiceResponse.forbiddenAccess();
        }
        const meal = await MealEntity.findByPk(mealId);
        if (meal) {
            if(CanUtil.canUserToMeal(currentUser,meal,CanEnum.CAN_EDIT_MEAL)){
                try {
                    await MealEntity.destroy({where: {id: mealId}});
                    return ServiceResponse.success('Meal Deleted Successfully.');
                }catch (e) {
                    return ServiceResponse.error(ERROR_STRING);
                }
            } else return ServiceResponse.forbiddenAccess();
        }
        else return ServiceResponse.notFoundError();
    }
}

module.exports = {
    MealService
};
