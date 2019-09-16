import { 
  USER_LIST_LOADING_START,
  USER_LIST_LOADING_END,
  SET_ALL_USERS,
  SET_USER_BY_ID,
  DELETE_USER
} from '../actions/userListActions';

const initialState = { users: {}};

export default function (state=initialState, action) {
  
  switch (action.type) {
    
    case USER_LIST_LOADING_START: {
      return { ...state, isLoading: true };
    }

    case USER_LIST_LOADING_END: {
      return { ...state, isLoading: false };
    }

    case SET_ALL_USERS: {
      return { ...state, users:{ ...action.payload } };
    }

    case SET_USER_BY_ID: {
      const newUsers = { ...state.users, [action.id]:action.payload };
      return { ...state, users: newUsers };
    }

    case DELETE_USER: {
      const newUsers = { ...state.users };
      delete newUsers[action.id];
      return { ...state, users:newUsers };
    }    

    default:
      return state;
  }
}