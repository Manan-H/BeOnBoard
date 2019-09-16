import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import Layout from "./Layout";

const LayoutContainer = props => {
  const [isScreenSmall, setIsScreenSmall] = useState(window.innerWidth <= 480);
  const [showMenu, setShowMenu] = useState(false);
  const userInfo = useSelector(state => state.currentUser.userInfo);
  const { userType, firstLogin } = userInfo;
  const SMALL_SCREEN_WIDTH = 480;

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  const handleResize = () => {
    if (isScreenSmall && window.innerWidth <= SMALL_SCREEN_WIDTH) return;
    if (!isScreenSmall && window.innerWidth > SMALL_SCREEN_WIDTH) return;

    setIsScreenSmall(window.innerWidth <= SMALL_SCREEN_WIDTH);
    setShowMenu(false);
  };

  // Menu Items for different user roles and first login case
  const unauthorized = [{ text: "Login", url: "/login", iconType: "login" }];
  const firstLoginMenu = [
    {
      text: "Complete Registration",
      url: "/complete-registration",
      iconType: "form"
    }
  ];
  const user = [
    { text: "My Profile", url: "/my-profile", iconType: "user" },
    { text: "Team", url: "/team", iconType: "team" },
    //{ text: "Leaderboard", url: "/leaders-board", iconType: "ordered-list" },
    { text: "Gallery", url: "/gallery", iconType: "picture" },
    { text: "Quizzes", url: "/quizzes", iconType: "fire" },
    { text: "Documents", url: "/documents", iconType: "file-add" }
  ];
  const admin = [
    { text: "Quiz Feed", url: "/quiz-history", iconType: "history" },
    { text: "Create Quiz", url: "/create-quiz", iconType: "build" },
    { text: "Create User", url: "/create-user", iconType: "plus" }
  ];

  const menuItemTypes = { 1: [...user, ...admin], 2: user };
  const menuItems = firstLogin
    ? firstLoginMenu
    : menuItemTypes[userType] || unauthorized;

  return (
    <Layout
      {...props}
      isScreenSmall={isScreenSmall}
      showMenu={showMenu}
      setShowMenu={setShowMenu}
      menuItems={menuItems}
      userInfo={userInfo}
    />
  );
};

export default withRouter(LayoutContainer);
