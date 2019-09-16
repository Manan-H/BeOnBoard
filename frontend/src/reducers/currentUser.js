import {
  GET_USER_INFO_BEGIN,
  GET_USER_INFO_SUCCESS,
  GET_USER_INFO_FAIL,
  UPDATE_NOTIFICATIONS,
  UPDATE_PHOTOS,
  NEW_NOTIFICATION, UPDATE_NOTIF_STATUS
} from "../actions/currentUserActions";

const initialState = {
  userInfo: {},
  isLoading: true,
  error: null
};

function unReadNotificationsCount(notification) {
  if (!notification instanceof Array) return 0;
  return notification.filter(notification => !notification.seen).length;
}

// copy object
const currentUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_INFO_BEGIN: {
      return {
        ...state,
        isLoading: true,
        error: null
      };
    }  
    case GET_USER_INFO_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        userInfo: {
          ...action.payload.userInfo,
          newNotificationsCount: unReadNotificationsCount(
              action.payload.userInfo.notifications
          )
        }
      };
    }

    case GET_USER_INFO_FAIL:
      return {
        ...state,
        isLoading: false,
        error: action.payload.error
      };
    case UPDATE_NOTIFICATIONS: {
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          notifications: action.payload.notifications,
          hasUnseenNotifications: false,
          newNotificationsCount: unReadNotificationsCount(
              action.payload.notifications
          )
        }
      };
    }
    case NEW_NOTIFICATION: {
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          notifications: action.payload.notifications,
          hasUnseenNotifications: true,
          newNotificationsCount: unReadNotificationsCount(
              action.payload.notifications
          )
        }
      };
    }

      case UPDATE_PHOTOS: {
        return {
          ...state,
          userInfo: {
            ...state.userInfo,
            photos: action.payload.photos || []
          }
        }
      }

    case UPDATE_NOTIF_STATUS: {
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          hasUnseenNotifications: false,
        }
      }
    }

    default: {
      return state;
    }
  }
};

export default currentUserReducer;
