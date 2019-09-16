import { normalize, schema } from "normalizr";
import { doGet, doDelete, doPut } from "../utils/request";
import { quizBaseUrl } from "../utils/apiEndpoints/quizEndpoints";
import {notification} from "antd";

export const GET_QUIZZES = "GET_QUIZZES";
export const DELETE_QUIZ = "DELETE_QUIZ";
export const QUIZ_LIST_LOADING_START = "QUIZ_LIST_LOADING_START";
export const QUIZ_LIST_LOADING_END = "QUIZ_LIST_LOADING_END";

export const getQuizzes = () => async dispatch => {
  dispatch({
    type: QUIZ_LIST_LOADING_START
  });
  try {
    const quizzes = await doGet(quizBaseUrl);
    dispatch({
      type: GET_QUIZZES,
      payload: quizzes
    });
  } catch (e) {
    //todo:: add error handling using antd notifications
    notification.error({
      message: 'Oops! Something went wrong!',
      description: e.message,
    });
  } finally {
    dispatch({
      type: QUIZ_LIST_LOADING_END
    });
  }
};

export const deleteQuizById = quizId => dispatch => {
  dispatch({
    type: QUIZ_LIST_LOADING_START
  });
  doDelete(`${quizBaseUrl}/${quizId}`)
    .then(() => {
      dispatch(getQuizzes());
    })
    .catch(err => {
      notification.error({
        message: 'Oops! Something went wrong!',
        description: err.message,
      });
    })
    .finally(() => {
      dispatch({
        type: QUIZ_LIST_LOADING_END
      });
    });
};

export const updateQuizStatusById = (quizId, isActive) => dispatch => {
  doPut(`${quizBaseUrl}/${quizId}`, { isActive })
    .then(() => {
      dispatch(getQuizzes());
    })
    .catch(err => {
      notification.error({
        message: 'Oops! Something went wrong!',
        description: err.message,
      });
    })
    .finally(() => {
      dispatch({
        type: QUIZ_LIST_LOADING_END
      });
    });
};
