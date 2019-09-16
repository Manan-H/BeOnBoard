import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Collapse, Input, Checkbox, Button, notification  } from 'antd';

import { request } from '../../utils/request';
import doUpload from '../../utils/doUpload';
import { quizBaseUrl, photoQuizBaseUrl } from '../../utils/apiEndpoints/quizEndpoints';

const { Panel } = Collapse;

const marginLarge = {
  marginBottom: 32
}

const margin = {
  marginBottom: 16
}


const CreateQuiz = props => {

  const {
    list,
    type,
    isLoading,
    setIsLoading,
    editQuiz
  } = props;

  const ACTION = editQuiz ? 'Edit' : 'Create';

  const editQuizTitle = editQuiz && editQuiz.title;
  const editQuizDescription = editQuiz && editQuiz.description;
  const editQuizIsActive = editQuiz && editQuiz.isActive;
  const editQuizId = editQuiz && editQuiz._id;

  const [quizTitle, setQuizTitle] = useState(editQuizTitle || '');
  const [quizDescription, setQuizDescription] = useState(editQuizDescription || '');
  const [isQuizActive, setIsQuizActive] = useState(editQuizIsActive || false);

  const [success, setSuccess] = useState(false);

  const createQuiz = () => {

    if (!quizTitle) {
      notification.info({
        message: 'Wait...',
        description: 'Your quiz needs a title'
      })
      return;
    }

    if (!Object.keys(list).length) return;
            
    const newQuiz = {
      _id: editQuizId,
      type: 'classic',
      title: quizTitle,
      description: quizDescription,
      isActive: isQuizActive,
      questions: Object.values(list)
    }

    setIsLoading(true);

    request(`${quizBaseUrl}${ editQuizId ? '/'+editQuizId : ''}`, editQuiz ? 'put' : 'post', newQuiz)
      .then( res => {
        notification.success({
          message: 'Success!',
          description: `Quiz was successfully ${ editQuiz ? 'updated' : 'created'}`
        })
        setSuccess(true);
      })
      .catch( err => {
        notification.error({
          message: 'Error',
          description: 'Something went wrong, quiz wasnt saved'
        })
      })
      .finally( ()=>setIsLoading(false));

  }

  const createPhotoQuiz = () => {
    if (!quizTitle) {
      notification.info({
        message: 'Wait...',
        description: 'Your quiz needs a title'
      })
      return;
    }

    if (!Object.keys(list).length) return;

    const formData = new FormData();
            
    const questions = Object.values(list).map( question =>{
      if (question.photo.data) {
        formData.append(question.photo.id, question.photo.data);
        return {
          ...question,
          photo: question.photo.id
        }
      }
      return question;

    })

    const newQuiz = {
      _id: editQuizId,
      type: 'coord',
      title: quizTitle,
      description: quizDescription,
      isActive: isQuizActive,
      questions
    }

    formData.append('quiz', JSON.stringify(newQuiz));

    setIsLoading(true);

    doUpload(photoQuizBaseUrl, formData)
      .then( res => {
        notification.success({
          message: 'Success!',
          description: `Quiz was successfully ${ editQuiz ? 'updated' : 'created'}`
        })
        setSuccess(true);
      })
      .catch( err => {
        notification.error({
          message: 'Error',
          description: 'Something went wrong, quiz wasnt saved'
        })
      })
      .finally( ()=>setIsLoading(false));
  }

  if (success) {
    return <Redirect to="/quizzes" />
  }

  return (
    <div className="CreateQuiz">
      <Collapse bordered={false} style={marginLarge}>
        <Panel header={`${ACTION} Quiz (${Object.keys(list).length} question${Object.keys(list).length>1 ? 's' : ''})`}>
          <p>Quiz title</p>
          <Input 
            value={quizTitle} 
            onChange={e=>setQuizTitle(e.target.value)} 
            style={margin}
          />
          <p>Quiz description</p>
          <Input.TextArea
            autosize={true} 
            value={quizDescription} 
            onChange={e=>setQuizDescription(e.target.value)} 
            style={{...margin,  resize: 'none' }}
          />
          <Checkbox 
            value={isQuizActive} 
            onChange={e=>setIsQuizActive(e.target.checked)}
            style={margin}
          > is active? </Checkbox>
          <div>
          <Button 
            type="primary" 
            onClick={ type === 'coord' ? createPhotoQuiz : createQuiz }
            loading={isLoading}
            disabled={isLoading}
          >
            Save Quiz
          </Button></div>
        </Panel>
      </Collapse>
    </div>
  )
}

export default CreateQuiz;

