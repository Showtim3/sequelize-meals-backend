const UserEntity = require('../app/model.service').UserEntity;
const ServiceResponse = require('../lib/service.response').ServiceResponse;
const UserValidator = require('../lib/validators/user.validator').UserValidator;
const bcryptjs = require('bcryptjs');

class UserService {

    static async register({name,email,password,calorieGoal}) {
        if (await UserEntity.findOne({where: {email: email}})) {
            return ServiceResponse.error('User Already Exists');
        } else {
            try {
                const validationResponse = UserValidator.validateRegister({name, email, password, calorieGoal});
                if (!validationResponse.success) {
                    return ServiceResponse.error(validationResponse.message);
                } else {
                    const passwordHash = bcryptjs.hashSync(password,8);
                    const user = {
                        name,
                        email,
                        passwordHash,
                        calorieGoal
                    };
                    UserEntity.save(user);
                    return ServiceResponse.success('Registration Successful', user, 201);
                }
            } catch (e) {
                return ServiceResponse.error(e);
            }
        }
    }

    static async login({email,password}) {
        const user = await UserEntity.findOne({where:{email:email}});
        if(user){
            if(bcryptjs.compareSync(password, user.passwordHash)){
                const jwt = AuthenticationUtil.generateJWTToken(user);
                await AuthenticationUtil.addJWTToken({jwtToken: jwt, user});
                return ServiceResponse.success('Login Successful', {user,jwt}, 200)
            }
            else return ServiceResponse.error('Invalid Credentials',null, 404);
        }
    }
}

module.exports = {
    UserService
};
