import React, { useEffect, useState } from "react";
import {List, Avatar, Skeleton, Typography, notification} from "antd";
import { doGet } from "../../utils/request";
import { quizLeaderboardUrl } from "../../utils/apiEndpoints/quizEndpoints";
import { Link } from "react-router-dom";
import Loading from "../Loading";

const QuizLeaderBoard = ({ match, location }) => {
  useEffect(() => {
    fetchLeaderBoard();
  }, []);

  const [leaderBoard, setLeaderBoard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { Title } = Typography;
  const fetchLeaderBoard = () => {
    setIsLoading(true);
    doGet(`${quizLeaderboardUrl}/${match.params.id}`)
      .then(response => {
        setLeaderBoard(response);
      })
      .catch(err => {
          notification.error({
              message: 'Oops! Something went wrong!',
              description: err.message,
          });
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="leaderBoardContainer">
      <Title level={2} style={{ marginBottom: 60, paddingLeft: "12%" }}>
        <span style={{ color: "#1890ff" }}>{location.state.title} </span>
        Leaderboard
      </Title>
      <Loading isLoading={isLoading}>
        <List
          itemLayout="horizontal"
          style={{ padding: "0 15%" }}
          dataSource={leaderBoard}
          renderItem={(item, index) => (
            <List.Item style={{ position: "relative" }} key={`item ${index}`}>
              <Skeleton avatar title={false} loading={item.loading} active>
                <List.Item.Meta
                  avatar={<Avatar src={item.user.profPic} />}
                  title={
                    <Link to={`/team/profile/${item.user._id}`}>
                      {item.user.name} {item.user.surname}
                    </Link>
                  }
                  description={item.user.position}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    left: "-20px",
                    fontWeight: "500"
                  }}
                >
                  {index + 1}
                </div>
                <div>{item.score}</div>
              </Skeleton>
            </List.Item>
          )}
        />
      </Loading>
    </div>
  );
};

export default QuizLeaderBoard;
