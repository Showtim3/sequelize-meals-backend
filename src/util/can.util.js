const EnumRole = require('../../db/enum/Erole').EnumRole;

var CanEnum =  {
    CAN_EDIT_USER : 'can_edit_user',
    CAN_VIEW_USER : 'can_view_user',
    CAN_VIEW_USERS : 'can_view_users',

    CAN_EDIT_MEAL : 'can_edit_meal',
    CAN_VIEW_MEAL : 'can_view_meal',
}

class Can {
    static canUserToUser(currentUser, otherUser, action) {
        switch (action) {
            case CanEnum.CAN_EDIT_USER:
                return currentUser.role === EnumRole.ADMIN ||
                    (currentUser.role === EnumRole.MANAGER && otherUser && otherUser.role === EnumRole.REGULAR) ||
                    (otherUser && otherUser.id === currentUser.id);
            case CanEnum.CAN_VIEW_USER:
                return currentUser.role === EnumRole.ADMIN || currentUser.role === EnumRole.MANAGER || (otherUser && otherUser.id === currentUser.id);
            case CanEnum.CAN_VIEW_USERS:
                return currentUser.role === EnumRole.ADMIN || currentUser.role === EnumRole.MANAGER ;
        }
    }

    static canUserToMeal(currentUser, meal, action) {
        switch (action) {
            case CanEnum.CAN_EDIT_MEAL:
                return (currentUser.role === EnumRole.ADMIN || (meal && currentUser.id === meal.userId) || (!meal));
            case CanEnum.CAN_VIEW_MEAL:
                return (currentUser.role === EnumRole.ADMIN || (meal && currentUser.id === meal.userId));
        }
    }
}

module.exports = {
    Can
};
