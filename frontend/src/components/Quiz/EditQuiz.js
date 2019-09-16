import React from 'react';
import QuizForm from './QuizForm';
import QuizPhotoForm from './QuizPhotoForm';
import { Redirect } from 'react-router-dom';

const EditQuiz = props => {

  if (!props.location || !props.location.state) {
    return <Redirect to="/quizzes" />
  }

  const editQuiz = props.location.state.editQuiz;

  if (editQuiz.type === 'classic') {
    return <QuizForm editQuiz={editQuiz} />
  }

  if (editQuiz.type === 'coord') {
    return <QuizPhotoForm editQuiz={editQuiz} />
  }

  return <Redirect to="/quizzes" />


}

export default EditQuiz;