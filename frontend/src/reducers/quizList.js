import {
  GET_QUIZZES,
  QUIZ_LIST_LOADING_START,
  QUIZ_LIST_LOADING_END
} from "../actions/quizActions";

const initialState = {
  quizzes: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_QUIZZES:
      return {
        ...state,
        quizzes: action.payload
      };

    case QUIZ_LIST_LOADING_START:
      return {
        ...state,
        isLoading: true
      };

    case QUIZ_LIST_LOADING_END:
      return {
        ...state,
        isLoading: false
      };

    default:
      return state;
  }
};
