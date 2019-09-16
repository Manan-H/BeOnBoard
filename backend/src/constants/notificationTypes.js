//notifications' interface
import uuidv1 from 'uuid/v1';
import moment from 'moment';

const notificationTypes = Object.freeze({
  NEW_USER: {
    id: '',
    type: 1,
    message: 'New user has been registered!',
    userId: '',
    profPic: '',
    name: '',
    surname: '',
    seen: false,
    createdAt: null,
  },
  QUIZ_TAKEN: {
    id: '',
    type: 2,
    message: 'A quiz has been taken!',
    userId: '',
    profPic: '',
    name: '',
    surname: '',
    seen: false,
    createdAt: null,
  },
  PROFILE_EDIT: {
    id: '',
    type: 3,
    message: 'A user has changed his/her profile info!',
    userId: '',
    profPic: '',
    name: '',
    surname: '',
    changedByAdmin: false,
    seen: false,
    createdAt: null,
  },
});

export default {
  setUserInfo: (userData, type, setInfoForAdmin = false) => {
    const notification = notificationTypes[type];
    switch (type) {
      case 'NEW_USER':
        {
          notification.message = `has joined Simply team!`;
          notification.userId = userData._id;
          notification.profPic = userData.profPic;
          notification.name = userData.name;
          notification.surname = userData.surname;
          notification.createdAt = moment();
          notification.id = uuidv1();
        }
        break;
      case 'PROFILE_EDIT':
        {

          if (!setInfoForAdmin && userData.changedByAdmin) {
            notification.message =
              'your profile info has been updated by Admin!';
            notification.changedByAdmin = true;
          }

          if (!setInfoForAdmin && !userData.changedByAdmin) {
            notification.message = `has changed their profile info!`;
          }

          if (setInfoForAdmin) {
            notification.message =
                'profile info has been updated by Admin!';
          }

          notification.surname = userData.surname;
          notification.userId = userData._id;
          notification.profPic = userData.profPic;
          notification.name = userData.name;
          notification.createdAt = moment();
          notification.id = uuidv1();
        }
        break;
      case 'QUIZ_TAKEN':
        {
          notification.message = `has taken the quiz!`;
          notification.userId = userData._id;
          notification.profPic = userData.profPic;
          notification.name = userData.name;
          notification.surname = userData.surname;
          notification.createdAt = moment();
          notification.id = uuidv1();
        }
        break;
      default:
        return 'New notification!';
    }
    return notification;
  },
};

export const types = notificationTypes;

export const sortNotifications = notifications => {
  return notifications.sort((notif1, notif2) => {
    return notif2.createdAt - notif1.createdAt;
  });
};
