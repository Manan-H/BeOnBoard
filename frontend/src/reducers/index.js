import { combineReducers } from 'redux';
import userList from './userList';
import currentUser from "./currentUser"
import quizList from "./quizList";
export default combineReducers({
  currentUser,
  userList,
  quizList
});