import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, Input, Icon, Modal, List } from "antd";
import { withRouter, Link, Redirect } from "react-router-dom";
import Loading from "./Loading";

import { getUsers, deleteUser } from "../actions/userListActions";
const { Meta } = Card;

const UserList = props => {
  const userList = useSelector(state => state.userList);
  const users = Object.values(userList.users);
  const isLoading =
    userList.isLoading === undefined ? true : userList.isLoading;

  const dispatch = useDispatch();
  useEffect(() => dispatch(getUsers()), [dispatch]);

  const [filter, setFilter] = useState("");

  const filteredUsers =
    filter &&
    users.filter(({ name, surname }) => {
      return (
        name.toLowerCase().includes(filter) ||
        surname.toLowerCase().includes(filter)
      );
    });
  const searchIcon = <Icon type="search" />;

  const isAdmin = useSelector(
    state => state.currentUser.userInfo.userType === 1
  );

  const confirmDelete = (id, name) => {
    const modal = Modal.confirm({
      autoFocusButton: "cancel",
      cancelText: "Don't delete anyone",
      okText: "DELETE",
      okType: "danger",
      centered: true,
      title: `Do you really want to delete ${name}?`,
      content: "This action cannot be undone",
      icon: <Icon type="exclamation-circle" style={{ fontSize: "48px" }} />,
      onCancel: () => modal.destroy(),
      onOk: () => {
        modal.destroy();
        dispatch(deleteUser(id));
      }
    });
  };

  const usersStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center"
  };


  return (
    <Loading isLoading={isLoading}>
      <div
        className="UserList"
        style={{ textAlign: "center", margin: "0 10%", position: "relative" }}
      >
        <Input
          prefix={searchIcon}
          value={filter}
          onChange={e => setFilter(e.target.value.trim().toLowerCase())}
          style={{ width: "50%", minWidth: "200px", marginBottom: "20px" }}
          placeholder="filter users by name or surname"
        />
        <div className="Users" style={usersStyle}>
          {(filter ? filteredUsers : users).map((user, index) => {
            return (            
              <div className="cardContainer" key={`user ${index}`}>
                <div className="cardWrapper">
                  <div className="cardFront">
                    <Card
                      hoverable
                      key={user._id}
                      style={{ width: "100%" }}
                      bodyStyle={{ padding: "0" }}
                      className="userCard"
                      cover={
                        <img
                          alt="example"
                          src={
                            user.profPic ||
                            "https://www.nelson-chambers.co.uk/front/images/default-user.jpg"
                          }
                          style={{
                            height: "200px",
                            objectFit: "cover"
                          }}
                        />
                      }
                    >
                      <Meta
                        style={{ paddingTop: "8px" }}
                        title={
                          <span>
                            {user.name} {user.surname}
                          </span>
                        }
                        description={
                          <div>
                            <p>{user.position}</p>
                          </div>
                        }
                      />

                      {isAdmin && (
                        <div
                          style={{
                            marginTop: "10px",
                            border: "1px solid #e8e8e8",
                            padding: "7px"
                          }}
                        >
                          <div
                            style={{
                              width: "50%",
                              borderRight: "1px solid #e8e8e8",
                              display: "inline-block"
                            }}
                          >
                            <Icon type="edit" style={{ color: "#595959" }} />
                          </div>
                          <div
                            style={{
                              width: "50%",
                              display: "inline-block"
                            }}
                          >
                            <Icon type="user-delete" />
                          </div>
                        </div>
                      )}
                    </Card>
                  </div>

                  <div className="cardBack">
                    <div className="cardSkills">
                      <Link to={`${props.match.url}/profile/${user._id}`}>
                        <h3 style={{ marginBottom: "15px" }}>
                          Professional Skills
                        </h3>
                        <List
                          style={{
                            textAlign: "center",
                            padding: "0 30px"
                          }}
                          itemLayout="horizontal"
                          dataSource={user.professionalSkills}
                          renderItem={item => (
                            <List.Item style={{ padding: "4px 0" }}>
                              <List.Item.Meta title={item} />
                            </List.Item>
                          )}
                        />
                      </Link>

                      {isAdmin && (
                        <div
                          style={{
                            marginTop: "10px",
                            border: "1px solid #e8e8e8",
                            padding: "7px",
                            position: "absolute",
                            width: "240px",
                            bottom: 0
                          }}
                        >
                          <Link to={`${props.match.url}/edit/${user._id}`}>
                            <div
                              style={{
                                width: "50%",
                                borderRight: "1px solid #e8e8e8",
                                display: "inline-block"
                              }}
                            >
                              <Icon type="edit" style={{ color: "#595959" }} />
                            </div>
                          </Link>
                          <div
                            onClick={() => confirmDelete(user._id, user.name)}
                            style={{
                              width: "50%",
                              display: "inline-block"
                            }}
                          >
                            <Icon type="user-delete" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {isLoading ? null : users.length === 0 ? (
            <div>
              <h3>There are no users to show</h3>
            </div>
          ) : filter && filteredUsers.length === 0 ? (
            <div>
              <h3>Couldn't find any users with name {filter}</h3>
            </div>
          ) : null}
        </div>
      </div>
    </Loading>
  );
};

export default withRouter(UserList);
