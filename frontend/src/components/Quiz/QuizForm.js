import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
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

const marginLarge = {
  marginBottom: 32
};

const margin = {
  marginBottom: 16
};
const marginSmall = {
  marginBottom: 8
}


const QuizForm = props => {
  const dispatch = useDispatch();
  const { editQuiz } = props;
  const editQuizList = editQuiz && editQuiz.questions.reduce( (list, question) =>{
    return { ...list, [question.id]: question }
  }, {});


  const initialHeadState = {
    title: "",
    questionType: "text",
    content: ""
  };

  const initialOptionsState = {
    0: { id: 0, text: "" },
    1: { id: 1, text: "" }
  };

  const [list, setList] = useState(editQuizList || {});

  const [head, setHead] = useState(initialHeadState);
  const [numberOfOptions, setNumberOfOptions] = useState(2);
  const [options, setOptions] = useState(initialOptionsState);
  const [correctOptions, setCorrectOptions] = useState([]);

  const [selectedQuestionId, selectQuestionId] = useState(null);


  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const newCorrectOptions = [];
    const newOptions = Array(numberOfOptions)
      .fill("")
      .reduce((acc, _, i) => {
        const option = options[i] || {};
        const id = option.id || i;
        const text = option.text || "";
        if (correctOptions.includes(id)) newCorrectOptions.push(id);
        return { ...acc, [i]: { id, text } };
      }, {});

    setOptions(newOptions);
    setCorrectOptions(newCorrectOptions);
  }, [numberOfOptions]);

  useEffect(() => {
    if (!selectedQuestionId) return;
    const selectedItem = list[selectedQuestionId];
    if (!selectedItem) return;

    setHead(selectedItem.head);
    setOptions(
      selectedItem.options.reduce((options, option) => {
        return {
          ...options,
          [option.id]: { id: option.id, text: option.text }
        };
      }, {})
    );
    setCorrectOptions(selectedItem.correctOptions);
  }, [selectedQuestionId]);

  const createQuestion = () => {
    if (!head.content) {
      notification.info({
        message: "Wait...",
        description: "Your question needs to have content"
      });
      return;
    }

    if (!correctOptions.length) {
      notification.info({
        message: "Wait...",
        description: "Your question needs at least one correct answer"
      });
      return;
    }

    const id = selectedQuestionId || uuidv4();
    const newQuestion = {
      id,
      head,
      options: Object.values(options),
      correctOptions
    };
    setList({ ...list, [id]: newQuestion });
    reset();
  };

 

  const reset = () => {
    setHead(initialHeadState);
    setNumberOfOptions(2);
    setOptions(initialOptionsState);
    setCorrectOptions([]);
    selectQuestionId(null);
  };

  const setContent = content => {
    setHead({ ...head, content });
  };

  const setTitle = title => {
    setHead({ ...head, title });
  };

  const setType = title => {
    setHead({ ...head, title });
  };

  const setOptionText = (id, value) => {
    setOptions({
      ...options,
      [id]: { id, text: value }
    });
  };

  const handleCorrect = (id, value) => {
    if (value) {
      setCorrectOptions([...correctOptions, id]);
      return;
    }
    setCorrectOptions(correctOptions.filter(val => val !== id));
  };

  const handleOptionNumberChange = n => {
    if (isNaN(n)) return;
    if (n < 2) {
      notification.info({
        message: "Wait...",
        description: "Minimum two fields required"
      });
      return;
    }

    const currentOptions = Object.values(options);
    if (
      n > currentOptions.length &&
      currentOptions.find(option => option.text === "")
    ) {
      notification.info({
        message: "Wait...",
        description: "You still have empty fields"
      });
      return;
    }
    setNumberOfOptions(n);
  };

  const remove = id => {
    const newList = { ...list };
    delete newList[id];
    setList(newList);
    if (selectedQuestionId === id) {
      reset();
    }
  };

  const confirmRemove = id => {
    Modal.confirm({
      onOk: () => remove(id),
      cancelText: "Cancel",
      okText: "Remove",
      okType: "danger",
      icon: null,
      content: "Do you want to remove this question?"
    });
  };

  return (
    <div className="QuestionForm">
      <Row gutter={48}>
        <Col xs={{ span: 24 }} md={{ span: 22 }} lg={{ span: 10 }}>
          <div style={marginLarge}>
            <p>{selectedQuestionId ? "Edit question" : "New question"}</p>
            <Input
              placeholder="title"
              value={head.title}
              onChange={e => setTitle(e.target.value)}
              style={margin}
            />

            <Input.TextArea
              placeholder="content"
              value={head.content}
              onChange={e => setContent(e.target.value)}
              style={{ ...margin, resize: "none" }}
              autosize={{ minRows: 2 }}
            />

            <span>Number of options: </span>
            <InputNumber
              value={numberOfOptions}
              onChange={n => handleOptionNumberChange(n)}
              style={margin}
            />

            {Object.values(options).map(option => {
              return (
                <div className="option" key={`opt${option.id}`} style={margin}>
                  <p style={marginSmall}>Option {option.id + 1} </p>
                  <Input.TextArea
                    placeholder="insert option here"
                    value={option.text}
                    onChange={e => setOptionText(option.id, e.target.value)}
                    style={{ ...marginSmall, resize: "none" }}
                    autosize={true}
                  />
                  <Checkbox
                    onChange={e => handleCorrect(option.id, e.target.checked)}
                    checked={correctOptions.includes(option.id)}
                  >
                    {" "}
                    is correct?{" "}
                  </Checkbox>
                </div>
              );
            })}

            {selectedQuestionId ? (
              <Button
                onClick={reset}
                style={{ marginRight: "16px" }}
                loading={isLoading}
                disabled={isLoading}
              >
                Cancel
              </Button>
            ) : null}

            <Button
              type="primary"
              onClick={createQuestion}
              loading={isLoading}
              disabled={isLoading}
            >
              {selectedQuestionId ? "Save" : "Add question"}
            </Button>
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
  );
};

export default QuizForm;
