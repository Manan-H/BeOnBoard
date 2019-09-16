import React, { useEffect, useState } from "react";
import { doGet, doPost } from "../../utils/request";
import { quizBaseUrl } from "../../utils/apiEndpoints/quizEndpoints";
import {Card, Checkbox, Button, Modal, Progress, Icon, notification} from "antd";
import isObjectEmpty from "../../utils/objectValidator";
import Loading from "../Loading";
import { Link } from "react-router-dom";
import QuizPhoto from "./QuizPhoto";
import moment from 'moment';

const { confirm } = Modal;

const TakeQuiz = ({ match }) => {
  const [currentQuiz, setCurrentQuiz] = useState({});

  const [currentQuestAnswers, setCurrentQuestAnswers] = useState({});

  const [currentQuestId, setCurrentQuestId] = useState(null);

  const [quizAnswersArray, setQuizAnswersArray] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const [disableNext, setDisableNext] = useState(true);

  const [quizResults, setQuizResults] = useState(null);

  const quizResultStyle = {
    display: "flex",
    justifyContent: "center",
    marginTop: 20
  };

  const getCurrentQuiz = () => {
    setIsLoading(true);
    doGet(`${quizBaseUrl}/${match.params.id}`)
      .then(quiz => {
        setCurrentQuestId(quiz.questions[0].id);
        getActiveQuest(quiz, 0, { id: quiz.questions[0].id });
      })
      .catch(err => {
        notification.error({
          message: 'Oops! Something went wrong!',
          description: err.message,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getCurrentQuiz();
  }, [match.params.id]);

  const renderCheckBoxOptions = ({ options }) => {
    if (Array.isArray(options) && options.length) {
      return options.map((opt, index) => {
        return (
          <div key={`checkbox${index}`}>
            <Checkbox checked={true} value={opt.id}>
              {opt.text}
            </Checkbox>
            <br />
          </div>
        );
      });
    }

    return null;
  };

  const renderCheckBoxGroup = question => {
    return (
      <div className="customized-checkbox-group">
        <Checkbox.Group
          onChange={onGroupChange}
          defaultValue={
            (quizAnswersArray && quizAnswersArray[currentQuestId]) || []
          }
        >
          {renderCheckBoxOptions(question)}
        </Checkbox.Group>
      </div>
    );
  };

  const renderPhotoQuestion = quest => {
    return (
      <>
        <h2>{quest.head.content}</h2>
        <QuizPhoto
          handleAnswerCoords={coords => onCoordsSet(coords)}
          photo={quest.photo}
          getClientSetCoords={() => getQuestAnswersById()}
          targetStyle={{ borderRadius:'50%', opacity: '0.6', borderColor: 'green', backgroundColor: 'green' }}
        />
      </>
    );
  };

  const getQuestAnswersById = () => {
    return quizAnswersArray && quizAnswersArray[currentQuestId];
  };

  const onCoordsSet = coords => {
    if (!isObjectEmpty(coords) || !nextIsDisabledCondition(currentQuestId)) {
      !isObjectEmpty(coords) &&
        setCurrentQuestAnswers({ [currentQuestId]: coords });
      setDisableNext(false);
    } else {
      setDisableNext(true);
    }
  };

  const onGroupChange = checkedList => {
    if (checkedList.length) {
      setDisableNext(false);
    } else {
      setDisableNext(true);
    }
    setCurrentQuestAnswers({ [currentQuestId]: checkedList });
  };

  const nextIsDisabledCondition = questId => {
    if (!quizAnswersArray) {
      return true;
    }

    if (!quizAnswersArray[questId]) {
      return true;
    }

    if (
      !quizAnswersArray[questId].length &&
      !(quizAnswersArray[questId].x && quizAnswersArray[questId].y)
    ) {
      return true;
    }

    return false;
  };

  const showQuizResults = () => {
    const quizData = {
      quizId: match.params.id,
      answers: quizAnswersArray,
      time: moment().utc(true)._d
    }

    setIsLoading(true);
    doPost(`${quizBaseUrl}/result`, quizData)
      .then(response => {
        setQuizResults(response);
      })
      .catch(err => {
        notification.error({
          message: 'Oops! Something went wrong!',
          description: err.message,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const finishQuest = (quiz, activeQuestIndex) => {
    getActiveQuest(quiz, activeQuestIndex, null);
    showQuizResults();
  };

  const showConfirmFinishModal = index => {
    confirm({
      title: "Awesome!",
      content: "Submit your answers to see your results!",
      centered: true,
      okText: "Submit",
      cancelText: "Back To Questions",
      icon: <Icon type="like" style={{ color: "#1890ff" }} />,
      onOk() {
        finishQuest(currentQuiz, index + 1, null);
      },
      onCancel() {
        getActiveQuest(currentQuiz, index, {
          id: currentQuiz.questions[index].id
        });
      }
    });
  };

  const quizControllers = index => {
    if (
      index + 1 >= currentQuiz.questions.length &&
      currentQuiz.canFinish &&
      !isLoading
    ) {
      showConfirmFinishModal(index);
    }

    return (
      <div>
        {index - 1 >= 0 ? (
          <Button
            type="primary"
            style={{ marginRight: 10 }}
            onClick={() => {
              getActiveQuest(currentQuiz, index - 1, {
                id:
                  currentQuiz.questions[index - 1] &&
                  currentQuiz.questions[index - 1].id
              });
            }}
          >
            Previous
          </Button>
        ) : null}

        <Button
          type={
            index + 1 === currentQuiz.questions.length ? "danger" : "primary"
          }
          disabled={disableNext}
          onClick={() => {
            getActiveQuest(currentQuiz, index + 1, {
              id:
                currentQuiz.questions[index + 1] &&
                currentQuiz.questions[index + 1].id
            });
          }}
        >
          {index + 1 === currentQuiz.questions.length ? "Finish" : "Next"}
        </Button>
      </div>
    );
  };

  const getActiveQuest = (quiz, activeQuestIndex = 0, questData) => {
    if (activeQuestIndex < quiz.questions.length) {
      const formattedQuestions = quiz.questions.map((quest, index) => {
        if (index === activeQuestIndex) {
          return { ...quest, isActive: true };
        }

        return { ...quest, isActive: false };
      });
      currentQuiz.canFinish = false;
      setCurrentQuiz({
        ...quiz,
        questions: formattedQuestions
      });
      setCurrentQuestId(questData.id);
      setDisableNext(nextIsDisabledCondition(questData.id));
    } else {
      setCurrentQuiz({
        ...quiz,
        canFinish: true
      });
    }

    if (!isObjectEmpty(currentQuestAnswers)) {
      const answers = quizAnswersArray
        ? { ...quizAnswersArray, ...currentQuestAnswers }
        : { ...currentQuestAnswers };
      setQuizAnswersArray(answers);
      setCurrentQuestAnswers({});
    }
  };

  return (
    <Loading isLoading={isLoading}>
      <div className="quiz-container" style={quizResults && quizResultStyle}>
        {!quizResults ? (
          <div>
            <b
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2.3rem",
                marginBottom: 30
              }}
            >
              {currentQuiz.title}
            </b>
            <div
              className="quest-container"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "start"
              }}
            >
              {Array.isArray(currentQuiz.questions) &&
                currentQuiz.questions.map((question, index) => {
                  return (
                    question.isActive && (
                      <Card
                        key={`quest${index}`}
                        title={question.head.title}
                        style={{
                          width:
                            question.head.questionType === "coord"
                              ? "550px"
                              : "40%"
                        }}
                        extra={quizControllers(index)}
                      >
                        <div className="quiz-body">
                          <div className="quiz-body-question">
                            {question.head.questionType === "coord"
                              ? renderPhotoQuestion(question)
                              : renderCheckBoxGroup(question)}
                            <p
                              style={{
                                fontWeight: "bold",
                                position: "relative",
                                top: 28
                              }}
                            >
                              {`Question No. ${index + 1} of  ${
                                currentQuiz.questions.length
                              }`}
                            </p>
                          </div>
                        </div>
                      </Card>
                    )
                  );
                })}
            </div>
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              background: "rgba(0, 0, 0, 0.04)",
              width: 490,
              padding: 35,
              marginTop: 20,
              border: "1px solid rgba(0, 0, 0, 0.15)"
            }}
          >
            <b style={{ fontSize: "2.3rem" }}>
              {quizResults.status === "failed"
                ? "You failed the quiz"
                : "You passed the quiz"}
            </b>
            <p style={{ fontSize: "1.4rem" }}>Your score is</p>
            <Progress
              type="circle"
              format={() => `${quizResults.percent}%`}
              width={200}
              style={{
                marginBottom: 25
              }}
              strokeColor={{
                "0%": "#108ee9",
                "100%": "#87d068"
              }}
              percent={quizResults.percent}
            />
            <div style={{ fontSize: "1.4rem" }}>
              {quizResults.status === "failed" ? (
                <Button
                  onClick={() => {
                    window.location.reload();
                  }}
                  type="primary"
                >
                  Try Again!
                </Button>
              ) : (
                <Link to="/quizzes">
                  <Button type="primary">Take another quiz!</Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </Loading>
  );
};

export default TakeQuiz;
