import UUIDV4 from 'uuid/v4';
import JWT from 'jsonwebtoken';
import moment from 'moment';

const JWT_SECRET = '04i-293u4-0234';
const JWT_EXPIRATION_SECONDS = 60 * 60 * 24;

class AuthenticationUtil {

    static validJWTS = {};

    static generateJWTToken(user) {
        const payload = {
            user_id: user.id,
            random: UUIDV4(),
            expireAt: moment().add(JWT_EXPIRATION_SECONDS, 'seconds').toISOString(),
        };
        return JWT.sign(payload, JWT_SECRET);
    }

    static async addJWTToken({jwtToken, user}) {
        if (this.validJWTS[user.id]) {
            this.validJWTS[user.id].push(jwtToken);
        } else {
            this.validJWTS[user.id] = [jwtToken];
        }
    }

    static async removeJWTToken({jwtToken, user}) {
        if (this.validJWTS[user.id]) {
            const index = this.validJWTS[user.id].indexOf(jwtToken);
            if (index >= 0) {
                this.validJWTS[user.id].splice(index, 1);
            }
        }
    }

    static async getUserFromJWTToken(jwtToken, repoService){

        try {
            const decoded = JWT.verify(jwtToken, JWT_SECRET);
            const {user_id, expireAt} = decoded;
            // if ( !this.validJWTS[user_id].includes(jwtToken))
            //     return null;
            if (expireAt < moment().toISOString()) { // if expiredAt is lesser than current time
                return null;
            }
            const user = await repoService.userRepo.findOne(user_id);
            return user;

        } catch (e) {
            return null;
        }
    }

    // static async authenticateJWTToken(jwtToken: string): Promise<boolean> {
    //     try {
    //         const decoded: any = JWT.verify(jwtToken, CONFIG.SECRET);
    //         const {user_id, expireAt} = decoded;
    //         if (expireAt < moment().toISOString()) { // if expiredAt is lesser than current time
    //             return false;
    //         }
    //         const user = User.active().findOne({where: {id: user_id}});
    //         if (user)
    //         if (user) {
    //             return true;
    //         } else return false;
    //     } catch (e) {
    //         return false;
    //     }
    // }

}

module.exports = {
    AuthenticationUtil
}
