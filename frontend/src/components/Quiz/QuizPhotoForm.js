import React, { useState, useEffect } from 'react';
import { 
  Input,
  InputNumber, 
  Button, 
  Checkbox, 
  notification,
  Row,
  Col,
  Modal
} from 'antd';
import uuidv4 from 'uuid/v4';


import CreateQuiz from './CreateQuiz';
import QuizListQuestions from './QuizListQuestions';
import QuizPhoto from './QuizPhoto';
import Upload from '../Upload';
// import QuizListPhotos from './QuizListPhotos';


const marginLarge = {
  marginBottom: 32
}

const margin = {
  marginBottom: 16
}
const marginSmall = {
  marginBottom: 8
}


const QuizPhotoForm = props => {

  const { editQuiz } = props;
  const editQuizList = editQuiz && editQuiz.questions.reduce( (list, question) =>{
    return { ...list, [question.id]: question }
  }, {});


  const initialHeadState = {
    title: '',
    questionType: 'coord',
    content: ''
  };

 
  const [ list, setList ] = useState(editQuizList || {});

  const [head, setHead] = useState(initialHeadState);
  const [ photo, setPhoto ] = useState({});
  const [correctRange, setCorrectRange] = useState({});
  const [targetSize, setTargetSize] = useState(0.1);

  const [selectedQuestionId, selectQuestionId] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(()=>{
    if (!selectedQuestionId) return;
    const selectedItem = list[selectedQuestionId];
    if (!selectedItem) return;

    setHead(selectedItem.head); 
    setPhoto(selectedItem.photo);   
    setCorrectRange(selectedItem.correctRange);
    setTargetSize(selectedItem.targetSize);

  }, [selectedQuestionId])


  const createQuestion = () => {

    if (!head.content) {
      notification.info({
        message: 'Wait...',
        description: 'Your question needs to have content'
      })
      return;
    }
   
    const id = selectedQuestionId || uuidv4();
    const newQuestion = {
      id,
      head,
      photo,
      targetSize,
      correctRange
    }
    setList({ ...list, [id]:newQuestion });
    reset();
  }


  const reset = () => {
    setHead(initialHeadState);
    setPhoto(null);
    setCorrectRange({});
    selectQuestionId(null); 
    setTargetSize(0.1); 
  }

  const setContent = content => {
    setHead({...head, content});
  }

  const setTitle = title => {
    setHead({...head, title});
  }

  const remove = id => {
    const newList = {...list};
    delete newList[id];
    setList(newList);
    if(selectedQuestionId === id) {
      reset();
    }
  }

  const confirmRemove = id => {
    Modal.confirm({
      onOk: ()=> remove(id),
      cancelText: 'Cancel',
      okText: 'Remove',
      okType: 'danger',
      icon: null,
      content: 'Do you want to remove this question?'
     
    })
  }


  return (
    <div className="QuestionForm"> 
      <Row gutter={48}>
        <Col 
          xs={{ span:24}} 
          md={{ span:22 }} 
          lg={{ span:10 }} 
        >
          <div style={marginLarge} >
            <p>{ selectedQuestionId ? 'Edit question' : 'New question'}</p>
          <Input
            placeholder="title"
            value={head.title}
            onChange={ e => setTitle(e.target.value) }
            style={margin}
          />

          <Input.TextArea 
            placeholder="content"
            value={ head.content }
            onChange={ e => setContent(e.target.value) }
            style={{...margin, resize:'none'}}
            autosize={{ minRows: 2}}

          />

      <Upload 
        accept='image'
        handlePreviews={ previews => setPhoto((previews[0] || {}))}
        style={marginLarge}
        setClien       
      />

        {
          photo &&
          <QuizPhoto 
            photo={photo}
            handleTargetChange={setCorrectRange}
            handlePhotoChange={setPhoto}
            targetPosition={ correctRange.x ? { x: correctRange.x.start, y: correctRange.y.start} : null }
            handleTargetSize={ targetSize => setTargetSize(targetSize)}
            targetSize={ targetSize }
          />
        }


          { selectedQuestionId ? 
            <Button 
              onClick={ reset } 
              style={{ marginRight: '16px'}} 
              loading={isLoading}
              disabled={isLoading}
            >Cancel</Button> : null }
          { photo ?
               <Button 
               type="primary" 
               onClick={createQuestion}
               loading={isLoading}
               disabled={isLoading}
             >{ selectedQuestionId ? 'Save' : 'Add question' } 
             </Button> : null
          }
     
            
          </div>
        </Col>
        <Col 
         xs={{ span:24}} 
         md={{ span:22 }} 
         lg={{ span:14 }} 
        >
          { Object.keys(list).length ? 
          <>

            <CreateQuiz 
              list={list}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              editQuiz={editQuiz}
              type='coord'
            />

            <QuizListQuestions 
              list={list}
              selectQuestionId={selectQuestionId}
              selectedQuestionId={selectedQuestionId}
              confirmRemove={confirmRemove}
            />

          </>
        : null }          
        </Col>        
      </Row>
    </div>
  )
}

export default QuizPhotoForm;