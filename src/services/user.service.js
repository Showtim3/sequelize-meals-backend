const UserEntity = require('../app/model.service').UserEntity;
const ServiceResponse = require('../lib/service.response').ServiceResponse;
const UserValidator = require('../lib/validators/user.validator').UserValidator;
const bcryptjs = require('bcryptjs');
const AuthenticationUtil = require('../util/authentication.util').AuthenticationUtil;
const CanUtil = require('../util/can.util').CanUtil;
const CanEnum = require('../util/can.util').CanEnum;
const EnumRole = require('../db/enum/Erole').EnumRole;
const ERROR_STRING = 'Unexpected Error Occurred';
class UserService {

    static async register({name,email,password='',role=EnumRole.REGULAR,calorieGoal}) {
        if (email && await UserEntity.findOne({where: {email:email.toLowerCase()}})) {
            return ServiceResponse.error('User Already Exists With Email');
        } else {
            try {
                const validationResponse = UserValidator.validateRegister({name, email:email.toLowerCase(), password,role, calorieGoal});
                if (!validationResponse.success) {
                    return ServiceResponse.error(validationResponse.message);
                } else {
                    const passwordHash = bcryptjs.hashSync(password,8);
                    const userObj = {
                        name,
                        email:email.toLowerCase(),
                        role,
                        passwordHash,
                        calorieGoal
                    };
                    const user = await UserEntity.create(userObj);
                    const userToSend = user.dataValues;
                    delete userToSend.passwordHash;
                    return ServiceResponse.success('Registration Successful', userToSend, 201);
                }
            } catch (e) {
                return ServiceResponse.error(ERROR_STRING);
            }
        }
    }

    static async login({email,password}) {
        const user = await UserEntity.findOne({where:{email:email.toLowerCase()}});
        if(user){
            if(bcryptjs.compareSync(password, user.passwordHash)){
                const jwt = AuthenticationUtil.generateJWTToken(user);
                await AuthenticationUtil.addJWTToken({jwtToken: jwt, user});
                const userToSend = user.dataValues;
                delete userToSend.passwordHash;
                return ServiceResponse.success('Login Successful', {...userToSend,jwt}, 200)
            }
            else return ServiceResponse.error('Invalid Credentials',null, 404);
        }
        else return ServiceResponse.error('Invalid Credentials',null, 404);
    }

    static async getUsers(jwt) {
        const user = await AuthenticationUtil.getUserFromJWTToken(jwt);
        if(user){
            if(CanUtil.canUserToUser(user,null,CanEnum.CAN_VIEW_USER)){
                try {
                    const usersList = await UserEntity.findAll();
                    return ServiceResponse.success('', {usersList});
                } catch (e) {
                    return ServiceResponse.error(ERROR_STRING);
                }
            } else return ServiceResponse.forbiddenAccess()
        }
        return ServiceResponse.forbiddenAccess();
    }

    static async updateUser(jwt, id, {name,email,calorieGoal,role}) {
        const currentUser = await AuthenticationUtil.getUserFromJWTToken(jwt);
        const user = await UserEntity.findByPk(id);
        if(user){
            if(CanUtil.canUserToUser(currentUser,user,CanEnum.CAN_EDIT_USER)){
                try {
                    const Name = name || user.dataValues.name;
                    const Email = email || user.dataValues.email;
                    const CalorieGoal = calorieGoal || user.dataValues.calorieGoal;
                    const Role = role || user.dataValues.role;
                    const validationResponse = UserValidator.validateRegister({name: Name,email: Email,calorieGoal: CalorieGoal,role: Role, update:true});
                    if(!validationResponse.success) {
                        return ServiceResponse.error(validationResponse.message);
                    }
                    await UserEntity.update({name: Name, email: Email, calorieGoal: CalorieGoal, role: Role}, {where:{id}});
                    const updatedUser = await UserEntity.findByPk(id);
                    return ServiceResponse.success('User Updated Successfully.', {updatedUser});
                } catch (e) {
                    return ServiceResponse.error(ERROR_STRING);
                }
            } else return ServiceResponse.forbiddenAccess()
        }
        else return ServiceResponse.notFoundError();
    }

    static async getUser(jwt,id){
        const currentUser = await AuthenticationUtil.getUserFromJWTToken(jwt);
        if(!id){
            id = currentUser.id;
        }
        const user = await UserEntity.findByPk(id);
        if(user){
            if(CanUtil.canUserToUser(currentUser,user,CanEnum.CAN_VIEW_USER)){
                try {
                    return ServiceResponse.success('',{user} );
                } catch (e) {
                    return ServiceResponse.error(ERROR_STRING);
                }
            } else return ServiceResponse.forbiddenAccess()
        }
        return ServiceResponse.notFoundError();

    }

    static async createUser(jwt,{name,email,role,calorieGoal, password}){
        const currentUser = await AuthenticationUtil.getUserFromJWTToken(jwt);
        if(currentUser.role === EnumRole.REGULAR){
            return ServiceResponse.forbiddenAccess();
        }
        if(currentUser.role === EnumRole.MANAGER && [EnumRole.MANAGER, EnumRole.ADMIN].includes(role)){
            return ServiceResponse.forbiddenAccess();
        }

        const sr =  await this.register({email, name, calorieGoal, role, password});
        if(sr.success){
            sr.message = 'User Created Successfully';
        }
        return sr;

    }

    static async deleteUser(jwt, id){
        const currentUser = await AuthenticationUtil.getUserFromJWTToken(jwt);
        const user = await UserEntity.findByPk(id);
        if(user){
            if(CanUtil.canUserToUser(currentUser,user,CanEnum.CAN_EDIT_USER)){
                try {
                    await UserEntity.destroy({where:{id}});
                    return ServiceResponse.success('User Deleted Successfully' );
                } catch (e) {
                    return ServiceResponse.error(ERROR_STRING);
                }
            } else return ServiceResponse.forbiddenAccess()
        }
        return ServiceResponse.notFoundError();
    }

    static async logout(jwt) {
        try {
            const user = await AuthenticationUtil.getUserFromJWTToken(jwt);
            await AuthenticationUtil.removeJWTToken({jwtToken: jwt, user});
            return ServiceResponse.success(null, 'Logged out successfully');
        }catch (e) {
            return ServiceResponse.error(ERROR_STRING);
        }
    }
}

module.exports = {
    UserService
};
