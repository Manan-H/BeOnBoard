import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  Skeleton,
  Icon,
  Row,
  Col,
  Progress,
  Result,
  Modal,
  Tag
} from "antd";
import Loading from "../Loading";
import { Link } from "react-router-dom";
import {
  getQuizzes,
  deleteQuizById,
  updateQuizStatusById
} from "../../actions/quizActions";

const { Meta } = Card;

const QuizList = props => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.currentUser);
  const quizListData = useSelector(state => state.quizList);
  const quizList = Object.values(quizListData.quizzes || {});
  const handleQuizDelete = (quizId, quizTitle) => {
    const modal = Modal.confirm({
      autoFocusButton: "cancel",
      cancelText: "Cancel",
      okText: "DELETE",
      okType: "danger",
      centered: true,
      title: `Do you really want to delete ${quizTitle}?`,
      content: "This action cannot be undone",
      icon: <Icon type="exclamation-circle" style={{ fontSize: "48px" }} />,
      onCancel: () => modal.destroy(),
      onOk: () => {
        modal.destroy();
        dispatch(deleteQuizById(quizId));
      }
    });
  };
  const handleQuizStatusChange = (quizId, status) => {
    dispatch(updateQuizStatusById(quizId, status));
  };
  const getActionIcons = quiz => {
    const commonActionIcons = [
      <Link
        to={{
          pathname: `/leaders-board/${quiz._id}`,
          state: quiz
        }}
      >
        <Icon type="trophy" />
      </Link>,
      <Link className={"pulse-icon"} to={`quizzes/${quiz._id}`}>
        <Icon type="rocket" />
      </Link>
    ];
    if (currentUser.userInfo.userType === 1) {
      return [
        <Link
          to={{
            pathname: "/quizzes/edit",
            state: {
              editQuiz: quiz
            }
          }}
        >
          <Icon type="edit" key="edit" />
        </Link>,
        <div onClick={() => handleQuizDelete(quiz._id, quiz.title)}>
          <Icon type="delete" />
        </div>,
        !quiz.isActive ? (
          <div onClick={() => handleQuizStatusChange(quiz._id, !quiz.isActive)}>
            <Icon type="eye-invisible" />
          </div>
        ) : (
          <div onClick={() => handleQuizStatusChange(quiz._id, !quiz.isActive)}>
            <Icon type="eye" />
          </div>
        ),
        ...commonActionIcons
      ];
    } else if (currentUser.userInfo.userType === 2) {
      return [...commonActionIcons];
    }
  };
  const renderQuizStatus = quizResult => {
    return (
      <div className="quiz-info">
        <ul>
          <li>
            <span>
              <Icon type="check-circle" style={{ marginRight: 10 }} />
              Status -{" "}
              <span style={{ textTransform: "capitalize" }}>
                {quizResult ? quizResult.status : "n/a"}
              </span>
            </span>
          </li>
          <li>
            <span>
              <Icon type="percentage" style={{ marginRight: 10 }} />
              Percent -{" "}
              <span style={{ textTransform: "capitalize" }}>
                {quizResult ? `${quizResult.percent}%` : "n/a"}
              </span>
            </span>
          </li>
          <li>
            <span>
              <Icon type="thunderbolt" style={{ marginRight: 10 }} />
              Score -{" "}
              <span style={{ textTransform: "capitalize" }}>
                {quizResult ? `${quizResult.score}pts` : "n/a"}
              </span>
            </span>
          </li>
        </ul>
      </div>
    );
  };

  useEffect(() => {
    (async () => {
      return await dispatch(getQuizzes());
    })();
  }, [dispatch]);

  return (
    <Loading isLoading={quizListData.isLoading}>
      {!quizList.length ? (
        <Result
          icon={<Icon type="eye-invisible" />}
          title={
            currentUser.userInfo.userType === 1
              ? "Nothing to show. Please create questions!"
              : "Sorry, We have no active quizzes right now. Try later!"
          }
        />
      ) : (
        <div className="quiz-list">
          <h1 style={{ fontSize: "2.5rem", marginBottom: 0 }}>Our Quizzes</h1>
          <p>Choose a quiz and test your knowledge</p>
          <Row gutter={16}>
            {quizList.map((quiz, index) => (
              <Col sm={24} xl={8} key={`quiz${index}`}>
                <Card
                  className="custom-card"
                  hoverable
                  style={{
                    width: "85%",
                    marginTop: 15,
                    marginBottom: 15,
                    cursor: "initial",
                    background: quiz.result
                      ? quiz.result.status === "failed"
                        ? "#b5232b"
                        : "#3fb574"
                      : "#1890ff"
                  }}
                  actions={getActionIcons(quiz)}
                >
                  {renderQuizStatus(quiz.result)}
                  <Skeleton loading={false} active>
                    <Meta
                      title={quiz.title}
                      description={quiz.description || "Description"}
                    />
                  </Skeleton>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </Loading>
  );
};

export default QuizList;
