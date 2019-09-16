import { normalize, schema } from "normalizr";
import { doGet, doDelete } from "../utils/request";
import {notification} from "antd";

export const SET_ALL_USERS = "SET_ALL_USERS";
export const SET_USER_BY_ID = "SET_USER_BY_ID";
export const DELETE_USER = "DELETE_USER";
export const USER_LIST_LOADING_START = "USER_LIST_LOADING_START";
export const USER_LIST_LOADING_END = "USER_LIST_LOADING_END";

export const getUsers = () => dispatch => {
  const user = new schema.Entity("users", {}, { idAttribute: "_id" });
  const mySchema = { users: [user] };

  doGet("users")
    .then(data => {
      const normalizedData = normalize(data, mySchema);
      dispatch({ type: SET_ALL_USERS, payload: normalizedData.entities.users });
    })
    .catch(err => {
        console.log(err);
    })
    .finally(() => dispatch({ type: USER_LIST_LOADING_END }));
};

export const deleteUser = id => dispatch => {
  dispatch({ type: USER_LIST_LOADING_START });
  doDelete(`users/${id}`)
    .then(data => dispatch(getUsers()))
    .catch(err => {
      notification.error({
        message: 'Oops! Something went wrong!',
        description: err.message,
      });
    })
    .finally(() => dispatch({ type: USER_LIST_LOADING_END }));
};

export const getUserById = id => dispatch => {
  console.log("getUserById");
  dispatch({ type: USER_LIST_LOADING_START });
  doGet(`users/${id}`)
    .then(data => dispatch({ type: SET_USER_BY_ID, id, payload: data[0] }))
    .catch(err => {
      notification.error({
        message: 'Oops! Something went wrong!',
        description: err.message,
      });
    })
    .finally(() => dispatch({ type: USER_LIST_LOADING_END }));
};
