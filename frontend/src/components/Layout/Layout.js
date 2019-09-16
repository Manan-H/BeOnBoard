import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {Layout as AntLayout, Menu, Icon, Avatar, Badge, Popover, notification} from "antd";
import Logo from "../../images/simply-logo-white-transparent-thick.png";
import { doPut } from "../../utils/request";
import { useDispatch } from "react-redux";
import {
  updateNotifications,
  getUserInfo, updateNotifStatus
} from "../../actions/currentUserActions";
import {
  updateNotificationsStatus,
} from "../../utils/apiEndpoints/usersEndpoints";

const { REACT_APP_API_ROOT, REACT_APP_VERSION } = process.env;
const { Header, Content, Footer, Sider } = AntLayout;

const Layout = props => {
  const dispatch = useDispatch();
  const headerFooterHeight = props.isScreenSmall ? 60 : 80;
  const userInfo = props.userInfo;
  const isLoggedIn = [1, 2].includes(userInfo.userType);
  const contentStyle = {
    background: "#fff",
    padding: isLoggedIn ? "24px 48px" : "0px",
    minHeight: `calc(100vh - ${headerFooterHeight * 2}px)`,
    zIndex: 1
  };
  const headerStyle = {
    height: `${headerFooterHeight}px`,
    backgroundColor: "#fff",
    zIndex: 2,
    boxShadow: "0 2px 8px #f0f1f2"
  };
  const logoStyle = {
    height: "auto",
    maxHeight: "100px",
    width: "auto",
    maxWidth: "90%",
    margin: "30px 10px"
  };

  const [collapsed, setCollapsed] = useState();
  const [collapsedLogo, setCollapsedLogo] = useState(logoStyle);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [
    notificationsCountFromProps,
    setNotificationsCountFromProps
  ] = useState(userInfo.newNotificationsCount);

  useEffect(() => {
    setNotificationsCountFromProps(userInfo.newNotificationsCount);
  }, [props]);

  const onCollapse = collapsed => {
    setCollapsed(collapsed);
    setCollapsedLogo({
      ...logoStyle,
      margin: collapsed ? "30px 3px" : "30px 10px"
    });
  };
  const popoverVisibleChangeHandler = () => {
    setNotificationsCountFromProps(0);
    setPopoverVisible(!popoverVisible);
    dispatch(updateNotifStatus());
    doPut(updateNotificationsStatus)
      .then(response => {
        console.log(response);
      })
      .catch(err => {
        notification.error({
          message: 'Oops! Something went wrong!',
          description: err.message,
        });
      });
  };
  const notifClickHandler = (notifId, message) => {
    if (message === "Your profile info has been changed by Admin!") {
      dispatch(getUserInfo());
    }
    setPopoverVisible(false);
    setNotificationsCountFromProps(0);
    dispatch(updateNotifications());
    doPut(updateNotificationsStatus, { notifId })
      .then(response => {
        dispatch(updateNotifications());
        console.log(response);
      })
      .catch(err => {
        notification.error({
          message: 'Oops! Something went wrong!',
          description: err.message,
        });
      });
  };
  const userSettings = (
    <div className="userSettings" style={{ paddingBottom: "1px" }}>
      <NavLink
        to={`/edit`}
        style={{ color: "rgba(0, 0, 0, 0.65)", fontSize: 15 }}
      >
        <p>
          <Icon type="setting" style={{ paddingRight: 5 }} />
          Edit Profile
        </p>
      </NavLink>
      {isLoggedIn ? (
        <NavLink
          style={{ color: "rgba(0, 0, 0, 0.65)", fontSize: 15 }}
          to={"#"}
          onClick={() => {
            window.location.replace(
              `${REACT_APP_API_ROOT}/api/${REACT_APP_VERSION}/auth/google/logout`
            );
          }}
        >
          <p>
            <Icon type="logout" style={{ paddingRight: 5 }} />
            Logout{" "}
          </p>
        </NavLink>
      ) : null}
    </div>
  );

  const notifications =
    userInfo.notifications instanceof Array && !!userInfo.notifications.length
      ? userInfo.notifications.map((item, index) => {
          return (
            <div
              key={`notifNum${index}`}
              style={{
                padding: "7px 0",
                borderBottom: "1px solid #ccc"
              }}
              onClick={() => notifClickHandler(item.id, item.message)}
            >
              <NavLink
                to={`/team/profile/${item.userId}`}
                style={{
                  display: "flex",
                  lineHeight: 1.4,
                  justifyContent: "space-between"
                }}
              >
                <span style={{ display: "flex" }}>
                  <span style={{ paddingRight: 15 }}>
                    {!item.profPic ? (
                      <Avatar
                        style={{
                          color: "#fff",
                          backgroundColor: "rgb(121, 148, 206)"
                        }}
                      >
                        {item.name && item.name[0]}{" "}
                        {item.surname && item.surname[0]}
                      </Avatar>
                    ) : (
                      <Avatar size={38} src={item.profPic} />
                    )}
                  </span>
                  <span style={{ color: "rgba(0,0,0,.87)" }}>
                    <b style={{ color: "#4183c4", fontSize: "14px" }}>
                      {item.name} {item.surname}
                    </b>
                    <br />
                    <span style={{color:"#0a0a0a9c", fontSize: "12.5px" }}>{item.message}</span>
                  </span>
                </span>
                {!item.seen && <Badge status="processing" text="New" />}
              </NavLink>
            </div>
          );
        })
      : <div>There is no notification yet</div>;


  const LoggedInSection = () => {
    return (
      <div className="custom-menu">
        <Menu mode="horizontal">
          <Menu.Item className="custom-menu-item" selectable={false}>
            <Popover
              placement="bottomRight"
              title={"My notifications"}
              content={notifications}
              trigger="click"
              visible={popoverVisible}
              onVisibleChange={popoverVisibleChangeHandler}
              style={{paddingBottom: "0"}}
            >
              <Badge
                count={
                  userInfo.hasUnseenNotifications
                    ? notificationsCountFromProps
                    : 0
                }
              >
                <Icon type="bell" style={{ fontSize: "22px" }} />
              </Badge>
            </Popover>
          </Menu.Item>

          <Menu.Item className="custom-menu-item" selectable={false}>
            <Popover
              placement="bottom"
              title={"Profile Settings"}
              content={userSettings}
              trigger="click"
              style={{ top: "66px !important" }}
            >
              <Avatar size={38} src={userInfo.profPic} />
              <span style={{ marginLeft: "12px", verticalAlign: "sub" }}>
                {userInfo.name}
              </span>
            </Popover>
          </Menu.Item>
        </Menu>
      </div>
    );
  };

  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      {isLoggedIn && (
        <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
          <a href="/">
            <div className="logo-container">
              <img
                className="logo"
                src={Logo}
                style={collapsedLogo}
                alt="simply-logo"
              />
            </div>
          </a>
          <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
            {props.menuItems.map((item, i) => (
              <Menu.Item key={"nav" + i}>
                <NavLink to={item.url}>
                  <Icon type={item.iconType} />
                  <span>{item.text}</span>
                </NavLink>
              </Menu.Item>
            ))}
          </Menu>
        </Sider>
      )}

      <AntLayout>
        {isLoggedIn && (
          <Header style={headerStyle}>
            <LoggedInSection />
          </Header>
        )}

        <Content style={contentStyle}> {props.children} </Content>
        <Footer style={{ height: headerFooterHeight }}>
          <p style={{ textAlign: "center" }}>
            Made with love by Interns of Summer'19
          </p>
        </Footer>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
