import React, { useEffect, useState } from "react";
import moment from "moment";
import {Table, Tag, Icon, notification} from "antd";
import { doGet } from "../../utils/request";
import { quizHistoryUrl } from "../../utils/apiEndpoints/quizHistoryEndpoints";

const QuizHistory = () => {
  useEffect(() => {
    fetchQuizHistory();
  }, []);

  const [quizHistory, setQuizHistory] = useState([]);
  const [ isLoading, setIsLoading ] = useState(false);
  const fetchQuizHistory = () => {
    setIsLoading(true);
    doGet(`${quizHistoryUrl}`)
      .then(response => {
        console.log(response);
        setQuizHistory(response);
      })
      .catch(err => {
        notification.error({
          message: 'Oops! Something went wrong!',
          description: err.message,
        });
      })
      .finally(() => {
        setIsLoading(false);
      })
  };
  
  
  const columns = [
    {
      title: "Name",
      dataIndex: "user",
      key: "user",
      render: user => (
        <span style={{fontWeight: 600 }}>
          { !user ? 'Deleted User' : `${user.name}  ${user.surname}`}
        </span>
      )
    },
    {
      title: "Quiz",
      dataIndex: "quiz",
      key: "quiz",
      render: quiz => (
        quiz != null ? <span>{quiz.title}</span> : <span>Quiz has been deleted</span>
      ) 
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score"
    },
    {
      title: "Result",
      key: "status",
      dataIndex: "status",
      render: status => (
        <Tag color={status === "passed" ? "green" : "volcano"} key={status}>
          {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: "Date",
      key: "date",
      dataIndex: "date",
      render: date => (
          <div>
              <p style={{margin:0}}><Icon type="calendar" /> {moment(date).format("DD-MM-YYYY")}</p>

              <p style={{margin:0}}><Icon type="hourglass" /> {date.substring(11,19)}</p>

          </div>
      )
    }
  ];

  return (
    
        <div>
      <Table loading={isLoading} columns={columns} dataSource={quizHistory} rowKey="date" />
    </div>
      
  );
};

export default QuizHistory;
