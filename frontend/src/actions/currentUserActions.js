import { doGet } from "../utils/request";
import {
  getNotifications,
  userProfile
} from "../utils/apiEndpoints/usersEndpoints";
import {notification} from "antd";

export const GET_USER_INFO_BEGIN = "GET_USER_INFO";
export const GET_USER_INFO_SUCCESS = "GET_USER_INFO_SUCCESS";
export const GET_USER_INFO_FAIL = "GET_USER_INFO_FAIL";
export const SET_NEW_NOTIFICATION = "SET_NEW_NOTIFICATION";
export const UPDATE_NOTIFICATIONS = "UPDATE_NOTIFICATIONS";
export const UPDATE_PHOTOS = "UPDATE_PHOTOS";
export const NEW_NOTIFICATION = "NEW_NOTIFICATION";
export const UPDATE_NOTIF_STATUS = "UPDATE_NOTIF_STATUS";

export const updateNotifStatus = () => ({
  type: UPDATE_NOTIF_STATUS
});

export const getUserInfoBegin = () => ({
  type: GET_USER_INFO_BEGIN
});

export const getUserInfoSuccess = userInfo => ({
  type: GET_USER_INFO_SUCCESS,
  payload: { userInfo }
});

export const getUserInfoFail = error => ({
  type: GET_USER_INFO_FAIL,
  payload: { error }
});

export const updateNotificationsActionCreator = (notifications, dispatchMode) => ({
  type: dispatchMode ? NEW_NOTIFICATION : UPDATE_NOTIFICATIONS,
  payload: { notifications }
});

export const updatePhotos = photos => ({
  type: UPDATE_PHOTOS,
  payload: { photos }
});

export const updateNotifications = (dispatchMode = false) => {
  return dispatch => {
    doGet(getNotifications)
      .then(notifications => {
        dispatch(updateNotificationsActionCreator(notifications, dispatchMode));
      })
      .catch(err => {
        dispatch(getUserInfoFail());
      });
  };
};

export const getUserInfo = () => {
  return dispatch => {
    dispatch(getUserInfoBegin());
    doGet(userProfile)
      .then(data => {
        dispatch(getUserInfoSuccess(data));
      })
      .catch(err => {
        dispatch(getUserInfoFail("err"));
      });
  };
};
