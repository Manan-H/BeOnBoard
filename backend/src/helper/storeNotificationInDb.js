import UserModel from '../models/userModel';
import { types as notificationTypes } from '../constants/notificationTypes';

export default (notification, userId, changedByAdmin = false) => {
  const options = {
    _id: changedByAdmin ? userId : { $ne: userId },
  };

  if (
    (notification.type === notificationTypes.PROFILE_EDIT.type ||
      notification.type === notificationTypes.QUIZ_TAKEN.type) &&
    !changedByAdmin
  ) {
    options.userType = 1;
  }

  return UserModel.updateMany(options, {
    $set: {
      hasUnseenNotifications: true
    },

    $push: {
      notifications: notification,
    },
  });
};
