const UserEntity = require('../app/model.service').UserEntity;
const ServiceResponse = require('../lib/service.response').ServiceResponse;
const UserValidator = require('../lib/validators/user.validator').UserValidator;
const bcryptjs = require('bcryptjs');
const AuthenticationUtil = require('../util/authentication.util').AuthenticationUtil;
const CanUtil = require('../util/can.util').CanUtil;
const CanEnum = require('../util/can.util').CanEnum;

const ERROR_STRING = 'Unexpected Error Occurred';
class UserService {

    static async register({name,email,password,role,calorieGoal}) {
        if (email && await UserEntity.findOne({where: {email: email}})) {
            return ServiceResponse.error('User Already Exists');
        } else {
            try {
                const validationResponse = UserValidator.validateRegister({name, email, password,role, calorieGoal});
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

    static async logout(jwt) {
        try {
            const user = await AuthenticationUtil.getUserFromJWTToken(jwt);
            await AuthenticationUtil.removeJWTToken({jwtToken: jwt, user});
            return ServiceResponse.success(null, 'Logged out successful');
        }catch (e) {
            return ServiceResponse.error(ERROR_STRING);
        }
    }
}

module.exports = {
    UserService
};
